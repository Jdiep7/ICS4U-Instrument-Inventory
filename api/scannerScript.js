const container = document.querySelector(".container");
let scanbtn = document.getElementById("scan");
let scanner = new Instascan.Scanner({video: document.getElementById('preview')});
let uploadbtn = document.getElementById("upload");
let textBox = document.getElementById("text");
let fileInp = document.getElementById("fileInp")


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
    }).catch(()=> {
        modal.style.display = "block";
        modalText.innerHTML = `Cannot scan QR Code`;
    });

}

fileInp.addEventListener("change", async e => {
    console.log(e.target.files);
    let file = e.target.files[0];
    if(!file) return;
    let formData = new FormData();
    formData.append('file', file);
    fetchRequest(file, formData);
});

uploadbtn.addEventListener("click", () => fileInp.click());

