const axios = require("axios");
const e = require("express");

module.exports.detect = function(url) {
    return new Promise(function(resolve, reject){
        axios.post("https://eastasia.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_03&returnRecognitionModel=false&detectionModel=detection_03&faceIdTimeToLive=86400",
            {url: url},
            {
                headers:{
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": "b9160fbd882f47bd821205a4bce64354"
                }
            }
        )
        .then(res=> {
            if(res.data.error){
                resolve({msg: 'wrong'})
            }
            else {
                console.log(JSON.stringify(res.data) == '[]')
                if(res.data[0].faceId){
                    res.data[0].url = url
                    console.log(res.data[0])
                    resolve(res.data[0])
                }
                else{
                    console.log(res.data[0])
                    resolve({msg: 'no face'})
                }
            }
        })
    })
}

module.exports.createPerson = function(name){
    axios.post("https://eastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/nscjkaljklsdav/persons",
        {
            name: name
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": "b9160fbd882f47bd821205a4bce64354"
            }
        }
    )
    .then(res=> {
        if(res.data.error) throw res.data.error
        return res.data.personId
    })
}

module.exports.addFaces = function(personId, url){
    axios.post("https://eastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/nscjkaljklsdav/persons/" + personId + "/persistedFaces?detectionModel=detection_03",
        {
            url: url
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": "b9160fbd882f47bd821205a4bce64354"
            }
        }
    )
    .then(res=> {
        if(res.data.error) throw res.data.error
        return res.data.persistedFaceId
    })
}

module.exports.identify = function(faceId){
    axios.post("https://eastasia.api.cognitive.microsoft.com/face/v1.0/identify",
        {
            faceIds: [faceId],
            personGroupId: 'nscjkaljklsdav',
            maxNumOfCandidatesReturned: 1,
            confidenceThreshold: 0.6
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": "b9160fbd882f47bd821205a4bce64354"
            }
        }
    )
    .then(res=> {
        console.log(res.data[0])
        if(res.data.error) throw res.data.error
        return res.data[0]
    })
}

module.exports.train = function(){
    axios.post("https://eastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/nscjkaljklsdav/train",
        {},
        {
            headers: {
                "Ocp-Apim-Subscription-Key": "b9160fbd882f47bd821205a4bce64354"
            }
        }
    )
    .then(err=> {
        throw err
    })
}

module.exports.trainStatus = function(){
    axios.get("https://eastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/nscjkaljklsdav/training",
    {
        headers: {
            "Ocp-Apim-Subscription-Key": "b9160fbd882f47bd821205a4bce64354"
        }
    })
    .then(res=> {
        if(res.data.error) throw error
        return res.data.status
    })
}