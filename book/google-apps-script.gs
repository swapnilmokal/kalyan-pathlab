/* =====================================================================
   Kalyan Pathlab - Google Apps Script Backend (मोफत)
   ---------------------------------------------------------------------
   हे काय करते:
   1. बुकिंग फॉर्मचा डेटा Google Sheet मध्ये आपोआप सेव्ह करते.
   2. बुकिंग झाल्यावर लॅब मालकाला (तुम्हाला) आणि ग्राहकाला (ईमेल दिला असल्यास)
      आपोआप ईमेल कन्फर्मेशन पाठवते — पूर्ण मोफत, बटण न दाबता.
   3. रिव्ह्यूज सुद्धा Sheet मध्ये सेव्ह करते (Status = Pending),
      तुम्ही Sheet मध्ये "Approved" केल्यावरच ते वेबसाईटवर दिसतात.

   ================= सेटअप कसा करायचा (5 मिनिटांत) =====================
   1. https://sheets.google.com वर जाऊन नवीन Google Sheet तयार करा,
      नाव द्या: "Kalyan Pathlab Data"
   2. त्यात दोन टॅब (शीट) बनवा: "Bookings" आणि "Reviews"
   3. Extensions > Apps Script वर क्लिक करा.
   4. तिथे आधीचा सगळा कोड डिलीट करून खालचा पूर्ण कोड पेस्ट करा.
   5. वरती "Deploy" > "New deployment" क्लिक करा.
      - Type: "Web app" निवडा
      - Execute as: "Me"
      - Who has access: "Anyone"
      - Deploy क्लिक करा (पहिल्यांदा परवानगी मागेल - allow करा)
   6. तुम्हाला एक "Web app URL" मिळेल (https://script.google.com/macros/s/xxxx/exec)
      ही लिंक कॉपी करा.
   7. app.js फाईलमध्ये वरती CONFIG.appsScriptUrl मध्ये ही लिंक पेस्ट करा.
   8. झालं! आता बुकिंग व रिव्ह्यू आपोआप Sheet मध्ये जमा होतील + ईमेल जाईल.
   ===================================================================== */

const LAB_OWNER_EMAIL = "kalyan.pathlab.21@gmail.com";
const LAB_NAME = "Kalyan Pathlab";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (data.type === "booking") {
    saveBooking(ss, data);
    sendBookingEmails(data);
  } else if (data.type === "review") {
    saveReview(ss, data);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (e.parameter.action === "reviews") {
    return ContentService.createTextOutput(JSON.stringify(getApprovedReviews(ss)))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------------- Bookings ---------------- */
function saveBooking(ss, d) {
  let sheet = ss.getSheetByName("Bookings");
  if (!sheet) sheet = ss.insertSheet("Bookings");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Name", "Phone", "Alt Phone", "Address", "City", "Location",
      "Doctor", "Date", "Time", "Report Mode", "Email", "Tests", "Estimated Total"
    ]);
  }
  sheet.appendRow([
    d.timestamp, d.fullName, d.phone, d.altPhone, d.address, d.city, d.location,
    d.doctor, d.date, d.time, d.reportMode, d.email, d.tests, d.estimatedTotal
  ]);
}

function sendBookingEmails(d) {
  const subject = `नवीन बुकिंग - ${d.fullName} (${d.date} ${d.time})`;
  const body =
    `नवीन बुकिंग मिळाली आहे:\n\n` +
    `नाव: ${d.fullName}\nमोबाईल: ${d.phone}\nपर्यायी नंबर: ${d.altPhone}\n` +
    `पत्ता: ${d.address}, ${d.city}\nलोकेशन: ${d.location || "-"}\n` +
    `डॉक्टर रेफरन्स: ${d.doctor}\nदिवस/वेळ: ${d.date} ${d.time}\n` +
    `टेस्ट: ${d.tests}\nअंदाजे रक्कम: ₹${d.estimatedTotal}\n` +
    `रिपोर्ट कसा हवा: ${d.reportMode}\nग्राहकाचा ईमेल: ${d.email || "-"}`;

  // लॅब मालकाला ईमेल (आपोआप)
  MailApp.sendEmail(LAB_OWNER_EMAIL, subject, body);

  // ग्राहकाने ईमेल दिला असल्यास त्यालाही कन्फर्मेशन (आपोआप)
  if (d.email) {
    const customerBody =
      `नमस्कार ${d.fullName},\n\n${LAB_NAME} येथे तुमची बुकिंग यशस्वीरित्या नोंदवली गेली आहे.\n\n` +
      `टेस्ट: ${d.tests}\nसॅम्पल कलेक्शन: ${d.date} ${d.time}\nपत्ता: ${d.address}, ${d.city}\n` +
      `अंदाजे रक्कम: ₹${d.estimatedTotal}\n\nकाही प्रश्न असल्यास संपर्क करा: 98700 20674 / 88281 11774\n\n` +
      `धन्यवाद,\n${LAB_NAME}\nसंस्कार फाउंडेशन संचलित`;
    MailApp.sendEmail(d.email, `तुमची बुकिंग कन्फर्म झाली - ${LAB_NAME}`, customerBody);
  }
}

/* ---------------- Reviews ---------------- */
function saveReview(ss, d) {
  let sheet = ss.getSheetByName("Reviews");
  if (!sheet) sheet = ss.insertSheet("Reviews");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Phone", "Test", "Rating", "Feedback", "Status"]);
  }
  sheet.appendRow([d.timestamp, d.name, d.phone, d.test, d.rating, d.feedback, "Pending"]);

  // नवीन रिव्ह्यू आल्याची सूचना लॅब मालकाला
  MailApp.sendEmail(
    LAB_OWNER_EMAIL,
    `नवीन रिव्ह्यू आला - ${d.name} (${d.rating}★)`,
    `${d.name} यांनी रिव्ह्यू दिला आहे:\n\n"${d.feedback}"\n\nSheet मध्ये जाऊन Status column मध्ये "Approved" लिहा, म्हणजे तो वेबसाईटवर दिसेल.`
  );
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
