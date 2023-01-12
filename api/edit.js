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

  let genbtn = document.getElementById("generate");
  let genNewBtn = document.getElementById("generateNew");
  var values;
  var sheetsId = "none";
  var longName = "none";
  var shortName = "none";
  var r;

  document.getElementById("back").style.visibility = 'hidden';
  let isVisible = true;
  function setButton() {
      if (isVisible) {
          document.getElementById("newQR").style.visibility = 'hidden';
          document.getElementById("existingQR").style.visibility = 'hidden';
          document.getElementById("back").style.visibility = 'visible';
          isVisible = false;
      } else {
          document.getElementById("newQR").style.visibility = 'visible';
          document.getElementById("existingQR").style.visibility = 'visible';
          document.getElementById("back").style.visibility = 'hidden';
          isVisible = true;
      }
  }

  genbtn.addEventListener("click", ()=> {
      let start = document.getElementById("startRange").value;
      let end = document.getElementById("endRange").value;
      if (start < 4) {
          start = 4;
      }
      r = "A" + start + ":A" + end;
      console.log(r);
      getValues(sheetsId, r);
  });
  
  genNewBtn.addEventListener("click", ()=> {
    let index = document.getElementById("setStartRange").value;
    let amount = document.getElementById("setAmount").value;
    let company = document.getElementById("newCompany").value;
    if (sheetsId == "1mWEevuxx14kUZDClKsAREUGJvUWeXwoPDNK12aJPijY") {
        newInsQR(index, amount, longName, company, sheetsId);
        addRows(index, amount, sheetsId, longName, company);
    } 
    if (sheetsId == "1FFqn2Oh-zi8j8foW5iq8qd_-m-hLk8LVrAXJpPa3Lo0") {
        newBookQR(index, amount, shortName, sheetsId);
        addRows(index, amount, sheetsId, shortName, "");
    }
});

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

  function addRows(index, amount, sheetsId, name, company) {
    var params = {
      spreadsheetId: sheetsId
    };
    const data = [];
    let startIndex = parseInt(index) + 1;
    console.log(startIndex)
    let endIndex = parseInt(index) + parseInt(amount) + 1;
    console.log(endIndex)
    data.push({
      "insertDimension": {
        "range": {
          "sheetId": 0,
          "dimension": "ROWS",
          "startIndex": startIndex,
          "endIndex": endIndex
        },
        "inheritFromBefore": false
      }
    });
    const body = {
      requests: data,
    };
      var request = gapi.client.sheets.spreadsheets.batchUpdate(params, body);
      request.then(function(response) {
        // TODO: Change code below to process the `response` object:
        console.log(response.result);
        let names = [Array(parseInt(amount)).fill(name)]
        console.log(names)
        let companies = [Array(parseInt(amount)).fill(company)]
        let nameRows = "A" + startIndex + ":A" + endIndex
        let companyRows = "B" + startIndex + ":B" + endIndex
        fillCells(names, nameRows, sheetsId);
        fillCells(companies, companyRows, sheetsId);
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
  }

  function fillCells(v, r, sheetsId) {
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
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
  }

  //Called on spreadsheet selection dropdown menu. Sets the selected spreadsheet's ID
  function setSheet() {
      let index = document.getElementById("selectSheet").selectedIndex;
      console.log(document.getElementById("selectSheet").options[index].text)
      sheetsId = document.getElementById("selectSheet").options[index].value;
  }

  //Using the options from the instrument dropdown menu, sets the full/shortened name of selected instrument.
  function setInstrument() {
      let index = document.getElementById("selectInstrument").selectedIndex;
      longName = document.getElementById("selectInstrument").options[index].text;
      shortName = document.getElementById("selectInstrument").options[index].value;
  }

  function generateQR() {
    let qrValue=qrInput.value.trim();
    if(qrValue == ""){
        modal.style.display = "block";
        modalText.innerHTML = `Please Enter a Text or URL in the QR Input`;
    } 
    else if (preValue == qrValue){
        modal.style.display = "block";
        modalText.innerHTML = `QR Code already generated for this text/URL`;
    }
    else{
        preValue = qrValue;
        generateBtn.innerText = "Generating QR Code...";
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${qrValue}`
        imageUrls.push(qrImg.src);
        console.log(imageUrls);
        qrImg.addEventListener("load", ()=>{
            wrapper.classList.add("active");
            generateBtn.innerText="Generate QR Code";
        });
    }
  }

  function downloadQR() {
    var doc = new jsPDF('p', 'mm', 'a3');
    x = 3;
    y = 3
    qrNum = 0;

    for(let i=0; i<imageUrls.length; i++){
        qrNum = qrNum + 1
        var img = new Image();
        img.src = imageUrls[i];
        if (qrNum > 6){
            y = y + 50;
            qrNum = 0;
            x = 3;
        }
        doc.addImage(img, "png", x, y);
        x =  x + 49;
    }
    doc.save("new.pdf");
  }

  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      //document.getElementById('authorize_button').innerText = 'Refresh';
    };
    if (gapi.client.getToken() === null) {
      //Prompt the user to select a Google Account and ask for consent to share their data when establishing a new session.
      tokenClient.requestAccessToken({
        prompt: '',
        hint: 'ethan.mei06@gmail.com'});
    } else {
      //Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({
        prompt: '',
        hint: 'ethan.mei06@gmail.com'});
    }
  }

  function clearQR() {
    imageUrls = [];
    if(qrInput.value != ""){
        imageUrls.push(qrImg.src);
    }
  }



const wrapper = document.querySelector(".wrapper"),
//qrInput = wrapper.querySelector(".form input"),
//generateBtn = wrapper.querySelector(".form button");
qrImg = wrapper.querySelector(".qr-code img");
let downloadBtn = document.getElementById("downloadbtn");
let clearBtn = document.getElementById("clearbtn");

let preValue;
var imageUrls = [];

/*generateBtn.addEventListener("click", () => {
    let qrValue=qrInput.value.trim();
    if(qrValue == ""){
        modal.style.display = "block";
        modalText.innerHTML = `Please Enter a Text or URL in the QR Input`;
    } 
    else if (preValue == qrValue){
        modal.style.display = "block";
        modalText.innerHTML = `QR Code already generated for this text/URL`;
    }
    else{
        preValue = qrValue;
        generateBtn.innerText = "Generating QR Code...";
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${qrValue}`
        imageUrls.push(qrImg.src);
        console.log(imageUrls);
        qrImg.addEventListener("load", ()=>{
            wrapper.classList.add("active");
            generateBtn.innerText="Generate QR Code";
        });
    }
});
*/

/*downloadBtn.addEventListener("click", () => {
    var doc = new jsPDF('p', 'mm', 'a3');
    x = 3;
    y = 3
    qrNum = 0;

    for(let i=0; i<imageUrls.length; i++){
        qrNum = qrNum + 1
        var img = new Image();
        img.src = imageUrls[i];
        if (qrNum > 6){
            y = y + 50;
            qrNum = 0;
            x = 3;
        }
        doc.addImage(img, "png", x, y);
        x =  x + 49;
    }
    doc.save("new.pdf");
});*/

/*
clearBtn.addEventListener("click", ()=>{
    imageUrls = [];
    if(qrInput.value != ""){
        imageUrls.push(qrImg.src);
    }
});
*/


qrInput.addEventListener("keyup", ()=>{
    console.log('hello');
    if(!qrInput.value.trim()){
        wrapper.classList.remove("active");
        preValue = "";
    }
});