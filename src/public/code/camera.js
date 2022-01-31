var display = document.getElementById('display')

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
