const fs = require('fs');
const ip = require("ip");
const express = require('express');
const WebSocket = require('ws').Server
const faceapi = require('./self_modules/faceAPI');

const PORT = process.env.PORT || 3000;

var app = express()
    .use(express.static('src/public'))
    .use(express.json({limit : '50000kb'}))
    .get('/', (req, res)=> {
        res.sendFile(__dirname + '/site/home.html')
    })
    .get('/registerSite', (req, res)=> {
        res.sendFile(__dirname + '/site/register.html')
    })
    .get('/loginSite', (req, res)=> {
        res.sendFile(__dirname + '/site/login.html')
    })
    .post('/detect', function(req, res){
        save(req.body.data)
        //.then(path=> faceapi.detect(ip.address() + ':' + PORT + path))
        .then(path=> faceapi.detect('https://facepi.herokuapp.com/' + path))
        .then(data=> {
            res.json(data)})
        .catch(()=> res.json({msg: '偵測失敗! 請確實照到臉'}))
    })
    .post('/create', function(req, res){
        console.log(req.body.urls)
        create(req.body.name, req.body.urls)
        .then(personId=>{
            res.json({status: 'success', personId: personId})
        })
        .catch(()=> {
            res.json({status: 'failed', msg: '我不知道怎麼了，在試一次看看?'})
        })
    })
    .post('/login', function(req, res){
        save(req.body.data)
        .then(path=> faceapi.detect('https://facepi.herokuapp.com/' + path))
        .then(data=> faceapi.identify(data.faceId))
        .then(personId=> faceapi.getPerson(personId))
        .then(name=> res.json({status: 'success', name: name}))
        .catch(()=> res.json({status: 'failed', msg: '登入失敗! 請確認\n 1.你已成功註冊\n 2.有照到臉'}))
    })
    .listen(PORT, ()=> console.log('Listening on ' + ip.address() + ':' + PORT))



var clientList = {}
const wsApp = new WebSocket({app})
wsApp.on('connection', ws=> {
    ws.id = Number(Math.random().toString() + Date.now()).toString(16).substr(2)
    console.log(new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}) + ' Connection: ' + wsApp.clients.size)

    ws.on('message', (res)=> {
        res = JSON.parse(res)

        switch(res.command){
            case "regular":
                break
            case "connect":
                ws.name = res.name 
                clientList[ws.id] = ws
                let date = new Date()
                let time = date.getHours()+'時'+date.getMinutes()+'分 '

                ws.send(JSON.stringify({command: 'id', id: ws.id}))
                wsApp.clients.forEach((client) => {
                    client.send(JSON.stringify({command: "enter", time: time, name: "BOT", num: wsApp.clients.size, msg: ws.name + "君 進入聊天室"}));
                })
                break
            case "message":
                res.name = clientList[res.id].name
                let id = res.id
                delete res.id

                res.isAuthor = 0
                let data_for_others = JSON.stringify(res)
                res.isAuthor = 1
                let data_for_author = JSON.stringify(res)

                wsApp.clients.forEach((client) => {
                    if(id == client.id){
                        client.send(data_for_author)
                    }
                    else{
                        client.send(data_for_others)
                    }
                })
                console.log(new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}) + ' ' + res.name +': ' + res.msg)
                break
        }
    })

    ws.on('close', (e)=> {
        delete clientList.ws
        let date = new Date()
        let time = date.getHours()+'時'+date.getMinutes()+'分 '
        wsApp.clients.forEach((client) => {
            client.send(JSON.stringify({command: "connection", time: time, name: "BOT", num: wsApp.clients.size, msg: ws.name + "君 離開聊天室"}))
        })
        console.log(new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}) + ' Connection: ' + wsApp.clients.size)
    })
})

var a = JSON.stringify({command: "regular"})
setInterval(()=>{
    wsApp.clients.forEach((client) => {
        client.send(a);
    })
}, 40000)





function save(data){
    return new Promise(function(resolve, reject){
        let buf = Buffer.from(data, 'base64')
        let id = Date.now()
        let path = 'src/public/faces/' + id + '.png'
        console.log('faces/' + id + '.png')
        fs.writeFile(path, buf, function(err) {
            if(err) reject(err)
            resolve(path.slice(11))
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
