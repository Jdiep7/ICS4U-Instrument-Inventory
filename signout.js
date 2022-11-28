// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '1006167168710-oa4lmc9qmg27830sh1lh54conig3kacb.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBGoOutLCJ-ptWUas05xoYgSOV9IRhVsrk';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/sheets/v4/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('signout_button').style.visibility = 'hidden';

     /**
 * Callback after api.js is loaded.
 */
 function gapiLoaded() {
  gapi.load('client', intializeGapiClient);
}

async function intializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('signout_button').style.visibility = 'visible';
  }
}
var title = "Test Spreadsheet"

function create(title) {
try {
gapi.client.sheets.spreadsheets.create({
properties: {
title: title,
},
}).then((response) => {
console.log('Spreadsheet ID: ' + response.result.spreadsheetId);
});
} catch (err) {
document.getElementById('content').innerText = err.message;
return;
}
}