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
const connections = [null,null,null,null];

app.use(express.static(path.resolve(__dirname, './react/my-app/build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './react/my-app/build', 'index.html'));
});


io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('create game', function(data) {
        let newGame = new Game();
        newGame.playerSocketIds[0] = socket.id;
        let playerName = 'player0';
        newGame.playerNames[0] = playerName;
        let gameId = "game" + latestGameId;        
        socket.join(gameId);

        let gameData = {
            "gameId" : gameId,
            "players" : newGame.playerNames,
            "name" : playerName            
        }
        socket.emit('join', gameData);

        socket.gameId = gameId;
        socket.playerNumber = 0;
        newGame.numOfPlayers++;
        games[gameId] = newGame;
        
        latestGameId++;
    });

    socket.on('join game', function(gameId) {
        console.log(gameId);
        if(games[gameId] != null && games[gameId].numOfPlayers < 4){

            let game = games[gameId]
            console.log(game.numOfPlayers);
            let playerNumber = -1;
            let playerName = "placeholder"
            for(let i = 0; i < 4; i++){ 
                if(game.playerSocketIds[i] == null){
                    game.playerSocketIds[i] = socket.id;
                    playerNumber = i;
                    playerName = 'player' + i.toString();
                    game.playerNames[i] = playerName;
                    break;
                }
            }
            let gameData = {
                "gameId" : gameId,
                "players" : game.playerNames,
                "name" : playerName            
            }

            socket.emit('join', gameData);
            socket.gameId = gameId;
            socket.playerNumber = playerNumber;

            let playersInGame = {
                "players" : game.playerNames,
            }
            io.to(gameId).emit('user joined', playersInGame);
            socket.join(gameId);
            game.numOfPlayers++;             
        }
        else{
            socket.emit('join game', -1);
        }
    });

    socket.on('start game', function(gameId){
        io.to(gameId).emit('start game');
        console.log("test");
    });

    socket.on('disconnecting', function(){
        if(socket.gameId != undefined){
            console.log(socket.gameId);  
            let game = games[socket.gameId];
            game.numOfPlayers--;
            if(game.numOfPlayers <= 0){
                console.log("delete game")
                delete games[socket.gameId];
            }
            else{
                
                game.playerSocketIds[socket.playerNumber] = null;
                game.playerNames[socket.playerNumber] = null;
                let playersInGame = {
                    "players" : game.playerNames,
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