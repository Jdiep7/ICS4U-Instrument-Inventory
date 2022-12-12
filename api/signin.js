/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '1006167168710-oa4lmc9qmg27830sh1lh54conig3kacb.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBGoOutLCJ-ptWUas05xoYgSOV9IRhVsrk';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;
let b = true; 
let id = '1mWEevuxx14kUZDClKsAREUGJvUWeXwoPDNK12aJPijY';
let range = "B2:C2";

document.getElementById('verify').style.visibility = 'hidden';
document.getElementById('authorize_button').style.visibility = 'hidden';
      

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
  callback: '' // defined later
});
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}

/*
let sheetsId = "1mWEevuxx14kUZDClKsAREUGJvUWeXwoPDNK12aJPijY"
let r = "B2:C2"
*/

function getValues(sheetsId, r) {
  var params = {
    // The spreadsheet to request.
    spreadsheetId: sheetsId,  // TODO: Update placeholder value.

    // The ranges to retrieve from the spreadsheet.
    ranges: [r],  // TODO: Update placeholder value.

    // True if grid data should be returned.
    // This parameter is ignored if a field mask was set in the request.
    includeGridData: false,  // TODO: Update placeholder value.
  };

  var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
  request.then(function(response) {
    // TODO: Change code below to process the `response` object:
    //console.log(response.result.valueRanges[0].values);
    let values = `${response.result.valueRanges[0].values}`.split(",");
    if (values.includes('undefined') == false) {
      console.log('yess')
      document.getElementById('instrument').placeholder= values[0];
      document.getElementById('student').placeholder= values[1];
    }
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}


/**
function func1() {
  document.getElementById('verify').style.visibility = 'hidden';
  tokenClient.callback = async () => {
    console.log('among');
    await batchGetValues('1mWEevuxx14kUZDClKsAREUGJvUWeXwoPDNK12aJPijY', "B2:C2")
  };
  console.log('what');
  //tokenClient.tokenRequest();
  console.log('gapi.client access token: ' + JSON.stringify(gapi.client.getToken()));
  tokenClient.requestAccessToken({
    prompt: '',
    hint: 'ethan.mei06@gmail.com'
  });
};
 */


       
    /**
      function func2() {
        tokenClient.callback = async () => {
          await batchUpdateValues('1mWEevuxx14kUZDClKsAREUGJvUWeXwoPDNK12aJPijY', 'B2:C2', 'USER_ENTERED', [[document.getElementById('instrument').value, document.getElementById('student').value]]);
        };
        tokenClient.requestAccessToken({
          prompt: '',
          hint: 'ethan.mei06@gmail.com'
        });
        console.log(b);
      }
      */
/*
        async function setValues(sheetsId, r) {
          console.log('sus');
          let ranges = [
            r
          ];
          ranges = r;
          try {
            gapi.client.sheets.spreadsheets.values.batchGet({
              spreadsheetId: spreadsheetId,
              ranges: ranges,
            }).then((response) => {
              const result = response.result;
              let values = `${result.valueRanges[0].values}`.split(",");
              if (values.includes('undefined') == false) {
                console.log('yess')
                document.getElementById('instrument').placeholder= values[0];
                document.getElementById('student').placeholder= values[1];
              }
              //document.getElementById("field1").innerHTML = values[0];
              //document.getElementById("field2").innerHTML = values[1];
              //console.log(`${result.valueRanges[0].values}`);
            });
          } catch (err) {
            document.getElementById('content').innerText = err.message;
            return;
          }
        }

        /*
        function sus() {
          var params = {
            // The spreadsheet to apply the updates to.
            spreadsheetId: '1mWEevuxx14kUZDClKsAREUGJvUWeXwoPDNK12aJPijY',  // TODO: Update placeholder value.
          };
    
          var batchUpdateSpreadsheetRequestBody = {
            // A list of updates to apply to the spreadsheet.
            // Requests will be applied in the order they are specified.
            // If any request is not valid, no requests will be applied.
            requests: [],  // TODO: Update placeholder value.
    
            // TODO: Add desired properties to the request body.
          };
    
          var request = gapi.client.sheets.spreadsheets.value.batchUpdate(params, batchUpdateSpreadsheetRequestBody);
          request.then(function(response) {
            // TODO: Change code below to process the `response` object:
            console.log(response.result);
          }, function(reason) {
            console.error('error: ' + reason.result.error.message);
          });
        }
        */
      

        function setValues(v, r, sheetsId) {
          //console.log(v[0]);
          if (v[0].includes() && b == true) {
            console.log(v);
            document.getElementById('verify').style.visibility = 'visible';
            b = false;
          } else {
            var params = {
              spreadsheetId: sheetsId
            };
            window.location.href= "#"
            let values = [['Sax', 'Matthew Chen']];
            values = v;
            const data = [];
            data.push({
              range: r,
              values: values,
            });
            // Additional ranges to update.
          
            const body = {
              data: data,
              valueInputOption: 'USER_ENTERED',
            };
              var request = gapi.client.sheets.spreadsheets.values.batchUpdate(params, body);
              request.then(function(response) {
                // TODO: Change code below to process the `response` object:
                console.log(response.result);
              }, function(reason) {
                console.error('error: ' + reason.result.error.message);
              });
              //let values = `${response.result.valueRanges[0].values}`.split(",");
            //document.getElementById('instrument').placeholder= values[0][0];
            //document.getElementById('student').placeholder= values[0][1];
            console.log("Cleared")
            document.getElementById('instrument').value = "";
            document.getElementById('student').value = "";
            if (v[0][1].includes("Andrew") && v[0][0] == "Trumpet") {
              console.log("Nothing is ever too high.");
            }
            document.getElementById('verify').style.visibility = 'hidden';
            b = true;
            }
          }
/*
        async function setValues(spreadsheetId, range, valueInputOption, _values) {
          if ( _values[0].includes("") && b == true) {
            console.log('Yes');
            document.getElementById('verify').style.visibility = 'visible';
            b = false;
          } else {
            window.location.href= "#"
            let values = [['Sax', 'Matthew Chen']];
            values = _values;
            const data = [];
            data.push({
              range: range,
              values: values,
            });
            // Additional ranges to update.
          
            const body = {
              data: data,
              valueInputOption: valueInputOption,
            };
            try {
              gapi.client.sheets.spreadsheets.values.batchUpdate({
                spreadsheetId: spreadsheetId,
                resource: body,
              }).then((response) => {
                const result = response.result;
                console.log(`${result.totalUpdatedCells} cells updated.`);
              });
            } catch (err) {
              document.getElementById('content').innerText = err.message;
              return;
            }
            //document.getElementById('instrument').placeholder= values[0][0];
            //document.getElementById('student').placeholder= values[0][1];
            document.getElementById('instrument').value = "";
            document.getElementById('student').value = "";
            if (values[0][1].includes("Andrew") && values[0][0] == "Trumpet") {
              console.log("Nothing is ever too high.");
              document.getElementById('verify').style.visibility = 'hidden';
             
            }
            b = true;
          }
        }
        */


        var title = "Test Spreadsheet"
        async function create(title) {
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

        function makeTrue() {
          b = true;
          console.log(b);
        }

      async function openPage() {
        window.location = 'api/main.html';

      };
      function handleAuthClick() {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          //document.getElementById('authorize_button').innerText = 'Refresh';
        };
        if (gapi.client.getToken() === null) {
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({
            prompt: '',
            hint: 'ethan.mei06@gmail.com'});
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({prompt: ''});
        }
      }



      /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}
