/* Kalyan Pathlab - Backend (Google Apps Script) */

const LAB_OWNER_EMAIL = "kalyan.pathlab.21@gmail.com";
const LAB_NAME = "Kalyan Pathlab";
const BRAND_COLOR = "#0b1440";
const ACCENT_COLOR = "#e5030a";
const PRESCRIPTION_FOLDER_NAME = "Kalyan Pathlab - Prescriptions";
const REPORT_FOLDER_NAME = "Kalyan Pathlab - Reports";
const QR_FOLDER_NAME = "Kalyan Pathlab - Payment QR";
const MAX_REVIEWS = 50;
const SPREADSHEET_ID = "18VyPSHOMhxpDNseeZtMHGXvzaCDQVc1ew4g0qoKO02I";
const DEFAULT_UPI_ID = "enterprises60658@nyes";

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
  } else if (data.type === "profile") {
    saveProfile_(ss, data);
  } else if (data.type === "adminAction") {
    handleAdminAction(ss, data);
  }
  return json_({ ok: true });
}

function doGet(e) {
  const ss = getSheet_();
  const action = e.parameter.action;
  if (action === "reviews") return json_(getApprovedReviews(ss));
  if (action === "tests") return json_(getTestsFromSheet(ss));
  if (action === "patientLookup") return json_(lookupPatient(ss, e.parameter.phone));
  if (action === "adminData") return json_(getAllAdminData(ss));
  if (action === "settings") return json_(getSettings_(ss));
  if (action === "bookingStatus") return json_(getBookingStatus(ss, e.parameter.phone));
  if (action === "bills") return json_(getBillsFromSheet(ss));
  if (action === "profile") return json_(getProfile_(ss, e.parameter.phone));
  return json_({ status: "ok" });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- File uploads (prescription / report / QR) ---------- */
function saveFileToFolder_(folderName, base64, mimeType, fileName) {
  if (!base64) return "";
  try {
    const folders = DriveApp.getFoldersByName(folderName);
    const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    const bytes = Utilities.base64Decode(base64);
    const blob = Utilities.newBlob(bytes, mimeType || "application/octet-stream", fileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    return "";
  }
}

function savePrescriptionIfAny(d) {
  if (!d.prescriptionBase64) return "";
  const name = `${d.fullName || "patient"}_${d.phone || ""}_${Date.now()}_${d.prescriptionName || "prescription"}`;
  return saveFileToFolder_(PRESCRIPTION_FOLDER_NAME, d.prescriptionBase64, d.prescriptionType, name);
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
    if (String(rows[i][2]).trim() === String(phone).trim()) return `${rows[i][12]} (${rows[i][8]})`;
  }
  return "";
}

/* ---------- Patient lookup (returning patient autofill) ---------- */
function lookupPatient(ss, phone) {
  if (!phone) return { found: false };
  const sheet = ss.getSheetByName("Bookings");
  if (!sheet || sheet.getLastRow() < 2) return { found: false };
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 20).getValues();
  for (let i = rows.length - 1; i >= 0; i--) {
    if (String(rows[i][2]).trim() === String(phone).trim()) {
      return {
        found: true, patientId: rows[i][15], fullName: rows[i][1], address: rows[i][4], city: rows[i][5],
        doctor: rows[i][7], lastTests: rows[i][12], lastDate: rows[i][8], age: rows[i][19] || "",
        visitCount: rows.filter(r => String(r[2]).trim() === String(phone).trim()).length
      };
    }
  }
  return { found: false };
}

/* ---------- Customer-facing booking status check (report download / confirmation) ---------- */
function getBookingStatus(ss, phone) {
  const sheet = ss.getSheetByName("Bookings");
  if (!phone || !sheet || sheet.getLastRow() < 2) return { bookings: [] };
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 19).getValues();
  const matches = rows
    .filter(r => String(r[2]).trim() === String(phone).trim())
    .map(r => ({
      timestamp: r[0], tests: r[12], date: r[8], time: r[9], amount: r[13],
      paymentMethod: r[16] || "", status: r[17] || "Pending Confirmation", reportLink: r[18] || ""
    }))
    .reverse();
  return { bookings: matches };
}

/* ---------- UPI / Payment settings ---------- */
function getSettings_(ss) {
  let sheet = ss.getSheetByName("Settings");
  if (!sheet) {
    sheet = ss.insertSheet("Settings");
    sheet.appendRow(["Key", "Value"]);
    formatHeaderRow(sheet, 2);
    sheet.appendRow(["UPI_ID", DEFAULT_UPI_ID]);
    sheet.appendRow(["UPI_QR_URL", ""]);
  }
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  const map = {};
  rows.forEach(r => { map[r[0]] = r[1]; });
  return { upiId: map["UPI_ID"] || DEFAULT_UPI_ID, qrUrl: map["UPI_QR_URL"] || "" };
}

