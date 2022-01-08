const fs = require('fs');
const ip = require("ip");
const express = require('express');
const faceapi = require('./self_modules/faceAPI');

const PORT = process.env.PORT || 3000;

var app = express()
app.use(express.static('public'))
app.use(express.json({limit : '50000kb'}))
app.get('/register', (req, res)=> {
        res.sendFile(__dirname + '/register.html')
    })
app.get('/login', (req, res)=> {
    res.sendFile(__dirname + '/login.html')
})
app.post('/detect', function(req, res){
        save(req.body.data)
        //.then(path=> faceapi.detect(ip.address() + ':' + PORT + path))
        .then(path=> faceapi.detect('https://facepi.herokuapp.com/' + path))
        .then(data=> {
            res.json(data)})
    })
app.post('/create', function(req, res){
        console.log(req.body.urls)
        create(req.body.name, req.body.urls)
        .then(text=> res.send(text))
})
app.post('/identify', function(req, res){
    faceapi.identify(req.body.faceId)
    .then(data=> {
        console.log(data)
        res.json(data)
    })
})
app.post('getPerson', function(req, res){
    faceapi.getPerson(req.body.personId)
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
