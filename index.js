const fs = require('fs');
const ip = require("ip");
const express = require('express')
const request = require("request");

const PORT = process.env.PORT || 3000;

var app = express()
    .use(express.static('public'))
    .use(express.json({limit : '50000kb'}))
    .get('/', (req, res)=> {
        res.sendFile(__dirname + '/login.html')
    })
    .post('/detect', function(req, res){
        save(req.body.data)
        .then(path=> res.send(path))
    })
    .listen(PORT)

function save(data){
    return new Promise(function(resolve, reject){
        let buf = Buffer.from(data, 'base64')
        let id = '123' //Number(Math.random().toString() + Date.now()).toString(16).slice(2)
        let path = './public/faces/' + id + '.jpg'
        fs.writeFile(path, buf, function(err) {
            if(err) reject(err)
            resolve(path.slice(9))
        })
    })
}
