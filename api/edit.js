const CLIENT_ID = '1006167168710-oa4lmc9qmg27830sh1lh54conig3kacb.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBGoOutLCJ-ptWUas05xoYgSOV9IRhVsrk';

const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets.readonly';

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
      handleAuthClick();
    }
  }

  var values;

  function getValues(sheetsId, r) {
    //console.log(r)
    var params = {
      spreadsheetId: sheetsId,
      ranges: [r],
      includeGridData: false
    };
  
    var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
    request.then(function(response) {
      //console.log(response.result.valueRanges[0].values);
      this.values = `${response.result.valueRanges[0].values}`.split(",");
      //console.log(response.result.valueRanges[0].values)
      console.log(values)
      values.forEach((element, index) => {
        values[index] = element + "," + sheetsId;
      });
      console.log(values)
      /*if (values.includes("") == false) {    
        document.getElementById('item_name').innerHTML= values[0];
        document.getElementById('text1').placeholder= values[2];
        document.getElementById('text2').placeholder= values[3];
        document.getElementById('text3').placeholder= values[4];
        document.getElementById('text4').placeholder= values[5];
      }
      */
    }, function(reason) {
      console.error('error: ' + reason.result.error.message);
    });
  }

  function newBookQR (index, amount, name, sheetsId) {
    let newItems = [];
    let ind;
      for (let i = 0; i < amount; i++) {
        ind = parseInt(i) + parseInt(index);
        newItems[i] = "EM-" + name + "-" + ind + "," + sheetsId;
      }
      console.log(newItems)
  }

  function newInsQR (index, amount, name, company, sheetsId) {
    let newItems = [];
    let ind;
      for (let i = 0; i < amount; i++) {
        newItems[i] = name + " " + i + "," + sheetsId;
      }
      console.log(newItems)
  }

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

  function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }
  
