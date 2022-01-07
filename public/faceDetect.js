function detect(data) {
    let params = {
        "returnFaceId": "true",
        "recognitionModel": "recognition_04",
        "detectionModel": "detection_03",
        "faceIdTimeToLive": "86400",
    };
  
    $.ajax({
        url: "https://eastasia.api.cognitive.microsoft.com/face/v1.0/detect?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Content-Type","application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "b9160fbd882f47bd821205a4bce64354");
        },
        type: "POST",
        // Request body
        body: data,
        //data: '{"url": "' + url + '"}'
    })
    .done(function(data) {
        alert("success");
    })
    .fail(function() {
        alert("error");
    });
}