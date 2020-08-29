
var generator;

function progress(fraction){
    document.getElementById("prog").innerHTML = "Loading model: "+parseInt(fraction*100).toString()+" %";
}

async function init(){
    //document.getElementById("subm").style.visibility="hidden";
    
    generator = await tf.loadLayersModel('./TFJS_GAN-generator/model.json', {strict : false, onProgress : progress});
}

function onFileLoad(e) {
    $('#show_selected_image').html('<img src="'+e.target.result +'"/>');
}

function run(){
    var reader = new FileReader();
    reader.onload = onFileLoad;
    reader.readAsDataURL(files[0]);
}

init().then(() => {
    document.getElementById("prog").innerHTML = "READY!  :D<br/>The model has been loaded successfully, you can now submit a dark photo to light it up.";
    //console.log(generator.summary());

    document.getElementById("subm").style.visibility="visible";
}, () => {
    document.getElementById("prog").innerHTML = "Oh No!  :(<br/>An error occurred while loading the model. Please refresh this page.";
});
