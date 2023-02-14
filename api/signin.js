const CLIENT_ID = '1006167168710-oa4lmc9qmg27830sh1lh54conig3kacb.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBGoOutLCJ-ptWUas05xoYgSOV9IRhVsrk';

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
/*const container = document.querySelector(".container");
let scanbtn = document.getElementById("scan");
let uploadbtn = document.getElementById("upload");*/

document.getElementById('get_button').style.visibility = 'hidden';
document.getElementById('verify').style.visibility = 'hidden';
/*document.getElementById('authorize_button').style.visibility = 'hidden';*/
document.getElementById('get_button').style.visibility = 'hidden';
      

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
    console.log("login")
    handleAuthClick();
  }
}

/*
let sheetsId = "1mWEevuxx14kUZDClKsAREUGJvUWeXwoPDNK12aJPijY"
let r = "B2:C2"
*/

function getValues(sheetsId, r) {
  console.log(r)
  var params = {
    spreadsheetId: sheetsId,
    ranges: [r],
    includeGridData: false
  };

  var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
  request.then(function(response) {
    //console.log(response.result.valueRanges[0].values);
    let values = `${response.result.valueRanges[0].values}`.split(",");
    console.log(response.result.valueRanges[0].values)
    console.log(values)
    /*if (values.includes("") == false) {    
      document.getElementById('item_name').innerHTML= values[0];
      document.getElementById('text1').placeholder= values[2];
      document.getElementById('text2').placeholder= values[3];
      document.getElementById('text3').placeholder= values[4];
      document.getElementById('text4').placeholder= values[5];
    }
    */
    if (sheetsId == "1mWEevuxx14kUZDClKsAREUGJvUWeXwoPDNK12aJPijY") {
      document.getElementById('title_name').innerHTML= "Instrument";
      if (values[0] != "") {
        document.getElementById('item_name').innerHTML= values[0];
      }
      if (values[1] != "") {
        document.getElementById('item_desc').innerHTML= values[1];
      }
      
      for (let i = 2; i < values.length; i++) {
        let textId = "text";
        textId += i-1;
        console.log(textId)
        console.log(values.length)
        if (values[i] != "") {
          document.getElementById(textId).placeholder= values[i];
        }
      }
      
    } else {
      document.getElementById('title_name').innerHTML= "Book";
      if (values[0] != "") {
        document.getElementById('item_name').innerHTML= values[0];
      }

      for (let i = 1; i < values.length - 1; i++) {
        let textId = "text";
        textId += i;
        console.log(textId)
        console.log(values.length)
        if (values[i] != "") {
          document.getElementById(textId).placeholder= values[i];
        }
      }
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
      

        function setValues(v, index, sheetsId) {
          //let b = true;
          //console.log(v[0]);
          if ((document.getElementById("text1").value == null|| document.getElementById("text2").value == null || document.getElementById("text3").value ==  null) && b) {
            console.log(verify);
            document.getElementById('verify').style.visibility = 'visible';
            b = false;
          } else {
            window.location.href="#";
            let r;
            if (sheetsId == "1mWEevuxx14kUZDClKsAREUGJvUWeXwoPDNK12aJPijY") {
              r = "C" + index + ":F" + index;
            } else {
              r= "B" + index + ":E" + index;
            }
            var params = {
              spreadsheetId: sheetsId
            };
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
                makeTrue();
                makeTrue()
              }, function(reason) {
                console.error('error: ' + reason.result.error.message);
              });
              //let values = `${response.result.valueRanges[0].values}`.split(",");
            //document.getElementById('instrument').placeholder= values[0][0];
            //document.getElementById('student').placeholder= values[0][1];
            //console.log("Cleared")

            document.getElementById('verify').style.visibility = 'hidden';
            b = true;
            document.getElementById('get_button').style.visibility = 'hidden'
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
                */

      function makeTrue() {
        document.getElementById('item_name').innerHTML = "";
        document.getElementById('item_desc').innerHTML = "";
        document.getElementById('text1').value = "";
        document.getElementById('text2').value = "";
        document.getElementById('text3').value = "";
        document.getElementById('text4').value = "";
        document.getElementById('text1').placeholder = "";
        document.getElementById('text2').placeholder = "";
        document.getElementById('text3').placeholder = "";
        document.getElementById('text4').placeholder = "";
        //document.getElementById('verify').style.visibility = 'hidden';
        //document.getElementById('get_button').style.visibility = 'hidden'
        b = true;
        console.log(b);
      }

      function openPage() {
        window.location.href = 'main.html';
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
          tokenClient.requestAccessToken({
            prompt: '',
            hint: 'ethan.mei06@gmail.com'});
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