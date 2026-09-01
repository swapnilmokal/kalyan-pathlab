/* =====================================================================
   Kalyan Pathlab - Google Apps Script Backend (मोफत)
   ---------------------------------------------------------------------
   हे काय करते:
   1. बुकिंग फॉर्मचा डेटा Google Sheet मध्ये आपोआप, नीट फॉरमॅट करून
      (रंगीत हेडर, व्यवस्थित कॉलम) एका "डेटाबेस" सारखं सेव्ह करते.
   2. बुकिंग झाल्यावर लॅब मालकाला (तुम्हाला) एक सुंदर, व्यवस्थित ईमेल
      जातो — त्यात पेशंटची सगळी माहिती व "पूर्ण डेटाबेस पहा" ही थेट
      लिंकसुद्धा असते, जेणेकरून फोनवरूनही एका क्लिकवर पूर्ण यादी दिसेल.
      ग्राहकाने ईमेल दिला असल्यास त्यालाही कन्फर्मेशन जाते.
      — सगळं आपोआप, पूर्ण मोफत, तुम्हाला काहीही बटण दाबायची गरज नाही.
   3. रिव्ह्यूज सुद्धा Sheet मध्ये सेव्ह करते (Status = Pending) —
      तुम्ही स्वतः Sheet मध्ये जाऊन "Approved" असं टाईप केल्याशिवाय
      तो रिव्ह्यू वेबसाईटवर कधीही दिसणार नाही (व्हेरिफिकेशन तुमच्याच
      हातात).
   4. Reviews Sheet मध्ये जास्तीत जास्त 50 रिव्ह्यू ठेवले जातात —
      51 वा रिव्ह्यू आला की सगळ्यात जुना (Approved असो वा Pending)
      आपोआप डिलीट होतो, त्यामुळे यादी नेहमी जास्तीत जास्त 50 एवढीच
      राहते.
   5. पेशंटने डॉक्टरचं प्रिस्क्रिप्शन (फोटो/PDF) अपलोड केलं असेल, तर ती
      फाईल आपोआप तुमच्या Google Drive मध्ये "Kalyan Pathlab -
      Prescriptions" नावाच्या फोल्डरमध्ये सेव्ह होते, आणि तिची लिंक
      Sheet मध्ये व ईमेलमध्येही दिसते.

   ⚠️ आधीच एकदा हा Apps Script डिप्लॉय केला असेल आणि आता फक्त कोड
   अपडेट करत असाल, तर："New deployment" नाही — त्याऐवजी वरती उजवीकडे
   "Deploy" > "Manage deployments" > पेन्सिल (✏️) आयकॉन > "Version:
   New version" निवडा > "Deploy". (Web app URL तोच राहतो, बदलायची
   गरज नाही.)

   ================= सेटअप कसा करायचा (मोबाईलवरून) =====================
   1. Chrome मध्ये थेट ही लिंक उघडा: https://script.google.com/home
   2. "+ New project" वर टॅप करा (डावीकडे किंवा वरती दिसेल)
   3. आत जे डीफॉल्ट कोड असेल (function myFunction() {}) ते पूर्ण
      डिलीट करून, खालचा पूर्ण कोड इथे पेस्ट करा
   4. वरती नाव बदलू शकता (उदा. "Kalyan Pathlab Backend"), मग 💾 Save
      आयकॉनवर टॅप करा
   5. वरती उजवीकडे "Deploy" > "New deployment" टॅप करा
      - ⚙️ आयकॉनवर टॅप करून Type: "Web app" निवडा
      - Execute as: "Me"
      - Who has access: "Anyone"
      - "Deploy" दाबा (पहिल्यांदा परवानगी मागेल - Advance > Go to...
        (unsafe) > Allow असं करून परवानगी द्या)
   6. एक "Web app URL" मिळेल (https://script.google.com/macros/s/xxxx/exec)
      ही लिंक कॉपी करा.
   7. app.js फाईलमध्ये वरती CONFIG.appsScriptUrl मध्ये ही लिंक पेस्ट करा.
   8. झालं! आता बुकिंग व रिव्ह्यू आपोआप Sheet मध्ये जमा होतील + ईमेल जाईल.

   (टीप: वरचा कोड "Kalyan Pathlab Data" या ठराविक Sheet शी थेट जोडलेला
   आहे — त्यामुळे हा स्वतंत्र (standalone) प्रोजेक्ट म्हणून बनवला तरी
   चालतो, Sheet मधून "Extensions" द्वारे उघडायची गरज नाही.)
   ===================================================================== */

