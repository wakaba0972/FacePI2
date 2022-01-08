var canvas = document.createElement('canvas')
var context = canvas.getContext('2d');

function login() {
    if(display.videoWidth == 0){
        alert('open your camera')
        return 
    }
    canvas.width = display.videoWidth
    canvas.height = display.videoHeight
    context.drawImage(display, 0, 0, display.videoWidth, display.videoHeight);
    const dataUri = canvas.toDataURL('image/png');

    axios.post('/login', {
        data: dataUri.split(',')[1]
    })
    .then(res=> {
        console.log(res.data)
        return res.data
    })
}
