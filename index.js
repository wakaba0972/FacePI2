const fs = require('fs');
const ip = require("ip");
const express = require('express');
const faceapi = require('./self_modules/faceAPI');

const PORT = process.env.PORT || 3000;

var app = express()
app.use(express.static('public'))
app.use(express.json({limit : '50000kb'}))
app.get('/registerSite', (req, res)=> {
    res.sendFile(__dirname + '/register.html')
})

app.get('/loginSite', (req, res)=> {
    res.sendFile(__dirname + '/login.html')
})

app.post('/detect', function(req, res){
    save(req.body.data)
    //.then(path=> faceapi.detect(ip.address() + ':' + PORT + path))
    .then(path=> faceapi.detect('https://facepi.herokuapp.com/' + path))
    .then(data=> {
        res.json(data)})
    .catch(()=> res.send('偵測失敗! 請確實照到臉'))
})

app.post('/create', function(req, res){
    console.log(req.body.urls)
    create(req.body.name, req.body.urls)
    .then(text=> res.send(text))
})

app.post('/login', function(req, res){
    save(req.body.data)
    .then(path=> faceapi.detect('https://facepi.herokuapp.com/' + path))
    .then(data=> faceapi.identify(data.faceId))
    .then(personId=> faceapi.getPerson(personId))
    .then(name=> res.send(name))
    .catch(()=> res.send('登入失敗! 請確認\n 1.你已成功註冊/n 2.有照到臉'))
})

app.listen(PORT, ()=> console.log('Listening on ' + ip.address() + ':' + PORT))

function save(data){
    return new Promise(function(resolve, reject){
        let buf = Buffer.from(data, 'base64')
        let id = Date.now()
        let path = './public/faces/' + id + '.png'
        fs.writeFile(path, buf, function(err) {
            if(err) reject(err)
            resolve(path.slice(9))
        })
    })
}

function create(name, urls){
    return new Promise(function(resolve, reject){
        faceapi.createPerson(name)
        .then(personId=> {
            let num = 0;
            for(let i=0; i<3; ++i){
                faceapi.addFace(personId, urls[i])
                .then(personId=> {
                    if(++num == 3) {
                        faceapi.train()
                        resolve(personId)
                    }
                })
            }
        })
    })
}
