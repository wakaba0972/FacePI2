const fs = require('fs');
const ip = require("ip");
//const https = require('https');
const express = require('express')
const request = require("request");
/*
var hskey = fs.readFileSync(__dirname + '/pillaAuth-key.pem');
var hscert = fs.readFileSync(__dirname + '/pillaAuth-cert.pem');
var credentials = {
    key: hskey,
    cert: hscert
};  */

const PORT = process.env.PORT || 3000;

var app = express()
    .use(express.static('public'))
    .use(express.json({limit : '50000kb'}))
    .get('/', (req, res)=> {
        res.sendFile(__dirname + '/login.html')
    })
    .post('/detect', function(req, res){
        save(req.body.data, '123')
        .then(path=> res.send(path))
    })
    .listen(PORT)

/*
https.createServer(credentials, app)
    .listen(PORT, () => console.log('Listening on https://' + ip.address() + ':' + PORT))*/

function save(data, name){
    return new Promise(function(resolve, reject){
        let buf = Buffer.from(data, 'base64')
        let path = './public/faces/' + name + '.jpg'
        fs.writeFile(path, buf, function(err) {
            if(err) reject(err)
            resolve(path.slice(9))
        })
    })
}
