const CLIENT_ID = '1006167168710-oa4lmc9qmg27830sh1lh54conig3kacb.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBGoOutLCJ-ptWUas05xoYgSOV9IRhVsrk';

const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets.readonly';

let preValue;
var imageUrls = [];

let tokenClient;
let gapiInited = false;
let gisInited = false;

//const wrapper = document.querySelector(".wrapper"),
//qrInput = wrapper.querySelector(".form input"),
//generateBtn = wrapper.querySelector(".form button");
const split_and_qr = document.querySelector(".split_and_qr")
qrImg = document.querySelector(".qr-code img");
let downloadBtn = document.getElementById("downloadbtn");
let clearBtn = document.getElementById("clearbtn");


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
  let preBtn = document.getElementById("sheetsPreviewButton");
  let newPreBtn = document.getElementById("newPreviewButton");
  var values;
  var sheetsId = "none";
  var longName = "none";
  var shortName = "none";
  var r;
  let isPreview = false;

  //document.getElementById("back").style.visibility = 'hidden';
  let isSelected = false;
  function setNewButton() {
    document.getElementById("newQR").style.backgroundColor = '#e6f4ea';
    document.getElementById("newQR").style.color = '#188038';
    document.getElementById("existingQR").style.backgroundColor = '';
    document.getElementById("existingQR").style.color = '';
    document.getElementById("right_split").style.width = "0vw";
  }

  function setExistingButton() {
    document.getElementById("existingQR").style.color = '#188038';
    document.getElementById("existingQR").style.backgroundColor = '#e6f4ea';
    document.getElementById("newQR").style.backgroundColor = '';
    document.getElementById("newQR").style.color = '';
    document.getElementById("right_split").style.width = "75vw";
  }

  preBtn.addEventListener("click", ()=> {
    let start = document.getElementById("startRange").value;
    let end = document.getElementById("endRange").value;
    if (start < 5) {
        start = 5;
    }
    r = "A" + start + ":B" + end;
    sheetsGenerationPreview(start, r);
  });


  genbtn.addEventListener("click", ()=> {
      let start = document.getElementById("startRange").value;
      let end = document.getElementById("endRange").value;
      if (start < 5) {
          start = 5;
      }
        r = "A" + start + ":A" + end;
        console.log(r);
        getValues(sheetsId, r, start);
        setURL(sheetsId);
      
  });
  
  newPreBtn.addEventListener("click", ()=> {
    isPreview = true;
    generateOrPreview()
  });

