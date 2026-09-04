/* Kalyan Pathlab - Backend (Google Apps Script) */

const LAB_OWNER_EMAIL = "kalyan.pathlab.21@gmail.com";
const LAB_NAME = "Kalyan Pathlab";
const BRAND_COLOR = "#0b1440";
const ACCENT_COLOR = "#e5030a";
const PRESCRIPTION_FOLDER_NAME = "Kalyan Pathlab - Prescriptions";
const MAX_REVIEWS = 50;
const SPREADSHEET_ID = "18VyPSHOMhxpDNseeZtMHGXvzaCDQVc1ew4g0qoKO02I";

function getSheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = getSheet_();
  if (data.type === "booking") {
    const prescriptionUrl = savePrescriptionIfAny(data);
    const patientInfo = getOrCreatePatientId(ss, data.phone, data.fullName);
    saveBooking(ss, data, prescriptionUrl, patientInfo.patientId);
    sendBookingEmails(ss, data, prescriptionUrl, patientInfo);
  } else if (data.type === "review") {
    saveReview(ss, data);
  } else if (data.type === "adminAction") {
    handleAdminAction(ss, data);
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const ss = getSheet_();
  const action = e.parameter.action;
  if (action === "reviews") return json_(getApprovedReviews(ss));
  if (action === "tests") return json_(getTestsFromSheet(ss));
  if (action === "patientLookup") return json_(lookupPatient(ss, e.parameter.phone));
  if (action === "adminData") return json_(getAllAdminData(ss));
  return json_({ status: "ok" });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- Prescription upload ---------- */
function savePrescriptionIfAny(d) {
  if (!d.prescriptionBase64) return "";
  try {
    const folders = DriveApp.getFoldersByName(PRESCRIPTION_FOLDER_NAME);
    const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(PRESCRIPTION_FOLDER_NAME);
    const bytes = Utilities.base64Decode(d.prescriptionBase64);
    const name = `${d.fullName || "patient"}_${d.phone || ""}_${Date.now()}_${d.prescriptionName || "prescription"}`;
    const blob = Utilities.newBlob(bytes, d.prescriptionType || "application/octet-stream", name);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    return "";
  }
}

/* ---------- Unique Patient ID ---------- */
function getOrCreatePatientId(ss, phone, fullName) {
  let sheet = ss.getSheetByName("Patients");
  if (!sheet) {
    sheet = ss.insertSheet("Patients");
    const headers = ["Patient ID", "Phone", "Name", "First Visit"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length);
  }
  const lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    const rows = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    for (let i = 0; i < rows.length; i++) {
      if (String(rows[i][1]).trim() === String(phone).trim()) {
        const prevTests = getPreviousTestSummary(ss, phone);
        return { patientId: rows[i][0], isReturning: true, prevTests };
      }
    }
  }
  const newId = "KP" + String(lastRow).padStart(4, "0");
  sheet.appendRow([newId, phone, fullName, new Date()]);
  return { patientId: newId, isReturning: false, prevTests: "" };
}

function getPreviousTestSummary(ss, phone) {
  const sheet = ss.getSheetByName("Bookings");
  if (!sheet || sheet.getLastRow() < 2) return "";
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 15).getValues();
  for (let i = rows.length - 1; i >= 0; i--) {
    if (String(rows[i][2]).trim() === String(phone).trim()) {
      return `${rows[i][12]} (${rows[i][8]})`;
    }
  }
  return "";
}

/* ---------- Patient lookup (returning patient autofill) ---------- */
function lookupPatient(ss, phone) {
  if (!phone) return { found: false };
  const sheet = ss.getSheetByName("Bookings");
  if (!sheet || sheet.getLastRow() < 2) return { found: false };
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 16).getValues();
  for (let i = rows.length - 1; i >= 0; i--) {
    if (String(rows[i][2]).trim() === String(phone).trim()) {
      return {
        found: true, patientId: rows[i][15], fullName: rows[i][1], address: rows[i][4], city: rows[i][5],
        doctor: rows[i][7], lastTests: rows[i][12], lastDate: rows[i][8],
        visitCount: rows.filter(r => String(r[2]).trim() === String(phone).trim()).length
      };
    }
  }
  return { found: false };
}

/* ---------- Admin data ---------- */
function getAllAdminData(ss) {
  const bookingSheet = ss.getSheetByName("Bookings");
  const reviewSheet = ss.getSheetByName("Reviews");
  let bookings = [];
  if (bookingSheet && bookingSheet.getLastRow() >= 2) {
    const rows = bookingSheet.getRange(2, 1, bookingSheet.getLastRow() - 1, 16).getValues();
    bookings = rows.map(r => ({
      timestamp: r[0], fullName: r[1], phone: r[2], altPhone: r[3], address: r[4], city: r[5],
      location: r[6], doctor: r[7], date: r[8], time: r[9], reportMode: r[10], email: r[11],
      tests: r[12], amount: r[13], prescription: r[14], patientId: r[15]
    })).reverse();
  }
  let reviews = [];
  if (reviewSheet && reviewSheet.getLastRow() >= 2) {
    const rows = reviewSheet.getRange(2, 1, reviewSheet.getLastRow() - 1, 7).getValues();
    reviews = rows.map((r, i) => ({
      rowNum: i + 2, timestamp: r[0], name: r[1], phone: r[2], test: r[3], rating: r[4], feedback: r[5], status: r[6]
    })).reverse();
  }
  return { bookings, reviews, tests: getTestsFromSheet(ss, true), sheetUrl: ss.getUrl() };
}

