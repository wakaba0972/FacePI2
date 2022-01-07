var display = document.getElementById('display')
var canvas = document.createElement('canvas')
var btn = document.getElementById('Btn')
var context = canvas.getContext('2d');

function openCam(){
    let constraints = {video: {width: 500, height: 500}}
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            display.srcObject = stream
            display.play()
        })
        .catch(function (error) {
            alert(error)
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
            resolve(window.location.href + '/' + res.data)
        })
        .catch(err=> {
            reject(err)
        })
    })
}