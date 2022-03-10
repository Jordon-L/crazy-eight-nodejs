const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Deck = require('./deck')
let users = 0;
app.use(express.static(path.resolve(__dirname, './react/my-app/build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './react/my-app/build', 'index.html'));
});


io.on('connection', function (socket) {
  console.log('a user connected');
  if(users >= 2){
    socket.disconnect()
    users--;
  }
  users++;

  let deck = new Deck();
  let discardPile = [];
  deck.createDeck();
  deck.shuffle();
  console.log(deck.cards[0].fileName)
  let gameData = {
    'playerHand' : [deck.drawCard(), deck.drawCard()]
  }
  socket.emit('game', gameData);

  socket.on('draw card', async() => {
    let card = deck.drawCard();
    let gameData = {
    'newCard' : card,
  }
    console.log('draw card')
    socket.emit('draw card', gameData);
  });

  socket.on('disconnect' , function () {
    console.log("user closed");
    users--;
    console.log(users);
  })
});



io.on('close' , function (socket) {
  console.log("user closed");
})

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});