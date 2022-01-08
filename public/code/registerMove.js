var canvas = document.createElement('canvas')
var context = canvas.getContext('2d');

function getURL() {
    if(display.videoWidth == 0){
        alert('open your camera')
        return 
    }
    else if(v.facesURL.length > 2){
        v.state = true
        alert('already 3 photos')
        return
    }
    v.state = true
    canvas.width = display.videoWidth
    canvas.height = display.videoHeight
    context.drawImage(display, 0, 0, display.videoWidth, display.videoHeight);
    const dataUri = canvas.toDataURL('image/jpg');

    axios.post('/detect', {
        data: dataUri.split(',')[1]
    })
    .then(res=> {
        v.state = false
        console.log(res.data)
        if(res.data.msg){
            console.log(res.data.msg)
            return
        }
        else{
            v.facesURL.push(res.data.url)
        }
    })
    .catch(err=> {
        console.log(err)
    })
}

function creatPerson() {
    if(V.facesURL.length < 3){
        alert('需要3張照片')
        return
    }
    else if(V.name == ''){
        alert('請輸入暱稱')
    }
    else{
        axios.post('/create', {
            name: v.name
        })
    }
}