const LAB_OWNER_EMAIL = "kalyan.pathlab.21@gmail.com";
const LAB_NAME = "Kalyan Pathlab";
const BRAND_COLOR = "#0b1440";
const ACCENT_COLOR = "#e5030a";
const PRESCRIPTION_FOLDER_NAME = "Kalyan Pathlab - Prescriptions";
const MAX_REVIEWS = 50; // Reviews Sheet मध्ये जास्तीत जास्त एवढेच रिव्ह्यू ठेवायचे — यापेक्षा जास्त झाल्यास सगळ्यात जुने आपोआप डिलीट होतील
const SPREADSHEET_ID = "18VyPSHOMhxpDNseeZtMHGXvzaCDQVc1ew4g0qoKO02I"; // "Kalyan Pathlab Data" या शीटचा आयडी — बदलण्याची गरज नाही

function getSheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = getSheet_();

  if (data.type === "booking") {
    const prescriptionUrl = saveprescriptionIfAny(data);
    saveBooking(ss, data, prescriptionUrl);
    sendBookingEmails(ss, data, prescriptionUrl);
  } else if (data.type === "review") {
    saveReview(ss, data);
  } else if (data.type === "adminAction") {
    if (!checkAdminPassword(data.password)) {
      return ContentService.createTextOutput(JSON.stringify({ error: "unauthorized" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    handleAdminAction(ss, data);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// प्रिस्क्रिप्शन फोटो/PDF दिला असल्यास तो Google Drive मध्ये सेव्ह करून त्याची लिंक परत देते
function saveprescriptionIfAny(d) {
  if (!d.prescriptionBase64) return "";
  try {
    let folder;
    const folders = DriveApp.getFoldersByName(PRESCRIPTION_FOLDER_NAME);
    folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(PRESCRIPTION_FOLDER_NAME);

    const bytes = Utilities.base64Decode(d.prescriptionBase64);
    const blob = Utilities.newBlob(bytes, d.prescriptionType || "application/octet-stream",
      `${d.fullName || "patient"}_${d.phone || ""}_${new Date().getTime()}_${d.prescriptionName || "prescription"}`);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    return ""; // फाईल सेव्ह करता आली नाही तरी बुकिंग पुढे चालू राहील
  }
}

function doGet(e) {
  const ss = getSheet_();
  if (e.parameter.action === "reviews") {
    return ContentService.createTextOutput(JSON.stringify(getApprovedReviews(ss)))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (e.parameter.action === "tests") {
    return ContentService.createTextOutput(JSON.stringify(getTestsFromSheet(ss)))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (e.parameter.action === "patientLookup") {
    return ContentService.createTextOutput(JSON.stringify(lookupPatient(ss, e.parameter.phone)))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (e.parameter.action === "adminData") {
    if (!checkAdminPassword(e.parameter.password)) {
      return ContentService.createTextOutput(JSON.stringify({ error: "unauthorized" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify(getAllAdminData(ss)))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* =====================================================================
   Admin पासवर्ड — कोडमध्ये कुठेही लिहायचा नाही (सुरक्षिततेसाठी).
   ऐवजी Apps Script मध्ये: डावीकडे ⚙️ "Project Settings" > खाली
   "Script Properties" > "Add script property" > Property: ADMIN_PASSWORD,
   Value: तुम्हाला हवा तो पासवर्ड — असं एकदाच सेट करा.
   ===================================================================== */
function checkAdminPassword(pw) {
  const stored = PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");
  return !!stored && String(pw) === stored;
}

// फोन नंबरवरून त्या पेशंटची सगळ्यात अलीकडची बुकिंग शोधते (नाव/पत्ता/शहर/डॉक्टर
// आपोआप भरण्यासाठी — बुकिंग फॉर्मवर वापरलं जातं, हे कुठलाही पासवर्ड न मागता
// उपलब्ध आहे कारण पेशंट स्वतःचाच नंबर टाकत आहे असं गृहीत धरलं आहे)
function lookupPatient(ss, phone) {
  if (!phone) return { found: false };
  const sheet = ss.getSheetByName("Bookings");
  if (!sheet || sheet.getLastRow() < 2) return { found: false };
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 15).getValues();
  // सगळ्यात खालची (=सगळ्यात अलीकडची) जुळणारी रांग शोधतो
  for (let i = rows.length - 1; i >= 0; i--) {
    if (String(rows[i][2]).trim() === String(phone).trim()) {
      return {
        found: true,
        fullName: rows[i][1],
        address: rows[i][4],
        city: rows[i][5],
        doctor: rows[i][7],
        lastTests: rows[i][12],
        lastDate: rows[i][8],
        visitCount: rows.filter((r) => String(r[2]).trim() === String(phone).trim()).length
      };
    }
  }
  return { found: false };
}

// Admin पॅनलसाठी सगळा डेटा (सगळ्या बुकिंग्ज + सगळे रिव्ह्यू) एकत्र परत पाठवते
function getAllAdminData(ss) {
  const bookingSheet = ss.getSheetByName("Bookings");
  const reviewSheet = ss.getSheetByName("Reviews");

  let bookings = [];
  if (bookingSheet && bookingSheet.getLastRow() >= 2) {
    const rows = bookingSheet.getRange(2, 1, bookingSheet.getLastRow() - 1, 15).getValues();
    bookings = rows.map((r) => ({
      timestamp: r[0], fullName: r[1], phone: r[2], altPhone: r[3], address: r[4], city: r[5],
      location: r[6], doctor: r[7], date: r[8], time: r[9], reportMode: r[10], email: r[11],
      tests: r[12], amount: r[13], prescription: r[14]
    })).reverse(); // नवीन सगळ्यात वरती दिसाव्यात
  }

  let reviews = [];
  if (reviewSheet && reviewSheet.getLastRow() >= 2) {
    const rows = reviewSheet.getRange(2, 1, reviewSheet.getLastRow() - 1, 7).getValues();
    reviews = rows.map((r, i) => ({
      rowNum: i + 2, timestamp: r[0], name: r[1], phone: r[2], test: r[3],
      rating: r[4], feedback: r[5], status: r[6]
    })).reverse();
  }

  return { bookings, reviews, sheetUrl: ss.getUrl() };
}

// Admin पॅनलमधून रिव्ह्यू Approve/Reject किंवा डिलीट करण्यासाठी
function handleAdminAction(ss, data) {
  const reviewSheet = ss.getSheetByName("Reviews");
  if (!reviewSheet) return;
  if (data.action === "approveReview") {
    reviewSheet.getRange(data.rowNum, 7).setValue("Approved");
  } else if (data.action === "rejectReview") {
    reviewSheet.getRange(data.rowNum, 7).setValue("Rejected");
  } else if (data.action === "deleteReview") {
    reviewSheet.deleteRow(data.rowNum);
  }
}

// "Tests" Sheet मधून सगळ्या टेस्ट/किंमती वाचून परत पाठवते (Sheet नसेल तर रिकामी यादी —
// तेव्हा वेबसाईट आपोआप आधीच्या built-in यादीचा वापर करते)
function getTestsFromSheet(ss) {
  const sheet = ss.getSheetByName("Tests");
  if (!sheet || sheet.getLastRow() < 2) return [];
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  return rows
    .filter((r) => String(r[1]).trim() !== "") // टेस्टचं नाव रिकामं असेल तर ती रांग सोडून देतो
    .map((r) => ({ category: r[0], name: r[1], mrp: r[2], price: r[3] }));
}

// हे फंक्शन फक्त एकदाच, Apps Script एडिटरमधून "Run" करायचं — यामुळे "Tests" नावाचं
// Sheet तयार होऊन सध्याची पूर्ण टेस्ट/किंमत यादी त्यात भरली जाते. नंतर तुम्ही त्या
// Sheet मध्ये रांग जोडून/काढून/बदलून थेट वेबसाईटवरची यादी अपडेट करू शकता — दुसरं
// काहीही करायची गरज नाही (एक-दोन मिनिटांत वेबसाईट रिफ्रेश केल्यावर बदल दिसतो).
function seedTestsSheet() {
  const ss = getSheet_();
  let sheet = ss.getSheetByName("Tests");
  if (sheet) {
    Logger.log('"Tests" Sheet आधीच अस्तित्वात आहे — काही केलं नाही. पुन्हा मूळ यादीने भरायचं असेल, तर आधी Sheet मधला "Tests" नावाचा टॅब स्वतः डिलीट करा, मग हे फंक्शन पुन्हा Run करा.');
    return;
  }
  sheet = ss.insertSheet("Tests");

  const headers = ["Category (कॅटेगरी)", "Test Name (टेस्टचं नाव)", "MRP (₹)", "Price (₹)"];
  sheet.appendRow(headers);
  formatHeaderRow(sheet, headers.length);

  const seedData = [
    ["Basic & Routine Tests", "Complete Blood Count (CBC)", 500, 199],
    ["Basic & Routine Tests", "Hemoglobin (Hb)", 200, 99],
    ["Basic & Routine Tests", "ESR (Erythrocyte Sedimentation Rate)", 200, 99],
    ["Basic & Routine Tests", "Blood Grouping (ABO & Rh)", 300, 149],
    ["Basic & Routine Tests", "Peripheral Smear Study", 400, 199],
    ["Basic & Routine Tests", "Platelet Count", 250, 99],
    ["Basic & Routine Tests", "Complete Urine Examination (CUE)", 300, 129],
    ["Basic & Routine Tests", "Stool Routine Examination", 300, 149],
    ["Diabetes Profile", "Blood Sugar Fasting (FBS)", 150, 69],
    ["Diabetes Profile", "Blood Sugar PP (Post Meal)", 150, 69],
    ["Diabetes Profile", "Random Blood Sugar (RBS)", 150, 69],
    ["Diabetes Profile", "HbA1c (Glycated Hemoglobin)", 900, 399],
    ["Diabetes Profile", "Diabetes Profile (FBS+PP+HbA1c)", 1200, 499],
    ["Diabetes Profile", "Insulin Fasting", 900, 449],
    ["Thyroid Profile", "TSH (Thyroid Stimulating Hormone)", 500, 199],
    ["Thyroid Profile", "T3, T4, TSH (Thyroid Profile)", 900, 349],
    ["Thyroid Profile", "Free T3 / Free T4", 700, 299],
    ["Thyroid Profile", "Anti TPO Antibody", 1200, 599],
    ["Liver Function Test (LFT)", "Liver Function Test (LFT) - Complete", 900, 399],
    ["Liver Function Test (LFT)", "SGPT (ALT)", 250, 99],
    ["Liver Function Test (LFT)", "SGOT (AST)", 250, 99],
    ["Liver Function Test (LFT)", "Bilirubin Total & Direct", 300, 129],
    ["Liver Function Test (LFT)", "Serum Protein & Albumin", 400, 179],
    ["Kidney Function Test (KFT)", "Kidney Function Test (KFT) - Complete", 900, 399],
    ["Kidney Function Test (KFT)", "Serum Creatinine", 250, 99],
    ["Kidney Function Test (KFT)", "Blood Urea", 250, 99],
    ["Kidney Function Test (KFT)", "Serum Uric Acid", 300, 129],
    ["Kidney Function Test (KFT)", "Electrolytes (Na, K, Cl)", 600, 279],
    ["Lipid Profile (Heart / Cholesterol)", "Lipid Profile - Complete", 800, 349],
    ["Lipid Profile (Heart / Cholesterol)", "Total Cholesterol", 250, 99],
    ["Lipid Profile (Heart / Cholesterol)", "Triglycerides", 250, 99],
    ["Lipid Profile (Heart / Cholesterol)", "HDL / LDL Cholesterol", 400, 179],
    ["Vitamins & Minerals", "Vitamin D (25-Hydroxy)", 1800, 649],
    ["Vitamins & Minerals", "Vitamin B12", 1200, 499],
    ["Vitamins & Minerals", "Iron Profile (Iron, TIBC, Ferritin)", 1500, 649],
    ["Vitamins & Minerals", "Calcium Serum", 350, 149],
    ["Vitamins & Minerals", "Magnesium Serum", 400, 189],
    ["Infection & Fever Related", "Widal Test (Typhoid)", 300, 149],
    ["Infection & Fever Related", "Dengue NS1 Antigen", 900, 399],
    ["Infection & Fever Related", "Dengue IgG/IgM", 900, 399],
    ["Infection & Fever Related", "Malaria Antigen Test", 400, 189],
    ["Infection & Fever Related", "CRP (C-Reactive Protein)", 600, 249],
    ["Infection & Fever Related", "COVID-19 RT-PCR", 700, 299],
    ["Hormones & Fertility", "Pregnancy Test (Beta hCG)", 500, 199],
    ["Hormones & Fertility", "Prolactin", 800, 349],
    ["Hormones & Fertility", "Testosterone Total", 900, 399],
    ["Hormones & Fertility", "FSH / LH", 900, 399],
    ["Cardiac & Others", "ECG (Electrocardiogram)", 400, 199],
    ["Cardiac & Others", "Troponin I", 1200, 599],
    ["Cardiac & Others", "RA Factor (Rheumatoid Arthritis)", 600, 279],
    ["Cardiac & Others", "ASO Titer", 600, 279],
    ["Full Body Checkup Packages", "Basic Health Checkup (CBC+Sugar+Urine)", 900, 349],
    ["Full Body Checkup Packages", "Full Body Checkup (CBC, LFT, KFT, Lipid, Thyroid, Sugar, Urine)", 3500, 999],
    ["Full Body Checkup Packages", "Senior Citizen Health Package", 4500, 1399],
    ["Full Body Checkup Packages", "Master Health Checkup (with Vitamins)", 6000, 1899],
    ["Full Body Checkup Packages", "Pre-Marriage Health Checkup", 2500, 899]
  ];

  sheet.getRange(2, 1, seedData.length, 4).setValues(seedData);
  sheet.autoResizeColumns(1, 4);
  Logger.log(`झालं! "Tests" Sheet तयार झालं — एकूण ${seedData.length} टेस्ट भरल्या. आता या Sheet मध्ये बदल केल्यास वेबसाईटवरही तोच बदल दिसेल.`);
}

/* ---------------- सुंदर हेडर बनवण्याचं सामायिक फंक्शन ---------------- */
function formatHeaderRow(sheet, numCols) {
  const header = sheet.getRange(1, 1, 1, numCols);
  header.setBackground(BRAND_COLOR);
  header.setFontColor("#ffffff");
  header.setFontWeight("bold");
  header.setFontSize(11);
  header.setVerticalAlignment("middle");
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 32);
}

/* ---------------- Bookings ---------------- */
function saveBooking(ss, d, prescriptionUrl) {
  let sheet = ss.getSheetByName("Bookings");
  const isNew = !sheet;
  if (isNew) sheet = ss.insertSheet("Bookings");

  if (sheet.getLastRow() === 0) {
    const headers = [
      "दिनांक/वेळ", "पेशंटचे नाव", "मोबाईल", "पर्यायी नंबर", "पत्ता", "शहर",
      "लोकेशन लिंक", "डॉक्टर", "कलेक्शन दिवस", "कलेक्शन वेळ", "रिपोर्ट कसा हवा",
      "ग्राहकाचा ईमेल", "टेस्ट/पॅकेज", "अंदाजे रक्कम (₹)", "प्रिस्क्रिप्शन (Drive लिंक)"
    ];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length);
  }

  sheet.appendRow([
    d.timestamp, d.fullName, d.phone, d.altPhone, d.address, d.city, d.location,
    d.doctor, d.date, d.time, d.reportMode, d.email, d.tests, d.estimatedTotal,
    prescriptionUrl || ""
  ]);

  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

function sendBookingEmails(ss, d, prescriptionUrl) {
  const sheetUrl = ss.getUrl();
  const subject = `🩸 नवीन बुकिंग - ${d.fullName} (${d.date})`;

  const htmlBody = `
    <div style="font-family:Arial,sans-serif; max-width:520px; margin:auto; border:1px solid #e5e5e5; border-radius:10px; overflow:hidden;">
      <div style="background:${BRAND_COLOR}; color:#fff; padding:16px 20px;">
        <h2 style="margin:0; font-size:18px;">✅ नवीन बुकिंग मिळाली</h2>
        <p style="margin:4px 0 0; font-size:13px; color:#cfd4ee;">Kalyan Pathlab · संस्कार फाउंडेशन संचलित</p>
      </div>
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        ${emailRow("👤 नाव", d.fullName)}
        ${emailRow("📞 मोबाईल", d.phone)}
        ${d.altPhone ? emailRow("📞 पर्यायी नंबर", d.altPhone) : ""}
        ${emailRow("📍 पत्ता", `${d.address}, ${d.city}`)}
        ${d.location ? emailRow("🗺️ लोकेशन", `<a href="${d.location}">Google Maps वर पहा</a>`) : ""}
        ${emailRow("🧪 टेस्ट/पॅकेज", d.tests)}
        ${emailRow("💰 अंदाजे रक्कम", `₹${d.estimatedTotal}`)}
        ${emailRow("📅 कलेक्शन", `${d.date} · ${d.time}`)}
        ${emailRow("👨‍⚕️ डॉक्टर रेफरन्स", d.doctor)}
        ${emailRow("📄 रिपोर्ट हवा", d.reportMode)}
        ${d.email ? emailRow("✉️ ग्राहकाचा ईमेल", d.email) : ""}
        ${prescriptionUrl ? emailRow("📎 प्रिस्क्रिप्शन", `<a href="${prescriptionUrl}">फाईल पहा</a>`) : ""}
      </table>
      <div style="padding:16px 20px; text-align:center; background:#f7f8fc;">
        <a href="${sheetUrl}" style="display:inline-block; background:${ACCENT_COLOR}; color:#fff; text-decoration:none; font-weight:bold; padding:10px 22px; border-radius:24px; font-size:14px;">📊 पूर्ण डेटाबेस (सर्व बुकिंग्ज) पहा</a>
      </div>
    </div>`;

  // लॅब मालकाला ईमेल (आपोआप, सुंदर फॉरमॅटमध्ये)
  MailApp.sendEmail({ to: LAB_OWNER_EMAIL, subject: subject, htmlBody: htmlBody });

  // ग्राहकाने ईमेल दिला असल्यास त्यालाही कन्फर्मेशन (आपोआप)
  if (d.email) {
    const customerHtml = `
      <div style="font-family:Arial,sans-serif; max-width:520px; margin:auto; border:1px solid #e5e5e5; border-radius:10px; overflow:hidden;">
        <div style="background:${BRAND_COLOR}; color:#fff; padding:16px 20px;">
          <h2 style="margin:0; font-size:18px;">✅ तुमची बुकिंग कन्फर्म झाली</h2>
        </div>
        <div style="padding:18px 20px; font-size:14px; color:#222;">
          <p>नमस्कार <strong>${d.fullName}</strong>,</p>
          <p>${LAB_NAME} येथे तुमची बुकिंग यशस्वीरित्या नोंदवली गेली आहे.</p>
          <table style="width:100%; border-collapse:collapse; margin:10px 0;">
            ${emailRow("🧪 टेस्ट", d.tests)}
            ${emailRow("📅 सॅम्पल कलेक्शन", `${d.date} · ${d.time}`)}
            ${emailRow("📍 पत्ता", `${d.address}, ${d.city}`)}
            ${emailRow("💰 अंदाजे रक्कम", `₹${d.estimatedTotal}`)}
          </table>
          <p>काही प्रश्न असल्यास संपर्क करा: <a href="tel:+919870020674">98700 20674</a> / <a href="tel:+918828111774">88281 11774</a></p>
          <p style="margin-top:18px;">धन्यवाद,<br /><strong>${LAB_NAME}</strong><br /><span style="color:#666; font-size:12px;">संस्कार फाउंडेशन संचलित · Care For Quality</span></p>
        </div>
      </div>`;
    MailApp.sendEmail({ to: d.email, subject: `तुमची बुकिंग कन्फर्म झाली - ${LAB_NAME}`, htmlBody: customerHtml });
  }
}

function emailRow(label, value) {
  return `<tr>
    <td style="padding:8px 20px; color:#666; border-bottom:1px solid #f0f0f0; white-space:nowrap;">${label}</td>
    <td style="padding:8px 20px; color:#111; border-bottom:1px solid #f0f0f0; font-weight:600;">${value}</td>
  </tr>`;
}

/* ---------------- Reviews ---------------- */
function saveReview(ss, d) {
  let sheet = ss.getSheetByName("Reviews");
  const isNew = !sheet;
  if (isNew) sheet = ss.insertSheet("Reviews");

  if (sheet.getLastRow() === 0) {
    const headers = ["दिनांक/वेळ", "नाव", "मोबाईल", "टेस्ट", "रेटिंग", "अभिप्राय", "Status"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length);
  }

  sheet.appendRow([d.timestamp, d.name, d.phone, d.test, d.rating, d.feedback, "Pending"]);
  sheet.autoResizeColumns(1, sheet.getLastColumn());
  enforceReviewLimit(sheet, MAX_REVIEWS);

  // नवीन रिव्ह्यू आल्याची सूचना लॅब मालकाला
  const sheetUrl = ss.getUrl();
  const html = `
    <div style="font-family:Arial,sans-serif; max-width:520px; margin:auto; border:1px solid #e5e5e5; border-radius:10px; overflow:hidden;">
      <div style="background:${BRAND_COLOR}; color:#fff; padding:16px 20px;">
        <h2 style="margin:0; font-size:18px;">⭐ नवीन रिव्ह्यू आला</h2>
      </div>
      <div style="padding:18px 20px; font-size:14px; color:#222;">
        <p><strong>${d.name}</strong> — ${"★".repeat(d.rating)}${"☆".repeat(5 - d.rating)}</p>
        <p style="background:#f7f8fc; padding:12px; border-radius:8px; font-style:italic;">"${d.feedback}"</p>
        <p>Sheet मध्ये जाऊन <strong>Status</strong> कॉलममध्ये <strong>Approved</strong> लिहा, म्हणजे तो वेबसाईटवर दिसेल.</p>
        <div style="text-align:center; margin-top:14px;">
          <a href="${sheetUrl}" style="display:inline-block; background:${ACCENT_COLOR}; color:#fff; text-decoration:none; font-weight:bold; padding:10px 22px; border-radius:24px; font-size:14px;">📊 Sheet उघडा</a>
        </div>
      </div>
    </div>`;
  MailApp.sendEmail({ to: LAB_OWNER_EMAIL, subject: `⭐ नवीन रिव्ह्यू आला - ${d.name} (${d.rating}★)`, htmlBody: html });
}

// रिव्ह्यूंची संख्या ठराविक मर्यादेपेक्षा जास्त झाली, तर सगळ्यात जुने (वरचे) रिव्ह्यू आपोआप डिलीट करते
function enforceReviewLimit(sheet, maxRows) {
  const dataRows = sheet.getLastRow() - 1; // हेडर वगळून एकूण रिव्ह्यू
  if (dataRows > maxRows) {
    const excess = dataRows - maxRows;
    sheet.deleteRows(2, excess); // रांग 2 पासून सुरू होणारे सगळ्यात जुने रिव्ह्यू काढतो (Approved/Pending दोन्ही धरून)
  }
}

// Sheet मधल्या "Reviews" टॅबमधून फक्त Status="Approved" असलेले रिव्ह्यू परत पाठवते
function getApprovedReviews(ss) {
  const sheet = ss.getSheetByName("Reviews");
  if (!sheet || sheet.getLastRow() < 2) return [];
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();
  return rows
    .filter((r) => String(r[6]).toLowerCase() === "approved")
    .map((r) => ({ name: r[1], test: r[3], rating: Number(r[4]), feedback: r[5] }));
}
