
var generator;
var tgt, files;
var imageData;
var inputTensor, outputTensor;
var canvas, ctx;
var fr;
var ready=false;

function progress(fraction){
    document.getElementById("prog").innerHTML = "Loading model: "+parseInt(fraction*100).toString()+" %. Please wait.";
}

async function init(){
    //document.getElementById("subm").style.visibility="hidden";

    generator = await tf.loadLayersModel('./TFJS_GAN-generator/model.json', {strict : false, onProgress : progress});

    canvas = document.createElement("canvas");
    canvas.width=3200;
    canvas.height=3200;
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
    console.log("imgWidth: "+imgWidth);
    console.log("imgHeight: "+imgHeight);
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
    imageData = ctx.getImageData(0,0, imgWidth, imgHeight);
    run2();
}

function run(){
    
    if (!ready) return; // Prevents multiple submission from run more than once
    ready=false;
    
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
    
    console.log("ImageDATA");
    console.log(imageData);

    /* // Slower, but do not require WebGL support
    var inputArray=new Float32Array(imageData.height*imageData.width*3);

    for(var i=0, j=0; i<imageData.data.length; i+=4, j+=3){
	inputArray[j]=imageData.data[i]/127.5-1;
	inputArray[j+1]=imageData.data[i+1]/127.5-1;
	inputArray[j+2]=imageData.data[i+2]/127.5-1;
    }

    inputTensor=tf.tensor4d(inputArray,[1,imageData.height,imageData.width,3],'float32');
     // */

     // Faster, but require WebGL support
    inputTensor=tf.browser.fromPixels(imageData);
    inputTensor=tf.reshape(inputTensor, [1,imageData.height,imageData.width,3]);
    inputTensor=inputTensor.div(tf.scalar(127.5)).sub(tf.scalar(1));
     //
    
    inputTensor=tf.image.resizeNearestNeighbor(inputTensor,[1024,1536]); // TODO: ajustar shape o dar a elegir 

    //outputTensor=generator.predict(inputTensor, training=true);

        
    
    document.getElementById("working").innerHTML = "Here you go! Click here to download full resolution image:"; 
    
    ready=true;
}

init().then(() => {
    document.getElementById("prog").innerHTML = "READY!  :D<br/>The model has been loaded successfully, you can now submit a dark photo to light it up.";
    ready=true;
    document.getElementById("subm").style.visibility="visible";
}, () => {
    document.getElementById("prog").innerHTML = "Oh No!  :(<br/>An error occurred while loading the model. Please refresh this page.";
});
