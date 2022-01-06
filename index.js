const ip = require("ip");
const express = require('express')

const PORT = process.env.PORT || 3000;

const server = express()
    .use(express.static('public'))
    .get('/', (req, res)=> {
        res.sendFile(__dirname + '/faceRegister.html')
    })
    .listen(PORT, () => console.log('Listening on ' + ip.address() + ':' + PORT));

