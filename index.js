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

var app = express()
    .use(express.static('public'))
    .use(express.json({limit : '50000kb'}))
    .get('/', (req, res)=> {
        res.sendFile(__dirname + '/faceRegister.html')
    })
    .post('/detect', function(req, res){
        save(req.body.data, '123')
        .then(path=> res.send(path))
    })
    .listen(PORT)

const PORT = process.env.PORT || 3000;

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

/*
function detect(name) {
    console.log('\n\n\n')
    fs.readFile('./' + name + '.jpg', function(err, buf){
        const uriBase = 'https://eastasia.api.cognitive.microsoft.com/face/v1.0/detect';

        // Request parameters.
        const params = {
            'returnFaceId': 'true',
            'returnFaceLandmarks': 'false',
            'returnFaceAttributes': ''
        };

        const options = {
            uri: uriBase,
            qs: params,
            body: buf,
            headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': "b9160fbd882f47bd821205a4bce64354"
            }
        };

        request.post(options, (err, res, body) => {
            console.log(body)
            if(err) throw err
            return body
        });
    })
}
*/   