function handleAdminAction(ss, data) {
  const reviewSheet = ss.getSheetByName("Reviews");
  if (data.action === "approveReview" && reviewSheet) reviewSheet.getRange(data.rowNum, 7).setValue("Approved");
  else if (data.action === "rejectReview" && reviewSheet) reviewSheet.getRange(data.rowNum, 7).setValue("Rejected");
  else if (data.action === "deleteReview" && reviewSheet) reviewSheet.deleteRow(data.rowNum);
  else if (data.action === "addTest") {
    let sheet = ss.getSheetByName("Tests");
    if (!sheet) sheet = createTestsSheet_(ss);
    sheet.appendRow([data.category, data.name, Number(data.mrp) || 0, Number(data.price) || 0]);
    sheet.autoResizeColumns(1, 4);
  } else if (data.action === "updateTest") {
    const sheet = ss.getSheetByName("Tests");
    if (sheet) sheet.getRange(data.rowNum, 1, 1, 4).setValues([[data.category, data.name, Number(data.mrp) || 0, Number(data.price) || 0]]);
  } else if (data.action === "deleteTest") {
    const sheet = ss.getSheetByName("Tests");
    if (sheet) sheet.deleteRow(data.rowNum);
  }
}

/* ---------- Tests ---------- */
function createTestsSheet_(ss) {
  const sheet = ss.insertSheet("Tests");
  const headers = ["Category", "Test Name", "MRP", "Price"];
  sheet.appendRow(headers);
  formatHeaderRow(sheet, headers.length);
  return sheet;
}

function getTestsFromSheet(ss, withRowNum) {
  const sheet = ss.getSheetByName("Tests");
  if (!sheet || sheet.getLastRow() < 2) return [];
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  return rows
    .map((r, i) => withRowNum
      ? { rowNum: i + 2, category: r[0], name: r[1], mrp: r[2], price: r[3] }
      : { category: r[0], name: r[1], mrp: r[2], price: r[3] })
    .filter(t => String(t.name).trim() !== "");
}

function seedTestsSheet() {
  const ss = getSheet_();
  if (ss.getSheetByName("Tests")) { Logger.log("Tests sheet already exists."); return; }
  const sheet = createTestsSheet_(ss);
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
  Logger.log("Tests sheet created with " + seedData.length + " tests.");
}

function formatHeaderRow(sheet, numCols) {
  const header = sheet.getRange(1, 1, 1, numCols);
  header.setBackground(BRAND_COLOR).setFontColor("#ffffff").setFontWeight("bold").setFontSize(11).setVerticalAlignment("middle");
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 32);
}

