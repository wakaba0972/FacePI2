function detect(url) {
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
        if(res.data.error) throw res.data.error
        return res.data.faceId
    })
}

function creatPerson(name){
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

function addFaces(personId, url){
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

function identify(faceId){
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
        console.logres.data.candidates()
        if(res.data.error) throw res.data.error
        return res.data.candidates
    })
}

function train(){
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

function trainStatus(){
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