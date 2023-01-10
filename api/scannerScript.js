const container = document.querySelector(".container");
let scanbtn = document.getElementById("scan");
let scanner = new Instascan.Scanner({video: document.getElementById('preview')});
let uploadbtn = document.getElementById("upload");
let textBox = document.getElementById("text");
let fileInp = document.getElementById("fileInp")

let getbtn = document.getElementById("get_button");
let setbtn = document.getElementById("submit_button");
let closebutton = document.getElementById('close_button');


scanbtn.addEventListener("click", ()=>{
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
var ranges;
var setRanges;
var placeholders;


scanner.addListener('scan', function(c){
    console.log(c);

    if(isValidUrl(c) === true){
        window.open(c, "_blank");
    }else{
        parameters = c.split(",");
        document.getElementById('text').value=c;
        sheetId = parameters[1];
        //findColumn(sheetId);
        //response.result.valueRanges[0].values
        console.log("index: " + `${findRow(parameters[0], sheetId)}`)
        findRow(parameters[0], sheetId)
        console.log(ranges)
        /*document.getElementById('get_button').style.visibility= 'visible';*/
        getbtn.click();
    }

});

getbtn.addEventListener("click", ()=> {
    console.log(ranges)
    console.log(sheetId)
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
    setValues(v, setRanges, sheetId);
    document.getElementById('text1').value = "";
    document.getElementById('text2').value = "";
});

function findRow(insId, sheetId) {
    var params = {
        spreadsheetId: sheetId,
        ranges: ["A:A"],
        valueRenderOption: 'FORMATTED_VALUE',
        dateTimeRenderOption: 'SERIAL_NUMBER',
    };
    var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
    request.then(function(response) {
        console.log(response.result.valueRanges[0].values);
        values = `${response.result.valueRanges[0].values}`.split(",");
        this.index = values.indexOf(insId) + 1;
        console.log(this.index);
        ranges = "A" + index + ":F" + index;
        setRanges = "C" + index + ":F" + index;
        //return num;
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
    //return num;
}

scanner.addListener('scan', function(c){
    if(isValidUrl(c) === true){
        window.open(c, "_blank");
    }else{
        document.getElementById('text').value=c;
        console.log(c);
    }
});

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

