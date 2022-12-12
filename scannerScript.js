const container = document.querySelector(".container");
let scanbtn = document.getElementById("scan");
let uploadbtn = document.getElementById("upload");
let scanner = new Instascan.Scanner({video: document.getElementById('preview')});

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

uploadbtn.addEventListener("click", ()=>{
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

