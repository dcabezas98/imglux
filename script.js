
var generator;
var tgt, files;
var imageData;
var inputTensor, outputTensor;
var canvas, ctx;
var outCanvas, outCtx;
var fr;
var ready=false;

function progress(fraction){
    document.getElementById("prog").innerHTML = "Loading model: "+parseInt(fraction*100).toString()+" %. Please wait.";
}

async function init(){
    //document.getElementById("subm").style.visibility="hidden";

    generator = await tf.loadLayersModel('./TFJS_GAN-generator/model.json', {strict : false, onProgress : progress});

    canvas = document.createElement("canvas");
    canvas.width=6400;
    canvas.height=6400;
    ctx = canvas.getContext("2d");
    
    document.getElementById("img").onchange = function (evt){
	tgt = evt.target || window.event.srcElement;
	files = tgt.files;	
    }

    outCanvas; = document.getElementById("outCanvas");
    outCtx = outCanvas.getContext("2d");

    if (FileReader){
	fr = new FileReader();
	fr.onload = () => showImage(fr);
    }
    else{
	alert("Sorry!  :(\nNo HTML5 File API support.\nMaybe your browser is too old.");
	return;
    }
}

function showImage(fileReader) {
    var imgDisplay = document.getElementById("inimg");
    var auximg = document.createElement("img");
    auximg.onload = () => getImageData(auximg);
    imgDisplay.src = fileReader.result;
    auximg.src = fileReader.result;
}

function getImageData(img) {
    var imgWidth=img.width;
    var imgHeight=img.height;
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
    imageData = ctx.getImageData(0,0, imgWidth, imgHeight);
    run2();
}

function run(){
    
    if (!ready) return; // Prevents multiple submission from run more than once
    ready=false;

    document.getElementById("working").innerHTML = "";
    outCtx.clearRect(0, 0, outCanvas.width, outCanvas.height); // Clear output canvas
    
    if (files && files.length)
        fr.readAsDataURL(files[0]);
    else {
	alert("Sorry!  :(\nCannot load image: something is wrong with the submited file.");
	ready = true;
	return;
    }
}

function run2(){
    
    document.getElementById("working").innerHTML = "Your image is being processed, please wait. :)";

    inputTensor=tf.browser.fromPixels(imageData);
    inputTensor=tf.reshape(inputTensor, [1,imageData.height,imageData.width,3]);
    inputTensor=inputTensor.div(tf.scalar(127.5)).sub(tf.scalar(1));
     //
    
    inputTensor=tf.image.resizeNearestNeighbor(inputTensor,[512,768]); // TODO: ajustar shape o dar a elegir

    outputTensor=generator.predict(inputTensor, training=true);
    
    outputTensor=outputTensor.div(tf.scalar(2)).add(tf.scalar(0.5));
    outputTensor=outputTensor.squeeze();

    tf.browser.toPixels(outputTensor, outCanvas);
    
    document.getElementById("working").innerHTML = "Here you go!"; // Click here to download full resolution image:"; 
    
    ready=true;
}

init().then(() => {
    document.getElementById("prog").innerHTML = "READY!  :D<br/>The model has been loaded successfully, you can now submit a dark photo to light it up.";
    ready=true;
    document.getElementById("subm").style.visibility="visible";
}, () => {
    document.getElementById("prog").innerHTML = "Oh No!  :(<br/>An error occurred while loading the model. Please refresh this page.";
});
