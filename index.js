const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Game = require('./game');
const { strict } = require('assert');
let users = 0;
let userSockets = [];
let games = {};
let latestGameId = 0;

app.use(express.static(path.resolve(__dirname, './react/my-app/build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './react/my-app/build', 'index.html'));
});
function createPlayer(name, number){
    return {'name': name, 'ready': false, 'number': number};
}

function gameStart(game){
    let gameId = game.gameId;
    let playerSocketIds = game.playerSocketIds;
    let keys = Object.keys(playerSocketIds);
    let deck = game.deck;
    deck.createDeck();
    deck.shuffle();
    for(let i = 0; i < keys.length; i++){
        let playerName = keys[i];
        let socketId = playerSocketIds[playerName];
        let playerHands = game.playerHands
        playerHands[playerName] = deck.drawNCards(5);
        let gameData = {
            'playerHand' : game.playerHands[playerName],
        }
        console.log(gameData);
        io.to(socketId).emit('start game', gameData);

    }
    

}

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('create game', function(data) {
        let newGame = new Game();
        
        let playerName = 'player1';
        newGame.playerSocketIds[playerName] = socket.id;
        newGame.players[playerName] = createPlayer(playerName, 1);
        newGame.players['player2'] = createPlayer('empty slot 2', 2);
        newGame.players['player3'] = createPlayer('empty slot 3', 3);
        newGame.players['player4'] = createPlayer('empty slot 4' ,4);
        let gameId = "game" + latestGameId;
        newGame.gameId = gameId;    
        socket.join(gameId);

        let gameData = {
            "players" : Object.values(newGame.players),           
        }
        socket.emit('join', gameData, playerName, gameId);

        socket.gameId = gameId;
        socket.playerName = playerName;
        newGame.numOfPlayers++;
        games[gameId] = newGame;
        
        latestGameId++;
    });

    socket.on('join game', function(gameId) {
        if(games[gameId] != null && games[gameId].numOfPlayers < 4){

            let game = games[gameId]
            let playerName = "placeholder"
            let keys = Object.keys(game.players);
            for(let i = 0; i < 4; i++){
                let name = game.players[keys[i]].name
                if(name.includes("empty slot")){
                    game.players[keys[i]] = createPlayer(keys[i], i+1);
                    game.playerSocketIds[keys[i]] = socket.id;
                    playerName = keys[i];
                    break;
                }
            }
            let gameData = {
                "players" : Object.values(game.players),         
            }

            socket.emit('join', gameData, playerName, gameId);
            socket.gameId = gameId;
            socket.playerName = playerName;

            let playersInGame = {
                "players" : Object.values(game.players),
            }
            io.to(gameId).emit('user joined', playersInGame);
            socket.join(gameId);
            game.numOfPlayers++;             
        }
        else{
            socket.emit('join game', -1);
        }
    });

    socket.on('game ready', function(){
        
        let gameId = socket.gameId;
        let playerName = socket.playerName;
        let game = games[gameId];
        if(game != undefined){
            let player = game.players[playerName];
            player.ready = !(player.ready);
            if(player.ready == true){
                game.ready++;
            }
            else{
                game.ready--;
            }
            let playersInGame = {
                "players" : Object.values(game.players),
            }
            io.to(gameId).emit('game ready', playersInGame);
            console.log(game.ready);
            if(game.ready >= 4){
                console.log('start game');
                gameStart(game);
                //io.to(gameId).emit('start game');
            }            
        }
        else{
            console.log('error game ready');
        }
        

    });

    socket.on('disconnecting', function(){
        if(socket.gameId != undefined){
            let game = games[socket.gameId];
            game.numOfPlayers--;
            if(game.numOfPlayers <= 0){
                console.log("delete game")
                delete games[socket.gameId];
            }
            else{
                let playerSockets = game.playerSocketIds;
                playerSockets[socket.playerName] = null;
                let player = game.players[socket.playerName];
                let slotNumber = player.number;
                let slot = game.players[socket.playerName];
                slot.name = 'empty slot ' + slotNumber;
                slot.ready = false;
                let playersInGame = {
                    "players" : Object.values(game.players),
                }  
                io.to(socket.gameId).emit('user leave', playersInGame);
            }
        }
    })
    // socket.on('draw card', function (gameId) {
    //     let card = deck.drawCard();
    //     let gameData = {
    //         'newCard': card,
    //     }
    //     console.log('draw card')
    //     socket.emit('draw card', gameData);
    // });
});



io.on('close' , function (socket) {
  console.log("user closed");
})

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});