function updateSettings_(ss, data) {
  const sheet = ss.getSheetByName("Settings") || (getSettings_(ss), ss.getSheetByName("Settings"));
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  const setValue = (key, value) => {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === key) { sheet.getRange(i + 2, 2).setValue(value); return; }
    }
    sheet.appendRow([key, value]);
  };
  if (data.upiId) setValue("UPI_ID", data.upiId);
  if (data.qrBase64) {
    const url = saveFileToFolder_(QR_FOLDER_NAME, data.qrBase64, data.qrType || "image/png", "upi-qr-" + Date.now() + ".png");
    if (url) setValue("UPI_QR_URL", url);
  }
}

/* ---------- Admin data ---------- */
function getAllAdminData(ss) {
  const bookingSheet = ss.getSheetByName("Bookings");
  const reviewSheet = ss.getSheetByName("Reviews");
  let bookings = [];
  if (bookingSheet && bookingSheet.getLastRow() >= 2) {
    const rows = bookingSheet.getRange(2, 1, bookingSheet.getLastRow() - 1, 20).getValues();
    bookings = rows.map((r, i) => ({
      rowNum: i + 2, timestamp: r[0], fullName: r[1], phone: r[2], altPhone: r[3], address: r[4], city: r[5],
      location: r[6], doctor: r[7], date: r[8], time: r[9], reportMode: r[10], email: r[11],
      tests: r[12], amount: r[13], prescription: r[14], patientId: r[15],
      paymentMethod: r[16] || "", status: r[17] || "Pending Confirmation", reportLink: r[18] || "", age: r[19] || ""
    })).reverse();
  }
  let reviews = [];
  if (reviewSheet && reviewSheet.getLastRow() >= 2) {
    const rows = reviewSheet.getRange(2, 1, reviewSheet.getLastRow() - 1, 7).getValues();
    reviews = rows.map((r, i) => ({
      rowNum: i + 2, timestamp: r[0], name: r[1], phone: r[2], test: r[3], rating: r[4], feedback: r[5], status: r[6]
    })).reverse();
  }
  return { bookings, reviews, tests: getTestsFromSheet(ss, true), bills: getBillsFromSheet(ss, true), settings: getSettings_(ss), sheetUrl: ss.getUrl(), driveUrl: getReportsFolderUrl_() };
}

function getReportsFolderUrl_() {
  try {
    const folders = DriveApp.getFoldersByName(REPORT_FOLDER_NAME);
    if (folders.hasNext()) return folders.next().getUrl();
    return DriveApp.createFolder(REPORT_FOLDER_NAME).getUrl();
  } catch (err) {
    return "";
  }
}

function handleAdminAction(ss, data) {
  const reviewSheet = ss.getSheetByName("Reviews");
  const bookingSheet = ss.getSheetByName("Bookings");
  if (data.action === "approveReview" && reviewSheet) reviewSheet.getRange(data.rowNum, 7).setValue("Approved");
  else if (data.action === "rejectReview" && reviewSheet) reviewSheet.getRange(data.rowNum, 7).setValue("Rejected");
  else if (data.action === "deleteReview" && reviewSheet) reviewSheet.deleteRow(data.rowNum);
  else if (data.action === "addTest") {
    let sheet = ss.getSheetByName("Tests");
    if (!sheet) sheet = createTestsSheet_(ss);
    sheet.appendRow([data.category, data.name, Number(data.mrp) || 0, Number(data.price) || 0, Number(data.b2b) || 0]);
    sheet.autoResizeColumns(1, 5);
  } else if (data.action === "updateTest") {
    const sheet = ss.getSheetByName("Tests");
    if (sheet) sheet.getRange(data.rowNum, 1, 1, 5).setValues([[data.category, data.name, Number(data.mrp) || 0, Number(data.price) || 0, Number(data.b2b) || 0]]);
  } else if (data.action === "deleteTest") {
    const sheet = ss.getSheetByName("Tests");
    if (sheet) sheet.deleteRow(data.rowNum);
  } else if (data.action === "addBill") {
    saveBillToSheet_(ss, data);
  } else if (data.action === "updateBill") {
    updateBillInSheet_(ss, data);
  } else if (data.action === "deleteBill") {
    deleteBillFromSheet_(ss, data);
  } else if (data.action === "updateBookingStatus" && bookingSheet) {
    bookingSheet.getRange(data.rowNum, 18).setValue(data.status);
  } else if (data.action === "uploadReport" && bookingSheet) {
    const name = `Report_${data.rowNum}_${Date.now()}_${data.reportName || "report"}`;
    const url = saveFileToFolder_(REPORT_FOLDER_NAME, data.reportBase64, data.reportType, name);
    if (url) bookingSheet.getRange(data.rowNum, 19).setValue(url);
  } else if (data.action === "updateSettings") {
    updateSettings_(ss, data);
  }
}
