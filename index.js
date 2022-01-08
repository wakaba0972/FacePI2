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
        .then(path=> res.send('https://facepi.herokuapp.com/' + path))
    })
app.listen(PORT, ()=> console.log('Listening on ' + ip.address() + ':' + PORT))



function save(data){
    return new Promise(function(resolve, reject){
        let buf = Buffer.from(data, 'base64')
        let id = Date.now()
        let path = './public/faces/' + id + '.jpg'
        fs.writeFile(path, buf, function(err) {
            if(err) reject(err)
            resolve(path.slice(9))
        })
    })
}
