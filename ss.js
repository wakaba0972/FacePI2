var a = require('./self_modules/faceAPI')
var fs = require('fs')

function saveUserData(name, personId){
    return new Promise(function(resolve, reject){
        fs.readFile('./PersonsData.json')
        raw.personId = name
        fs.writeFileSync('./PersonsData.json', raw)
        resolve(personId)
    })
}
saveUserData('asd', 'sd').then(a=> console.log(a))