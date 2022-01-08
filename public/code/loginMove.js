var btn = document.getElementById('inBtn')
var canvas = document.createElement('canvas')
var context = canvas.getContext('2d');
var text = document.getElementById('text')

function login() {
    if(display.videoWidth == 0){
        alert('open your camera')
        return 
    }
    btn.disabled = 1
    canvas.width = display.videoWidth
    canvas.height = display.videoHeight
    context.drawImage(display, 0, 0, display.videoWidth, display.videoHeight);
    const dataUri = canvas.toDataURL('image/png');

    axios.post('/login', {
        data: dataUri.split(',')[1]
    })
    .then(res=> {
        btn.disabled = 0
        console.log(res.data)
        text.innerText = res.data
    })
}
