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
        if(res.data.status == 'success'){
            //text.innerText = 'Wecome!!!!!! ' + res.data.name
            window.location.href = location.origin + '/chatRoom?key=' + res.data.key + '&name=' + res.data.name
        }
        else{
            text.innerText = res.data.msg
        }
    })
}
