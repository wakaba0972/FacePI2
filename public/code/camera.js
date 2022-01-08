var display = document.getElementById('display')
var canvas = document.createElement('canvas')
var btn = document.getElementById('openBtn')
var context = canvas.getContext('2d');

function openCam(){
    let constraints = {video: {facingMode: "user", width: 720, height: 720}}
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            display.srcObject = stream
            display.play()
        })
        .catch(function (error) {
            alert(error)
        });
}