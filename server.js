const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let players = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (name) => {
    players.push({ id: socket.id, name });
    io.emit('updatePlayers', players);
  });

  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    players = players.filter((player) => player.id !== socket.id);
    io.emit('updatePlayers', players);
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
