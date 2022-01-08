const { default: axios } = require("axios");

var canvas = document.createElement('canvas')
var context = canvas.getContext('2d');

function getURL() {
    if(display.videoWidth == 0){
        alert('open your camera')
        return 
    }
    canvas.width = display.videoWidth
    canvas.height = display.videoHeight
    context.drawImage(display, 0, 0, display.videoWidth, display.videoHeight);
    const dataUri = canvas.toDataURL('image/png');

    axios.post('/detect', {
        data: dataUri.split(',')[1]
    })
    .then(res=> {
        return res.data.faceId
    })
}

function identify(faceId){
    axios.post('/identify',{
        faceId: faceId
    })
    .then(res=> {
        if(JSON.stringify(res.data.candidates) != '[]'){
            return res.data.personId
        }
    })
}

function getName(personId){
    axios.post('/getPerson',{
        personId: personId
    })
    .then(res=> {
        return res.body.name
    })
}