/* ---------- Bookings ---------- */
function saveBooking(ss, d, prescriptionUrl, patientId) {
  let sheet = ss.getSheetByName("Bookings");
  if (!sheet) {
    sheet = ss.insertSheet("Bookings");
    const headers = ["Timestamp", "Name", "Phone", "Alt Phone", "Address", "City", "Location", "Doctor", "Date", "Time", "Report Mode", "Email", "Tests", "Amount", "Prescription", "Patient ID"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length);
  }
  sheet.appendRow([d.timestamp, d.fullName, d.phone, d.altPhone, d.address, d.city, d.location, d.doctor, d.date, d.time, d.reportMode, d.email, d.tests, d.estimatedTotal, prescriptionUrl || "", patientId || ""]);
  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

function sendBookingEmails(ss, d, prescriptionUrl, patientInfo) {
  const sheetUrl = ss.getUrl();
  const rows = [
    emailRow("Patient ID", patientInfo.patientId + (patientInfo.isReturning ? " (Returning)" : " (New)")),
    emailRow("Name", d.fullName), emailRow("Phone", d.phone),
    d.altPhone ? emailRow("Alt Phone", d.altPhone) : "",
    emailRow("Address", `${d.address}, ${d.city}`),
    d.location ? emailRow("Location", `<a href="${d.location}">View on Maps</a>`) : "",
    emailRow("Tests", d.tests), emailRow("Amount", `₹${d.estimatedTotal}`),
    emailRow("Collection", `${d.date} · ${d.time}`), emailRow("Doctor", d.doctor),
    emailRow("Report Mode", d.reportMode),
    d.email ? emailRow("Customer Email", d.email) : "",
    patientInfo.isReturning && patientInfo.prevTests ? emailRow("Previous Test", patientInfo.prevTests) : "",
    prescriptionUrl ? emailRow("Prescription", `<a href="${prescriptionUrl}">View File</a>`) : ""
  ].join("");
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e5e5e5;border-radius:10px;overflow:hidden">
    <div style="background:${BRAND_COLOR};color:#fff;padding:16px 20px"><h2 style="margin:0;font-size:18px">✅ New Booking</h2><p style="margin:4px 0 0;font-size:13px;color:#cfd4ee">Kalyan Pathlab</p></div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
    <div style="padding:16px 20px;text-align:center;background:#f7f8fc"><a href="${sheetUrl}" style="display:inline-block;background:${ACCENT_COLOR};color:#fff;text-decoration:none;font-weight:bold;padding:10px 22px;border-radius:24px;font-size:14px">📊 View Full Database</a></div></div>`;
  MailApp.sendEmail({ to: LAB_OWNER_EMAIL, subject: `🩸 New Booking - ${d.fullName} (${d.date})`, htmlBody: html });
  if (d.email) {
    const custHtml = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e5e5e5;border-radius:10px;overflow:hidden">
      <div style="background:${BRAND_COLOR};color:#fff;padding:16px 20px"><h2 style="margin:0;font-size:18px">✅ Booking Confirmed</h2></div>
      <div style="padding:18px 20px;font-size:14px;color:#222">
        <p>Hi <strong>${d.fullName}</strong>, your booking with ${LAB_NAME} is confirmed.</p>
        <p style="background:#f7f8fc;padding:10px 14px;border-radius:8px;font-size:13px">Your Patient ID: <strong>${patientInfo.patientId}</strong> — please save this for future visits.</p>
        <table style="width:100%;border-collapse:collapse;margin:10px 0">${emailRow("Tests", d.tests)}${emailRow("Collection", `${d.date} · ${d.time}`)}${emailRow("Address", `${d.address}, ${d.city}`)}${emailRow("Amount", `₹${d.estimatedTotal}`)}</table>
        <p>Questions? Call <a href="tel:+919870020674">98700 20674</a> / <a href="tel:+918828111774">88281 11774</a></p>
        <p style="margin-top:18px">Thanks,<br><strong>${LAB_NAME}</strong></p>
      </div></div>`;
    MailApp.sendEmail({ to: d.email, subject: `Booking Confirmed - ${LAB_NAME}`, htmlBody: custHtml });
  }
}

function emailRow(label, value) {
  return `<tr><td style="padding:8px 20px;color:#666;border-bottom:1px solid #f0f0f0;white-space:nowrap">${label}</td><td style="padding:8px 20px;color:#111;border-bottom:1px solid #f0f0f0;font-weight:600">${value}</td></tr>`;
}

/* ---------- Reviews ---------- */
function saveReview(ss, d) {
  let sheet = ss.getSheetByName("Reviews");
  if (!sheet) {
    sheet = ss.insertSheet("Reviews");
    const headers = ["Timestamp", "Name", "Phone", "Test", "Rating", "Feedback", "Status"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length);
  }
  sheet.appendRow([d.timestamp, d.name, d.phone, d.test, d.rating, d.feedback, "Pending"]);
  sheet.autoResizeColumns(1, sheet.getLastColumn());
  enforceReviewLimit(sheet, MAX_REVIEWS);
  const sheetUrl = ss.getUrl();
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e5e5e5;border-radius:10px;overflow:hidden">
    <div style="background:${BRAND_COLOR};color:#fff;padding:16px 20px"><h2 style="margin:0;font-size:18px">⭐ New Review</h2></div>
    <div style="padding:18px 20px;font-size:14px;color:#222">
      <p><strong>${d.name}</strong> — ${"★".repeat(d.rating)}${"☆".repeat(5 - d.rating)}</p>
      <p style="background:#f7f8fc;padding:12px;border-radius:8px;font-style:italic">"${d.feedback}"</p>
      <div style="text-align:center;margin-top:14px"><a href="${sheetUrl}" style="display:inline-block;background:${ACCENT_COLOR};color:#fff;text-decoration:none;font-weight:bold;padding:10px 22px;border-radius:24px;font-size:14px">📊 Open Sheet</a></div>
    </div></div>`;
  MailApp.sendEmail({ to: LAB_OWNER_EMAIL, subject: `⭐ New Review - ${d.name} (${d.rating}★)`, htmlBody: html });
}

function enforceReviewLimit(sheet, maxRows) {
  const dataRows = sheet.getLastRow() - 1;
  if (dataRows > maxRows) sheet.deleteRows(2, dataRows - maxRows);
}

function getApprovedReviews(ss) {
  const sheet = ss.getSheetByName("Reviews");
  if (!sheet || sheet.getLastRow() < 2) return [];
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();
  return rows.filter(r => String(r[6]).toLowerCase() === "approved").map(r => ({ name: r[1], test: r[3], rating: Number(r[4]), feedback: r[5] }));
}
