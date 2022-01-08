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

function getID() {
    return new Promise(function(resolve, reject){
        canvas.width = display.videoWidth
        canvas.height = display.videoHeight
        context.drawImage(display, 0, 0, display.videoWidth, display.videoHeight);
        const dataUri = canvas.toDataURL('image/jpg');

        axios.post('/detect', {
            data: dataUri.split(',')[1]
        })
        .then(res=> {
            resolve(window.location.href + res.data)
        })
        .catch(err=> {
            reject(err)
        })
    })
}