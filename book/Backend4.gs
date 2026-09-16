/* ---------- Patient Profile (Customer App) ----------
   Extends the existing "Patients" sheet (Patient ID, Phone, Name,
   First Visit) with extra profile fields the patient can fill in
   themselves: Age, Gender, Address, City, Photo. These columns are
   added automatically the first time they're needed — no manual
   migration step required for this one. */

const PROFILE_PHOTO_FOLDER_NAME = "Kalyan Pathlab - Profile Photos";

function ensurePatientsProfileColumns_(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const needed = ["Age", "Gender", "Address", "City", "Photo"];
  needed.forEach(h => {
    if (headers.indexOf(h) === -1) {
      const col = sheet.getLastColumn() + 1;
      sheet.getRange(1, col).setValue(h);
      formatHeaderRow(sheet, col);
    }
  });
}

function getProfile_(ss, phone) {
  const sheet = ss.getSheetByName("Patients");
  if (!phone || !sheet || sheet.getLastRow() < 2) return { found: false };
  ensurePatientsProfileColumns_(sheet);
  const lastCol = sheet.getLastColumn();
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, lastCol).getValues();
  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][1]).trim() === String(phone).trim()) {
      return {
        found: true, patientId: rows[i][0], phone: rows[i][1], name: rows[i][2],
        age: rows[i][4] || "", gender: rows[i][5] || "", address: rows[i][6] || "", city: rows[i][7] || "",
        photo: rows[i][8] || ""
      };
    }
  }
  return { found: false };
}

function saveProfile_(ss, d) {
  let sheet = ss.getSheetByName("Patients");
  if (!sheet) {
    sheet = ss.insertSheet("Patients");
    const headers = ["Patient ID", "Phone", "Name", "First Visit"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length);
  }
  ensurePatientsProfileColumns_(sheet);
  const lastRow = sheet.getLastRow();
  let rowNum = 0;
  if (lastRow >= 2) {
    const phones = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
    for (let i = 0; i < phones.length; i++) {
      if (String(phones[i][0]).trim() === String(d.phone).trim()) { rowNum = i + 2; break; }
    }
  }
  let photoUrl = "";
  if (d.photoBase64) {
    photoUrl = saveFileToFolder_(PROFILE_PHOTO_FOLDER_NAME, d.photoBase64, d.photoType || "image/jpeg", "profile_" + d.phone + "_" + Date.now() + ".jpg");
  }
  if (rowNum) {
    sheet.getRange(rowNum, 3).setValue(d.name || "");
    sheet.getRange(rowNum, 5, 1, 4).setValues([[d.age || "", d.gender || "", d.address || "", d.city || ""]]);
    if (photoUrl) sheet.getRange(rowNum, 9).setValue(photoUrl);
  } else {
    const newId = "KP" + String(lastRow).padStart(4, "0");
    sheet.appendRow([newId, d.phone, d.name || "", new Date(), d.age || "", d.gender || "", d.address || "", d.city || "", photoUrl]);
  }
}

function getAllPatientProfiles_(ss) {
  const sheet = ss.getSheetByName("Patients");
  if (!sheet || sheet.getLastRow() < 2) return [];
  ensurePatientsProfileColumns_(sheet);
  const lastCol = sheet.getLastColumn();
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, lastCol).getValues();
  return rows
    .map(r => ({ patientId: r[0], phone: r[1], name: r[2], age: r[4] || "", gender: r[5] || "", address: r[6] || "", city: r[7] || "", photo: r[8] || "" }))
    .filter(p => String(p.phone).trim() !== "");
}
