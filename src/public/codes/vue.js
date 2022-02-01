var v = new Vue({
    el: '#app',
    created() {
        if(localStorage.getItem('name') == null){
            let name = prompt('請輸入暱稱')
            localStorage.setItem('name', name)
            this.name = name
        }
        else{
            this.name = localStorage.getItem('name')
        }
        window.addEventListener('keypress', (key) => {
            if(key.which == 13){
                this.send()
            }
        });
    },
    data: {
        hasStar: true,
        text: "送出",
        name: "",
        msg: "",
        id: ""
    },
    methods: {
        send: function(){
            if(this.msg.search('228922') != -1){
                this.text = '委任你是不是沒被扁過'
                this.msg = ""
            }
            if(this.msg && !this.msg.match(/^\s+$/)){
                let date = new Date()
                let time = date.getHours()+'時'+date.getMinutes()+'分 '
                ws.send(JSON.stringify({command: "message", time: time, id: this.id, name: this.name, msg: this.msg}))
                this.msg = ""
            }
        },
        star: function(){
            if(this.hasStar){
                document.getElementById('bg').style['opacity'] = '0.7'
                this.hasStar = false
            }
            else{
                document.getElementById('bg').style['opacity'] = '0'
                this.hasStar = true
            }
        }
    },
})