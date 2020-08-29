
var generator;
var tgt, files;
var inputImage;
var canvas, ctx;
var fr, fr2;

function progress(fraction){
    document.getElementById("prog").innerHTML = "Loading model: "+parseInt(fraction*100).toString()+" %. Please wait.";
}

async function init(){
    //document.getElementById("subm").style.visibility="hidden";

    generator = await tf.loadLayersModel('./TFJS_GAN-generator/model.json', {strict : false, onProgress : progress});

    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    
    document.getElementById("img").onchange = function (evt){
	tgt = evt.target || window.event.srcElement;
	files = tgt.files;	
    }

    if (FileReader){
	fr = new FileReader();
	fr.onload = () => showImage(fr);
	fr2 = new FileReader();
	fr2.onload = () => getImageData(fr2);
    }
    else
	alert("Sorry! :(\nCannot load image: no HTML5 File API support.\nMaybe your browser is too old.")
}

function showImage(fileReader) {
    var img = document.getElementById("inimg");
    img.src = fileReader.result;
    ctx.drawImage(img, 0, 0);
}

function getImageData(fileReader) {
    inputImage = fileReader.result;
}

function run(){
    // FileReader support
    if (files && files.length) {
        // Read submited image as URL to display it
        fr.readAsDataURL(files[0]);
	// Read submited image as Array to feed it to the model
	fr.readAsArrayBuffer(files[0]);
    }
    else {alert("Sorry! :(\n Cannot load image: something is wrong with the submited file.")}

    document.getElementById("working").innerHTML = "Your image is being processed, please wait. :)"

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
