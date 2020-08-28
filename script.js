
function progress(fraction){
    document.getElementById("prog").innerHTML = fraction;
}

async function init(){
    const generator = await tf.loadLayersModel('./TFJS_GAN-generator/model.json', {strict : false, onProgress : progress});
}

init();
console.log(generator.summary());
