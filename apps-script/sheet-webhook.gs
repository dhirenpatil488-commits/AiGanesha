// Paste this into Extensions > Apps Script inside your Google Sheet
// Then: Deploy > New Deployment > Web App (Execute as: Me, Access: Anyone)
// Copy the Web App URL into .env.local as VITE_WEBHOOK_URL

function doPost(e) {
  const data  = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    new Date(),
    data.email,
    data.name || '',
    data.calculatorType,
    data.totalTonnes,
    data.timestamp,
    data.source || ''
  ]);
  return ContentService.createTextOutput('OK');
}
