const express = require('express')

const IO = require('socket.io')
const HTTP = require('http')

const color = require('colors')
const path = require('path')

class Server {

    app= express.Application
    port = 3000
    http
    io

    constructor(){
        this.app = new express()
        this.http = HTTP.createServer(this.app)
        this.io = IO(this.http)
        
        this.config()
        this.middleware()
        this.routes()
        this.socket()
    }

    config(){
        this.app.set('port', process.env.PORT || 3000)
    }

    middleware(){
        this.app.use(express.static(__dirname + '/public'))
        
        this.app.use('/bootstrap', express.static(path.join(__dirname , '../node_modules/bootstrap')))
        this.app.use('/jquery', express.static(path.join(__dirname , '../node_modules/jquery')))
        this.app.use('/fontawesome', express.static(path.join(__dirname , '../node_modules/@fortawesome/fontawesome-free')))
        
        this.app.use('/socket', express.static(path.join(__dirname , '../node_modules/socket.io-client')))

    }

    routes(){
        this.app.get('/',(req,res)=>{
            res.redirect('index.html')
        })
    }

    socket(){
        this.io.on('connection',(socket)=>{
            console.log('user conectado')

            socket.on('stream',(image)=>{
                socket.broadcast.emit('stream',image)
            })

            socket.on('disconnnect',()=>{
                console.log('user desconectado')
            })
        })    
    }

    async start(){
        await this.http.listen(this.app.get('port'))
        console.log('server up')

    }
}

const server = new Server()
server.start()