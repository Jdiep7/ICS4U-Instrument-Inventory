const wrapper = document.querySelector(".wrapper"),
qrInput = wrapper.querySelector(".form input"),
generateBtn = wrapper.querySelector(".form button");
qrImg = wrapper.querySelector(".qr-code img");
let downloadBtn = document.getElementById("downloadbtn");
let clearBtn = document.getElementById("clearbtn");

let preValue;
var imageUrls = [];

generateBtn.addEventListener("click", () => {
    let qrValue=qrInput.value.trim();
    if(qrValue == ""){
        modal.style.display = "block";
        modalText.innerHTML = `Please Enter a Text or URL in the QR Input`;
    } 
    /*else if (preValue == qrValue){
        modal.style.display = "block";
        modalText.innerHTML = `QR Code already generated for this text/URL`;
    }*/
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

clearBtn.addEventListener("click", ()=>{
    imageUrls = [];
    if(qrInput.value != ""){
        imageUrls.push(qrImg.src);
    }
});


qrInput.addEventListener("keyup", ()=>{
    console.log('hello');
    if(!qrInput.value.trim()){
        wrapper.classList.remove("active");
        preValue = "";
    }
});