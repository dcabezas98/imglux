
var generator;
var tgt, files;
var imageData, inputImage;
var canvas, ctx;
var fr, fr2;

function progress(fraction){
    document.getElementById("prog").innerHTML = "Loading model: "+parseInt(fraction*100).toString()+" %. Please wait.";
}

async function init(){
    //document.getElementById("subm").style.visibility="hidden";

    generator = await tf.loadLayersModel('./TFJS_GAN-generator/model.json', {strict : false, onProgress : progress});

    canvas = document.getElementById("canvas");
    //canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    
    document.getElementById("img").onchange = function (evt){
	tgt = evt.target || window.event.srcElement;
	files = tgt.files;	
    }

    if (FileReader){
	fr = new FileReader();
	fr.onload = () => showImage(fr);
    }
    else{
	alert("Sorry! :(\nCannot load image: no HTML5 File API support.\nMaybe your browser is too old.");
	return;
    }
}

function showImage(fileReader) {
    var imgDisplay = document.getElementById("inimg");
    //var img = document.getElementById("auximg");
    imgDisplay.onload = () => getImageData(imgDisplay);
    //img.onload = () => getImageData(img);
    imgDisplay.src = fileReader.result;
    //img.src = fileReader.result;
}

function getImageData(img) {
    imgWidth=img.width;
    imgHeight=img.height;
    console.log("imgWidth: "+imgWidth);
    console.log("imgHeight: "+imgHeight);
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
    imageData = ctx.getImageData(0,0, imgWidth, imgHeight);
}

function run(){
    // FileReader support
    if (files && files.length)
        fr.readAsDataURL(files[0]);
    else {
	alert("Sorry! :(\n Cannot load image: something is wrong with the submited file.");
	return}

    document.getElementById("working").innerHTML = "Your image is being processed, please wait. :)"

    inputImage = imageData.data.toString();

    console.log(inputImage);

    inputImage = tf.tensor2d(inputImage);
}

init().then(() => {
    document.getElementById("prog").innerHTML = "READY!  :D<br/>The model has been loaded successfully, you can now submit a dark photo to light it up.";
    //console.log(generator.summary());

    document.getElementById("subm").style.visibility="visible";
}, () => {
    document.getElementById("prog").innerHTML = "Oh No!  :(<br/>An error occurred while loading the model. Please refresh this page.";
});
