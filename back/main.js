const express = require('express')()
const server = require('http').createServer(express)
const io = require('socket.io')(server, {
    cors: {    
        origin: "http://127.0.0.1:5501",    
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true 
    }
})

const port = 8010

users = {}

io.on('connection', socket => {
    //USER
    socket.on('userName', name => {
        console.log(name, 'is connected');
        users[socket.id] = {
            name,
            id: socket.id,
            pts: 0
        }

        io.emit('users', {users})
    })

    //DRAW
    socket.on('initDraw', ({move}) => {
        //console.log(move);
        io.emit('initDraw', move)
    })

    socket.on('draw', ({move}) => {
        //console.log(move);
        io.emit('draw', move)
    })

    socket.on('msg', ({msg}) => {
        io.emit('msg', {msg, user: users[socket.id].name})
    })

    //Disconnect
    socket.on('disconnect', () => {
        delete users[socket.id]
        console.log(Object.keys(users).length)

    })


})


server.listen(port, () => {
    console.log('server on in port', port)
})