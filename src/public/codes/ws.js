var msgBox = document.getElementById('msgBox')

var ws = new WebSocket(location.origin.replace(/^http/, 'ws'))

ws.onopen = function(){
    ws.send(JSON.stringify({command: "connect", name: v.name}))
}

ws.addEventListener('message', (res)=> {
    let data = JSON.parse(res.data)

    switch(data.command){
        case "regular":
            break
        case "id":
            v.id = data.id
            break
        case "enter":
            document.title = "在線人數: " + data.num
        case "message":
            let msgArea = document.createElement('pre')
            let msgHeader = document.createElement('strong')
            let msgText = document.createElement('span')

            if(data.isAuthor == 1){
                msgArea.setAttribute('class', 'me')
            }
            else{
                switch(data.name){
                    case "BOT":
                        msgArea.setAttribute('class', 'bot')
                        break
                    default:
                        msgArea.setAttribute('class', 'others')
                        break
                }
            }

            msgHeader.innerText = data.name + ' 於 ' + data.time + '發表:\n'
            msgText.innerText = data.msg + '\n'

            msgArea.appendChild(msgHeader)
            msgArea.appendChild(msgText)
            msgBox.appendChild(msgArea)
            msgBox.scrollTo(0, msgBox.scrollHeight);
            break
    }
})

ws.addEventListener('close', ()=> {
    if(confirm('連線中斷')) window.location.reload()
})