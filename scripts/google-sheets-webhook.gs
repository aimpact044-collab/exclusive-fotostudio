/**
 * Google Apps Script Web App that receives contact-form submissions and
 * appends each one as a new row in a spreadsheet.
 *
 * Setup (standalone script — use this if "Extensions -> Apps Script" from
 * inside a Sheet fails to open):
 * 1. Open your Google Sheet, copy its ID from the URL:
 *    https://docs.google.com/spreadsheets/d/THIS_PART_IS_THE_ID/edit
 * 2. Go to https://script.google.com/home -> New project.
 * 3. Delete any default code, paste this file's contents in.
 * 4. Replace SHEET_ID below with the ID you copied in step 1.
 * 5. Deploy -> New deployment -> type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Authorize access when prompted (it's your own script/account).
 * 7. Copy the resulting Web App URL into GOOGLE_SHEETS_WEBHOOK_URL in
 *    .env.local (and restart the Next.js server).
 */

// Paste your Google Sheet's ID here (from its URL). Leave empty to use the
// script's bound spreadsheet instead (only works if the script is created
// via Extensions -> Apps Script from inside the sheet).
const SHEET_ID = "";

function getSheet_() {
  return SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID).getActiveSheet()
    : SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

function doPost(e) {
  const sheet = getSheet_();
  const data = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Дата", "Имя", "Телефон", "Тип события", "Дата события", "Сообщение"]);
  }

  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    data.name || "",
    data.phone || "",
    data.eventType || "",
    data.eventDate || "",
    data.message || "",
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ success: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
