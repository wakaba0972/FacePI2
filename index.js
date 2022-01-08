const fs = require('fs');
const ip = require("ip");
const express = require('express');
const faceapi = require('./self_modules/faceAPI')

const PORT = process.env.PORT || 3000;

var app = express()
app.use(express.static('public'))
app.use(express.json({limit : '50000kb'}))
app.get('/', (req, res)=> {
        res.sendFile(__dirname + '/register.html')
    })
app.post('/detect', function(req, res){
        save(req.body.data)
        //.then(path=> faceapi.detect(ip.address() + ':' + PORT + path))
        .then(path=> faceapi.detect('https://facepi.herokuapp.com/' + path))
        .then(data=> {
            res.json(data)})
    })
app.post('/create', function(req, res){
        create(req.body.name, req.body.urls)
        .then(text=> res.send(text))
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

function saveUserData(name, personID){
    console.log(personID)
    return new Promise(function(resolve, reject){
        let data = JSON.stringify({name: name});
        fs.writeFile('./Persons Data/' + personID + '.json', data, function(err){
            if(err) reject(err)
            else resolve(personID)
        });
    })
}

function create(name, urls){
    return new Promise(function(resolve, reject){
        faceapi.createPerson(name)
        .then(personID=> saveUserData(name, personID))
        .then(personID=> faceapi.addFace(personID, urls[0]))
        .then(personID=> faceapi.addFace(personID, urls[1]))
        .then(personID=> faceapi.addFace(personID, urls[2]))
        .then((personID)=> {
            console.log(personID + ' ' + name)
            resolve(personID)
        })
    })
}
