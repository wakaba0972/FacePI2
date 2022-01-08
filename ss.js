var a = require('./self_modules/faceAPI')
var fs = require('fs')

function saveUserData(name, personId){
    return new Promise(function(resolve, reject){
        let data = JSON.stringify({name: name});
        fs.writeFile('./Persons Data/' + personId + '.json', data, function(err){
            if(err) reject(err)
            else resolve(personId)
        });
    })
}

saveUserData('asd', 'sd').then(a=> console.log(a))