
var generator;
var tgt, files;
var imageData, inputImage;
var inputTensor;
var canvas, ctx;
var fr, fr2;
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

    if (FileReader){
	fr = new FileReader();
	fr.onload = () => showImage(fr);
    }
    else{
	alert("Sorry! :(\nNo HTML5 File API support.\nMaybe your browser is too old.");
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
    imgWidth=img.width;
    imgHeight=img.height;
    console.log("imgWidth: "+imgWidth);
    console.log("imgHeight: "+imgHeight);
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
    imageData = ctx.getImageData(0,0, imgWidth, imgHeight);
}

function run(){
    
    if (!ready) // Avoid double submit calling double run
	return;
    ready=false;
    
    // FileReader support
    if (files && files.length)
        fr.readAsDataURL(files[0]);
    else {
	alert("Sorry! :(\n Cannot load image: something is wrong with the submited file.");
	return}

    document.getElementById("working").innerHTML = "Your image is being processed, please wait. :)"

    while(!imageData);
    inputImage=new Float32Array();

    for(var i=0; i<imageData.data.lenght; i+=4){
	inputImage.push(imageData.data[i])/127.5-1;
	inputImage.push(imageData.data[i+1])/127.5-1;
	inputImage.push(imageData.data[i+2])/127.5-1;
    }

    inputTensor=tf.tensor3d(inputImage,[imageData.height,imageData.width,3],'float32');
    
    imageData = null;
    
    
    ready=true;
}

init().then(() => {
    document.getElementById("prog").innerHTML = "READY!  :D<br/>The model has been loaded successfully, you can now submit a dark photo to light it up.";
    //console.log(generator.summary());
    ready=true;
    document.getElementById("subm").style.visibility="visible";
}, () => {
    document.getElementById("prog").innerHTML = "Oh No!  :(<br/>An error occurred while loading the model. Please refresh this page.";
});
