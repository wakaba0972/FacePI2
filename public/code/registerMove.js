var canvas = document.createElement('canvas')
var context = canvas.getContext('2d');

function getURL() {
    if(display.videoWidth == 0){
        alert('open your camera')
        return 
    }
    else if(v.facesURL.length > 2){
        v.Tstate = true
        alert('already 3 photos')
        return
    }
    v.Tstate = true
    canvas.width = display.videoWidth
    canvas.height = display.videoHeight
    context.drawImage(display, 0, 0, display.videoWidth, display.videoHeight);
    const dataUri = canvas.toDataURL('image/jpg');

    axios.post('/detect', {
        data: dataUri.split(',')[1]
    })
    .then(res=> {
        v.Tstate = false
        console.log(res.data)
        if(res.data.msg){
            console.log(res.data.msg)
            return
        }
        else{
            let temp = v.text.split(v.text[6])
            v.text = temp[0] + (v.text[6]-1) + temp[1]
            v.facesURL.push(res.data.url)
        }
    })
    .catch(err=> {
        console.log(err)
    })
}

function createPerson() {
    if(v.facesURL.length < 3){
        alert('需要3張照片')
        return
    }
    else if(v.name == ''){
        alert('請輸入暱稱')
    }
    else{
        v.Cstate = true,
        axios.post('/create', {
            name: v.name,
            urls: v.facesURL
        })
        .then(res=> {
            console.log(res.data)
        })
    }
}