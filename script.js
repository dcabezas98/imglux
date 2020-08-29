
var generator;
var ready = false;

function progress(fraction){
    document.getElementById("prog").innerHTML = "Loading model: "+parseInt(fraction*100).toString()+" %";
}

async function init(){
    //document.getElementById("subm").style.visibility="hidden";
    
    generator = await tf.loadLayersModel('./TFJS_GAN-generator/model.json', {strict : false, onProgress : progress});
}

function run(inimg){
    console.log(typeof(inimg));
}

init().then(() => {
    document.getElementById("prog").innerHTML = "READY! :D<br/>The model has been loaded, you can now submit a dark photo to light it up.";
    //console.log(generator.summary());

    ready = true;
    document.getElementById("subm").style.visibility="visible";
});




