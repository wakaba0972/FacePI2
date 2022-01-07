function detect(url) {
    console.log(url)
    axios.post("https://eastasia.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_04&returnRecognitionModel=false&detectionModel=detection_03&faceIdTimeToLive=86400",
                {url: url},
                {
                    headers:{
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": "b9160fbd882f47bd821205a4bce64354"
                    }
                }
    )
    .then(res=> {
        console.log(res.data)
    })
}