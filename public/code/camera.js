var display = document.getElementById('display')
var canvas = document.createElement('canvas')
var btn = document.getElementById('savBtn')
var context = canvas.getContext('2d');


function openCam(){
    let constraints = {video: true}
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            display.srcObject = stream
            display.play()
        })
        .catch(function (error) {
            btn.innerText = error
        });
}

function getURL() {
    return new Promise(function(resolve, reject){
        canvas.width = display.videoWidth
        canvas.height = display.videoHeight
        context.drawImage(display, 0, 0, display.videoWidth, display.videoHeight);
        const dataUri = canvas.toDataURL('image/jpg');

        axios.post('/detect', {
            data: dataUri.split(',')[1]
        })
        .then(res=> {
            resolve(window.location.href + '/code/' + res.data)
        })
        .catch(err=> {
            reject(err)
        })
    })
}