downloadBtn.addEventListener("click", () => {
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
      
      QRmultiGen(values)
      clearInputs();
    }, function(reason) {
      console.error('error: ' + reason.result.error.message);
    });
  }
  


  function newBookQR (startNumber, amount, name, sheetsId) {
    let newItems = [];
    let ind;
      for (let i = 0; i < amount; i++) {
        ind = parseInt(i) + parseInt(startNumber);
        newItems[i] = "EM-" + name + "-" + ind + "," + sheetsId;
      }
      console.log(sheetsId)
      console.log(newItems)
      QRmultiGen(newItems)
  }

  function newInsQR (startNumber, amount, name, company, sheetsId) {
    let newItems = [];
    let ind;
      for (let i = 0; i < amount; i++) {
        ind = parseInt(i) + parseInt(startNumber);
        newItems[i] = name + " " + ind + "," + sheetsId;
      }
      console.log(newItems)
      QRmultiGen(newItems)
  }

  function addRows(index, amount, sheetsId, allRows) {
    var params = {
      spreadsheetId: sheetsId
    };
    const data = [];
    let startIndex = parseInt(index);
    //console.log(startIndex)
    let endIndex = parseInt(index) + parseInt(amount);
    //console.log(endIndex)
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
    console.log(startIndex)
    console.log(endIndex)
    const body = {
      requests: data,
    };
      var request = gapi.client.sheets.spreadsheets.batchUpdate(params, body);
      request.then(function(response) {
        // TODO: Change code below to process the `response` object:
        console.log(response.result);
        let range = "A" + (startIndex + 1) + ":B" + (endIndex + 1)
        fillCells(allRows, range, sheetsId);
        
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
        clearInputs();
        window.location.href = "#confirm";
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
  }

  function generateOrPreview() {
    let index = document.getElementById("setStartRange").value;
    let startNumber = document.getElementById("setStartNumber").value;
    let amount = document.getElementById("setAmount").value;
    let company = document.getElementById("newCompany").value;
    let allRows = [];
    let ind;

    //let singleRow = [nameAndNumber, company]
    //let allRows = Array(parseInt(amount)).fill(singleRow)
    console.log(allRows)
    
    
    
    if (sheetsId == "1mWEevuxx14kUZDClKsAREUGJvUWeXwoPDNK12aJPijY") {
      for (let i = 0; i < amount; i++) {
        ind = parseInt(i) + parseInt(startNumber);
        allRows[i] = [(longName + " " + ind), company]
      }
      if (isPreview) {
        newGenerationPreview(index, allRows);
      } else {
        newInsQR(startNumber, amount, longName, company, sheetsId);
        addRows(index, amount, sheetsId, allRows);
      }
      isPreview = false;
    } 
    if (sheetsId == "1FFqn2Oh-zi8j8foW5iq8qd_-m-hLk8LVrAXJpPa3Lo0") {
      for (let i = 0; i < amount; i++) {
        ind = parseInt(i) + parseInt(startNumber);
        allRows[i] = [("EM-" + shortName + "-" + ind), company]
      }
      console.log(allRows)
      if (isPreview) {
        newGenerationPreview(index, allRows);
      } else {
        newBookQR(startNumber, amount, shortName, "", sheetsId);
        addRows(index, amount, sheetsId, allRows);
      }
      isPreview = false;
    }
    console.log(isPreview)
    console.log(sheetsId);
    setURL(sheetsId); 
  }

  function sheetsGenerationPreview(start, r) {
    console.log("sheets preview")
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
        for (let i = 0; i < values.length; i++) {
          if (/\d/.test(values[i]) && /\d/.test(values[i + 1])) {
            let index = parseInt(i + 1);
            values.splice(index, 0, " ");
            console.log(values);
          }
        }

        let table = document.getElementById("sheet_preview").getElementsByTagName('tbody')[0];
        for (let i = 0; i < (values.length/2); i++) {
          let row = table.insertRow(i);
          for (let j = 0; j < 3; j++) {
            if (j == 0) {
              row.insertCell(j).innerHTML = parseInt(i) + parseInt(start);
            } else {
              row.insertCell(j).innerHTML = values[parseInt(j) + (2*(parseInt(i)))-1];
            }
          }
        }

      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
      document.getElementById("previewText").style.visibility="hidden";
  }

  function newGenerationPreview(startIndex, allRows) {
    console.log("table")
    let table = document.getElementById("sheet_preview").getElementsByTagName('tbody')[0];
    for (let i = 0; i < allRows.length; i++) {
      let row = table.insertRow(i);
      for (let j = 0; j < 3; j++) {
        if (j == 0) {
          row.insertCell(j).innerHTML = parseInt(i) + parseInt(startIndex) + 1;
        } else {
          row.insertCell(j).innerHTML = allRows[parseInt(i)][parseInt(j) - 1];
        }
      }
    }
    document.getElementById("previewText").style.visibility="hidden";
  }

  function clearInputs() {
    document.getElementById("selectSheet").selectedIndex = "";
    document.getElementById("setStartRange").value = "";
    document.getElementById("setStartNumber").value = "";
    document.getElementById("setAmount").value = "";
    document.getElementById("selectInstrument").selectedIndex = 0;
    document.getElementById("newCompany").value = "";
    document.getElementById("startRange").value = "";
    document.getElementById("endRange").value = "";
    document.getElementById("sheet_preview").getElementsByTagName('tbody')[0].innerHTML= "";
    document.getElementById("previewText").style.visibility="visible";
    /*document.getElementById("pdfembed").src = "QRgenerator.pdf";*/
  }

  function clearInputsBtn() {
    document.getElementById("selectSheet").selectedIndex = "";
    document.getElementById("setStartRange").value = "";
    document.getElementById("setStartNumber").value = "";
    document.getElementById("setAmount").value = "";
    document.getElementById("selectInstrument").selectedIndex = 0;
    document.getElementById("newCompany").value = "";
    document.getElementById("startRange").value = "";
    document.getElementById("endRange").value = "";
    document.getElementById("sheet_preview").getElementsByTagName('tbody')[0].innerHTML= "";
    document.getElementById("previewText").style.visibility="visible";
    document.getElementById("pdfembed").src = "QRgenerator.pdf";
    clearQR();
  }

  //Called on spreadsheet selection dropdown menu. Sets the selected spreadsheet's ID
  function setSheet() {
      let index = document.getElementById("selectSheet").selectedIndex;
      console.log(document.getElementById("selectSheet").options[index].text)
      sheetsId = document.getElementById("selectSheet").options[index].value;
      let sharingLink = "https://docs.google.com/spreadsheets/d/" + sheetsId + "/edit?usp=sharing&chrome=false&widget=false";
      document.getElementById("frame").src = sharingLink;
      setURL(sheetsId);
  }

  //Using the options from the instrument dropdown menu, sets the full/shortened name of selected instrument.
  function setInstrument() {
      let index = document.getElementById("selectInstrument").selectedIndex;
      longName = document.getElementById("selectInstrument").options[index].text;
      shortName = document.getElementById("selectInstrument").options[index].value;
  }


  function QRmultiGen(qrList){
    console.log("multi")
    for (var i = 0; i < qrList.length; i++) { 
        let qrValue=qrList[i];
        //generateBtn.innerText = "Generating QR Code...";
        //qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${qrValue}`
        imageUrls.push(`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${qrValue}`);
        //console.log(imageUrls);
    }
    previewQrPdf()
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
        /*qrImg.addEventListener("load", ()=>{
            wrapper.classList.add("active");
            generateBtn.innerText="Generate QR Code";
        });*/
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

  function previewQrPdf() {
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
    let PdfUri = doc.output("datauri");
    console.log(PdfUri)
    document.getElementById("pdfembed").src = PdfUri;
  }

  function setURL (sheetId) {
    let newURL = "https://docs.google.com/spreadsheets/d/" + sheetId;
    console.log(newURL)
    document.getElementById("sheets_link").href = newURL;
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
        prompt: ''});
    } else {
      //Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({
        prompt: ''});
    }
  }

  function clearQR() {
    imageUrls = [];
    if(qrInput.value != ""){
        imageUrls.push(qrImg.src);
    }
  }





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


/*qrInput.addEventListener("keyup", ()=>{
    console.log('hello');
    if(!qrInput.value.trim()){
        wrapper.classList.remove("active");
        preValue = "";
    }
});
*/

