const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors);

const server = require('http').createServer(app);
const io = require('socket.io')(server);

let messages = [];
let users = {};


io.on('connection',socket=>{
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages',messages);

    socket.on('connected', (userConnected) => {
        users[socket.id] = userConnected;
        socket.emit('users', users);
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        socket.emit('users', users);
    });

    socket.on('message', (message) => {
        messages.push(message);
        socket.broadcast.emit('message', message);
        socket.emit('message', message);
    });

    socket.on('sendMessage',data=>{
        console.log(data);
        messages.push(data);

        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(3000);