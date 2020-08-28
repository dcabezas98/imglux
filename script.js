
var generator;

function progress(fraction){
    document.getElementById("prog").innerHTML = parseInt(fraction*100);
}

async function init(){
    generator = await tf.loadLayersModel('./TFJS_GAN-generator/model.json', {strict : false, onProgress : progress});
}

init();

console.log(generator.summary());
