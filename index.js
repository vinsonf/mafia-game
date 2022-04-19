const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const entity = {
  ids: [],
  players: {

  },

};

const game = {
  ids: [],
  players: {

  },
  host: null,
}

class Player {
  username = '';
  id = '';
  role = '';
  constructor({id, username}){
    this.id = id;
    this.username = username;
  }

}

const roles = [
  'mafia', 'mafia', 'sheriff', 'doctor'
];




app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  entity.ids.push(socket.id);
  entity.players[socket.id] = socket;
  socket.join(socket.id);
  io.emit('all-players', entity.ids);
  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.leave(socket.id);
    delete entity.players[socket.id];
    entity.ids.splice(entity.ids.indexOf(socket.id), 1);
  });

  socket.on('message', (data) => {
    console.log(data, data.to);
    socket.to(data.to).emit('message', data.message);
  });

  socket.on('start-game', () => {
    console.log('start game');
    game.ids.sort((a,b) => {
      return Math.random() - 0.5;
    });

    game.ids.forEach((username, index) => {
      game.players[username].role = roles[index] ? roles[index] : 'civilian';
      console.log('id', game.players[username].id, 'role', game.players[username].role);
      console.log(game.players);
      io.to(game.players[username].id).emit('role', game.players[username].role);
    })

  });
  socket.on('username', (username) => {
    console.log('username', username);
    const player = new Player({
      username,
      id: socket.id,
    });

    console.log(player);
    game.players[username] = player;
    game.ids.push(username);
    io.emit('player-created', username);
  });

 

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
