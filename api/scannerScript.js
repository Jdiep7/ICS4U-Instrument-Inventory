const container = document.querySelector(".container");
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets.readonly';
const CLIENT_ID = '1006167168710-oa4lmc9qmg27830sh1lh54conig3kacb.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBGoOutLCJ-ptWUas05xoYgSOV9IRhVsrk';

let scanbtn = document.getElementById("scan");
let scanner = new Instascan.Scanner({video: document.getElementById('preview')});
let uploadbtn = document.getElementById("upload");
let textBox = document.getElementById("text");
let fileInp = document.getElementById("fileInp")
let tokenClient;
let gapiInited = false;
let gisInited = false;
let b = true; 
let id = '1mWEevuxx14kUZDClKsAREUGJvUWeXwoPDNK12aJPijY';
let range = "B2:C2";

let getbtn = document.getElementById("get_button");
let setbtn = document.getElementById("submit_button");
let closebutton = document.getElementById('close_button');


// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.


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
        hint: ''});
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({
        prompt: '',
        hint: ''});
    }
  }

scanbtn.addEventListener("click", ()=>{
    console.log("clicked")
    if(scanbtn.innerText === "Scan QR Code"){
        container.classList.add("scannerActive");
        scanbtn.innerText = "Stop Scanning";
        Instascan.Camera.getCameras().then(function(cameras){
            if(cameras.length > 0){
                scanner.start(cameras[0]);
            }else{
                modal.style.display = "block";
                modalText.innerHTML = `No cameras found`;
            }
        }).catch(function(e){
            console.error(e);
        });
    }else if(scanbtn.innerText === "Stop Scanning"){
        container.classList.remove("scannerActive");
        scanbtn.innerText = "Scan QR Code";
        Instascan.Camera.getCameras().then(function(cameras){
            if(cameras.length > 0){
                scanner.stop(cameras[0]);
            }else{
                modal.style.display = "block";
                modalText.innerHTML = `No cameras found`;
            }
        }).catch(function(e){
            console.error(e);
        });
    }
});

const isValidUrl = urlString=>{
    try{
        return Boolean(new URL(urlString));
    }catch(e){
        return false;
    }
}

/*scanner.addListener('scan', function(c){
    if(isValidUrl(c) === true){
        window.open(c, "_blank");
    }else{
        document.getElementById('text').value=c;
        console.log(c);
    }
});*/

var parameters;
var sheetId;
var index = 3;
var ranges = -3;
var placeholders;


scanner.addListener('scan', function(c){
    console.log(c);

    if(isValidUrl(c) === true){
        window.open(c, "_blank");
    }else{
        console.log(c);
        parameters = c.split(",");
        /*console.log(parameters[0]);*/
        document.getElementById('text').value=parameters[0];
        sheetId = parameters[1];
        //findColumn(sheetId);
        //response.result.valueRanges[0].values
        /*console.log("index: " + `${findRow(parameters[0], sheetId)}`)*/
        findRow(parameters[0], sheetId)
        console.log(parameters)
        console.log(sheetId)
        console.log(ranges)
        console.log(index)
        /*document.getElementById('get_button').style.visibility= 'visible';*/
    }

});

getbtn.addEventListener("click", ()=> {
    console.log("hello");
    /*console.log(ranges);
    console.log(sheetId);*/
    getValues(sheetId, ranges);
});

setbtn.addEventListener("click", ()=> {
    let v1 = document.getElementById("text1").placeholder;
    let v2 = document.getElementById("text2").placeholder;
    let v3 = document.getElementById("text3").placeholder;
    let v4 = document.getElementById("text4").placeholder;
    if (document.getElementById("text1").value != '') {
        v1 = document.getElementById("text1").value;
    }
    if (document.getElementById("text2").value != '') {
        v2 = document.getElementById("text2").value;
    } 
    if (document.getElementById("text3").value != '') {
        v3 = document.getElementById("text3").value;
    }
    if (document.getElementById("text4").value != '') {
        v4 = document.getElementById("text4").value;
    }
    
    let v = [[v1, v2, v3, v4]];
    console.log(document.getElementById("text1").value)
    setValues(v, index, sheetId);
    /*document.getElementById('text1').value = "";
    document.getElementById('text2').value = "";*/
});

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

function findRow(insId, sheetId) {
    console.log('hello');
    var params = {
        spreadsheetId: sheetId,
        ranges: ["A:A"],
        valueRenderOption: 'FORMATTED_VALUE',
        dateTimeRenderOption: 'SERIAL_NUMBER',
    };
    console.log(sheetId)
    var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
    request.then(function(response) {
        /*console.log(response.result.valueRanges[0].values);*/
        values = `${response.result.valueRanges[0].values}`.split(",");
        index = values.indexOf(insId) + 1;
        console.log(index);
        ranges = "A" + index + ":F" + index;
        console.log(ranges);
        getbtn.click();
        /*setRanges = "C" + index + ":F" + index;*/
        //return num;
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
    //return num;
}

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

  

url_http = "http://api.qrserver.com/v1/read-qr-code/";
url_https = "https://api.qrserver.com/v1/read-qr-code/";

function fetchRequest(file, formData){
    uploadbtn.innerText = "Uploading QR Code...";

    fetch(url_http, {
        method: 'POST', body: formData
    }).then(res=>res.json()).then(result => {
        result = result[0].symbol[0].data;
        if(textBox.value = result){
            uploadbtn.innerText = "Upload QR Code";
        }else{
            uploadbtn.innerText = "Couldn't Scan QR Code";
        }
        if(!result) return;
    
        if(isValidUrl(result) === true){
            window.open(result, "_blank");
        }else{
            textBox.value=result;
            console.log(result);
        }

        parameters = result.split(",");
        sheetId = parameters[1];
        //findColumn(sheetId);
        //response.result.valueRanges[0].values
        console.log("index: " + `${findRow(parameters[0], sheetId)}`)
        findRow(parameters[0], sheetId)
        console.log(ranges)
        /*document.getElementById('get_button').style.visibility= 'visible';*/
        getbtn.click();


    }).catch(()=> {
        modal.style.display = "block";
        modalText.innerHTML = `Cannot scan QR Code`;
    });

}


closebutton.addEventListener("click", ()=>{
    makeTrue()
});



fileInp.addEventListener("change", async e => {
    console.log(e.target.files);
    let file = e.target.files[0];
    if(!file) return;
    let formData = new FormData();
    formData.append('file', file);
    fetchRequest(file, formData);
});

uploadbtn.addEventListener("click", () => fileInp.click());

function openSpreadsheetTab() {
  window.open("https://docs.google.com/spreadsheets/d/" + sheetId, "_blank").focus();
}
