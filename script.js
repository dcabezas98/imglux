
var generator, tgt, files, image;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");


function progress(fraction){
    document.getElementById("prog").innerHTML = "Loading model: "+parseInt(fraction*100).toString()+" %";
}

async function init(){
    //document.getElementById("subm").style.visibility="hidden";

    generator = await tf.loadLayersModel('./TFJS_GAN-generator/model.json', {strict : false, onProgress : progress});
    
    document.getElementById("img").onchange = function (evt){
	tgt = evt.target || window.event.srcElement;
	files = tgt.files;	
    }
}

function showImage(fileReader) {
    var img = document.getElementById("out_img");
    img.onload = () => getImageData(img);
    img.src = fileReader.result;
}

function getImageData(img) {
    ctx.drawImage(img, 0, 0);
    image = ctx.getImageData(0, 0, img.width, img.height).data;
    console.log("image data:", image);
}

function run(){
    // FileReader support
	if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = () => showImage(fr);
            fr.readAsDataURL(files[0]);
	}
    else if (!FileReader){alert("Sorry! :(<br/> Cannot load image: no FileReader support.")}
    else {alert("Sorry! :(<br/> Cannot load image: something is wrong with the submited file.")}
}

init().then(() => {
    document.getElementById("prog").innerHTML = "READY!  :D<br/>The model has been loaded successfully, you can now submit a dark photo to light it up.";
    //console.log(generator.summary());

    document.getElementById("subm").style.visibility="visible";
}, () => {
    document.getElementById("prog").innerHTML = "Oh No!  :(<br/>An error occurred while loading the model. Please refresh this page.";
});
