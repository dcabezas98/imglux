
var generator;
var tgt, files;
var inputImage;
var canvas, ctx;

function progress(fraction){
    document.getElementById("prog").innerHTML = "Loading model: "+parseInt(fraction*100).toString()+" %. Please wait.";
}

async function init(){
    //document.getElementById("subm").style.visibility="hidden";

    generator = await tf.loadLayersModel('./TFJS_GAN-generator/model.json', {strict : false, onProgress : progress});

    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    
    document.getElementById("inimg").onchange = function (evt){
	tgt = evt.target || window.event.srcElement;
	files = tgt.files;	
    }
}

function showImage(fileReader) {
    var img = document.getElementById("inimg");
    img.src = fileReader.result;
    ctx.drawImage(img, 0, 0);
}

function getImageData(fileReader) {
    inputImage = reader.result;
}

function run(){
    // FileReader support
	if (FileReader && files && files.length) {
            var fr = new FileReader(); // Read submited image as URL to display it
            fr.onload = () => showImage(fr);
            fr.readAsDataURL(files[0]);
	    fr = new FileReader(); // Read submited image as Array to feed it to the model
	    fr.onload = () => getImageData(fr);
	    fr.readAsArrayBuffer(files[0]);
	}
    else if (!FileReader){alert("Sorry! :(\nCannot load image: no HTML5 File API support.\nMaybe your browser is too old.")}
    else {alert("Sorry! :(\n Cannot load image: something is wrong with the submited file.")}
}

function run2(){
    document.getElementById("working").innerHTML = "Your image is being processed, please wait. :)"

    image = tf.tensor2d(image);
}

init().then(() => {
    document.getElementById("prog").innerHTML = "READY!  :D<br/>The model has been loaded successfully, you can now submit a dark photo to light it up.";
    //console.log(generator.summary());

    document.getElementById("subm").style.visibility="visible";
}, () => {
    document.getElementById("prog").innerHTML = "Oh No!  :(<br/>An error occurred while loading the model. Please refresh this page.";
});
