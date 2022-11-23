const axios = require("axios");
const APIKEY = process.env.AZURE_FACEAPI_KEY;

module.exports.detect = function(path) {
    return new Promise(function(resolve, reject){
        axios.post("https://eastasia.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_03&returnRecognitionModel=false&detectionModel=detection_03&faceIdTimeToLive=86400",
            {url: 'https://facepi.herokuapp.com/' + path.slice(11)},
            {
                headers:{
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": APIKEY
                }
            }
        )
        .then(res=> {
            if(res.data.error){
                reject('wrong')
            }
            else {
                console.log(res.data)
                if(JSON.stringify(res.data) != '[]'){
                    res.data[0].url = 'https://facepi.herokuapp.com/' + path.slice(11)
                    resolve(res.data[0])
                }
                else{
                    reject('no face')
                }
            }
        })
    })
}

module.exports.createPerson = function(name){
    return new Promise(function(resolve, reject){
        axios.post("https://eastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/chatbox20220131/persons",
            {
                name: name
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": APIKEY
                }
            }
        )
        .then(res=> {
            console.log('\n\n' + res.data.personId + '\n\n') 
            if(res.data.error) reject(res.data.error)
            resolve(res.data.personId)
        })
    })
}

module.exports.addFace = function(personId, url){
    console.log('\n\n' + personId + '\n\n') 
    return new Promise(function(resolve, reject){
        axios.post("https://eastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/chatbox20220131/persons/" + personId + "/persistedFaces?detectionModel=detection_03",
            {
                url: url
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": APIKEY
                }
            }
        )
        .then(res=> {
            if(res.data.error) reject(res.data.error)
            resolve(personId)
        })
    })
}

module.exports.identify = function(faceId){
    return new Promise(function(resolve, reject){
        axios.post("https://eastasia.api.cognitive.microsoft.com/face/v1.0/identify",
            {
                faceIds: [faceId],
                personGroupId: 'chatbox20220131',
                maxNumOfCandidatesReturned: 1,
                confidenceThreshold: 0.6
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": APIKEY
                }
            }
        )
        .then(res=> {
            console.log(res.data[0].candidates[0])
            if(res.data.error) {
                reject(res.data.error)
            }
            else{
                console.log(JSON.stringify(res.data[0].candidates[0]) + '  ' + (res.data[0].candidates[0] == undefined))
                if(JSON.stringify(res.data.candidates) != '[]' && res.data[0].candidates[0] != undefined){
                    resolve(res.data[0].candidates[0].personId)
                }
                else{
                    reject('no face')
                }
            }
        })
        .catch(()=> reject())
    })
}

module.exports.getPerson = function(personId){
    return new Promise(function(resolve, reject){
        console.log('\n\n'+personId)
        axios.get("https://eastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/chatbox20220131/persons/" + personId,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": APIKEY
                }
            },
        )
        .then(res=> {
            console.log(res.data)
            if(res.data.error) reject(res.data.error)
            resolve(res.data.name)
        })
        .catch(()=> reject())
    })
}

module.exports.train = function(){
    axios.post("https://eastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/chatbox20220131/train",
        {},
        {
            headers: {
                "Ocp-Apim-Subscription-Key": APIKEY
            }
        }
    )
    .then(err=> {
        throw err
    })
}

module.exports.trainStatus = function(){
    axios.get("https://eastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/chatbox20220131/training",
    {
        headers: {
            "Ocp-Apim-Subscription-Key": APIKEY
        }
    })
    .then(res=> {
        if(res.data.error) throw error
        return res.data.status
    })
}