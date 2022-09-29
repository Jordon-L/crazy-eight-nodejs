import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import Game from './game.js';
import { strict } from 'assert';
import { fileURLToPath } from 'url';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals
} from "unique-names-generator";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 5000;
const app = express();
import http from 'http';
const server = http.createServer(app);
const io = new Server(server);
let users = 0;
let userSockets = [];
let games = {};
let latestGameId = 0;

app.use(express.static(path.resolve(__dirname, './react/my-app/build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './react/my-app/build', 'index.html'));
});

app.get('*', function(req, res) {
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
    game.started = true;
    game.discardPile = [];
    game.currentlyInPlay = [];
    game.direction = 'counterClockwise';
    game.whosTurn = 'player1';
    game.whosTurnIndex = 0;
    game.twoStack = 0;
    deck.createDeck();
    deck.shuffle();

    
    //deal cards
    for(let i = 0; i < keys.length; i++){
        let playerName = keys[i];
        game.playerHandsLength[playerName] = 5;
        let playerHands = game.playerHands
        playerHands[playerName] = deck.drawNCards(5);
    }    

    let firstCard = deck.drawNCards(1)[0];
    while(firstCard.rank === 'eight'){
        deck.insertCard(firstCard);
        firstCard = deck.drawNCards(1)[0];
    }
    game.currentlyInPlay.push(firstCard);
    console.log(game.currentlyInPlay);
    game.changeSuit(firstCard.suit);
    //send out to client
    game.whosTurn = keys[0];
    game.whosTurnIndex = 0;

    for(let i = 0; i < keys.length; i++){
        console.log(keys[i]);
        let playerName = keys[i];
        let socketId = playerSocketIds[playerName];
        let gameData = {
            'playerHand' : game.playerHands[playerName],
            'otherHands': game.playerHandsLength,
            'inPlay': game.currentlyInPlay,
            'whosTurn' : game.whosTurn,
            'currentSuit': game.currentSuit,
        }
        io.to(socketId).emit('start game', gameData);
    }

}

function generateName(){
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const randomString = uniqueNamesGenerator({ dictionaries: [animals, numbers] });
  return randomString;
}

function getGameList(){
  let gamelist = [];
  let keys = Object.keys(games);
  for(let i = 0; i < keys.length; i++){
    let game = games[keys[i]];
    gamelist.push([keys[i], 'test name', 'test'])
  
  }
  return gamelist;
}

function leaveRoom(socket){
    if(games[socket.gameId] != undefined){
      let game = games[socket.gameId];
      game.numOfPlayers--;
      if(game.numOfPlayers <= 0){
          console.log("delete game")
          delete games[socket.gameId];
      }
      else{
          let playerName = socket.playerName;
          delete game.playerSocketIds[socket.playerName];
          delete game.players[socket.playerName];
          if(game.whosTurn === socket.playerName && game.started === true){
            game.nextTurn();
          }
          console.log(game.players);

          let playersInGame = {
              "players" : Object.values(game.players),
              'otherHands': game.playerHandsLength,
              'inPlay' : game.currentlyInPlay,
              'whosTurn' : game.whosTurn,
              'twoStack' : game.twoStack,
              'currentSuit': game.currentSuit,  
          }
          
          io.to(socket.gameId).emit('user change', playersInGame);
          }
  }
}

io.on('connection', function (socket) {

    console.log('a user connected');
    socket.on('create game', function(data) {
        if(socket.gameId != undefined){
          return;
        }
        let newGame = new Game();
        
        let playerName = socket.playerName;
        if(playerName == null){
          playerName = generateName();
          socket.playerName = playerName;
        }
        newGame.playerSocketIds[playerName] = socket.id;
        newGame.players[playerName] = createPlayer(playerName, 1);
        let gameId = "game" + latestGameId;
        newGame.gameId = gameId;    
        socket.join(gameId);

        let gameData = {
            'playerName': playerName,
            'gameId': gameId,
            "players" : Object.values(newGame.players),           
        }
        socket.emit('join', gameData);

        socket.gameId = gameId;
        newGame.numOfPlayers++;
        games[gameId] = newGame;
        
        latestGameId++;
    });

    socket.on('play as guest', function(){
        socket.playerName = generateName();
    });

    socket.on('game list', function() {
      socket.emit('game list', {gameList: getGameList()} );
    })

    socket.on('join game', function(gameId) {
        if(socket.gameId != undefined){
          return;
        }
        if(games[gameId] != null && games[gameId].numOfPlayers < 4){

            let game = games[gameId]
            if(game.started === true){
                socket.emit('join', -1);
                return;
                //gamefull
            }

            let playerName = socket.playerName;
            if(playerName == undefined){
              playerName = generateName();
              socket.playerName = playerName;
            }

            game.numOfPlayers++;
            let playerNumber = game.numOfPlayers;
            game.players[playerName] = createPlayer(playerName, playerNumber);
            game.playerSocketIds[playerName] = socket.id;
            let gameData = {
              'playerName': playerName,
              'gameId': gameId,
              "players" : Object.values(game.players),        
            }

            socket.emit('join', gameData);
            socket.gameId = gameId;

            let playersInGame = {
                "players" : Object.values(game.players),
            }
            io.to(gameId).emit('user change', playersInGame);
            socket.join(gameId);          
        }
        else{
            socket.emit('join', -1);
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
            io.to(gameId).emit('user change', playersInGame);
            console.log(game.ready);
            if(game.ready >= 4){
                console.log('start game');
                gameStart(game);
            }            
        }
        else{
            console.log('error game ready');
        }
        

    });

    socket.on('discard card', function(selectedIndices){
        let gameId = socket.gameId;
        let playerName = socket.playerName;
        let socketId = socket.id;
        let game = games[gameId];
        let inPlay = [];

        if(game != undefined){
            if(game.whosTurn != playerName){
              return;
            }
            let playerHand = game.playerHands[playerName];
            let selectedPlay = [];
            for(let i = 0; i < selectedIndices.length; i++){
                let index = selectedIndices[i];
                selectedPlay.push(playerHand[index]);
                
            }            
            if(game.isValidPlay(selectedPlay)){
                inPlay.push(...selectedPlay);
                selectedIndices = selectedIndices.sort();
                for(let i = 0; i < selectedIndices.length; i++){
                    let index = selectedIndices[i]-i;
                    playerHand.splice(index, 1);        
                }            
                game.playerHandsLength[playerName] = playerHand.length;
                if(game.playerHandsLength[playerName] === 0){
                    game.started = false;
                    game.ready = 0;
                    let keys = Object.keys(game.players);
                    for(let i = 0; i < keys.length; i++){
                        game.players[keys[i]].ready = false;
                    }

                    let gameData = {
                        "players" : Object.values(game.players), 
                        'winner' : playerName,        
                    }
                    io.to(gameId).emit('winner', gameData); 
                    return;
                }
                game.discardPile.push(...game.currentlyInPlay);
                game.currentlyInPlay = inPlay;

                if(selectedPlay[selectedPlay.length-1].rank !== 'eight'){
                    game.changeSuit(game.currentlyInPlay[game.currentlyInPlay.length-1].suit);
                    //next person's turn
                    game.nextTurn();

                    let gameData = {
                        'playerHand' : game.playerHands[playerName],
                        'otherHands': game.playerHandsLength,
                        'inPlay' : game.currentlyInPlay,
                        'whosTurn' : game.whosTurn,
                        'currentSuit': game.currentSuit 
                    }
                    
            
                    let turn = {
                        'otherHands': game.playerHandsLength,
                        'inPlay' : game.currentlyInPlay,
                        'whosTurn' : game.whosTurn,
                        'twoStack' : game.twoStack,
                        'currentSuit': game.currentSuit,           
                    }
                
                    io.to(socketId).emit('discard card', gameData);
                    socket.broadcast.to(gameId).emit('other play turn', turn); 
                }
                else{
                    game.nextTurn();
                    let gameData = {
                        'playerHand' : game.playerHands[playerName],
                        'otherHands': game.playerHandsLength,
                        'inPlay' : game.currentlyInPlay,
                    }
                    console.log('discard eight card')                    
                    io.to(socketId).emit('discard eight card', gameData);
                }                               
            }
            else{
                console.log('invalid play');
            }
        }

    });
    socket.on('discard eight card', function(selectedSuit){
        let gameId = socket.gameId;
        let playerName = socket.playerName;
        let socketId = socket.id;
        let game = games[gameId];
        let direction = game.direction; 

        if(game !== undefined){
            game.changeSuit(selectedSuit);
            let turn = {
                'otherHands': game.playerHandsLength,
                'inPlay' : game.currentlyInPlay,
                'whosTurn' : game.whosTurn,
                'twoStack' : game.twoStack,
                'currentSuit': game.currentSuit            
            }
            
            io.to(gameId).emit('other play turn', turn); 
        }
       
    });
    socket.on('disconnecting', function(){
      leaveRoom(socket);
    })


    socket.on('leave room', function(){
      leaveRoom(socket);
      socket.leave(socket.gameId);
      if(socket.gameId != undefined){
        io.to(socket.id).emit('leave room');
      }
      
      socket.gameId = undefined;
    });


    socket.on('draw card', function () {   
        let playerName = socket.playerName;
        let gameId = socket.gameId;
        let socketId = socket.id;
        let game = games[gameId];
        if(game !== undefined){
            let playerHand = game.playerHands[playerName];
            if(game.isValidHand(playerHand) && game.twoStack === 0){
                io.to(socketId).emit('display message', 'you have a valid play');
                return;
            }

            let deck = game.deck;
            let numberOfCards = 1;
            if(game.twoStack > 0){
              numberOfCards = game.twoStack * 2;
              game.twoStack = 0;
            }
            if(deck.getLength() < numberOfCards){
                if(game.discardPile.length === 0){
                    io.to(socketId).emit('display message', 'no more cards available');
                    return;
                }
                deck.insertDiscardPile(game.discardPile);
                game.discardPile = [];
                deck.shuffle();
            }
            
            let cards = deck.drawNCards(numberOfCards);
            
            playerHand.push(...cards);
            game.playerHandsLength[playerName] = playerHand.length;
            let gameData = {
                'playerHand' : playerHand,
                'twoStack' : 0,
            }
            io.to(socketId).emit('draw card', gameData);
    
            let turn = {
                'otherHands': game.playerHandsLength,
                'inPlay' : game.currentlyInPlay,
                'whosTurn': game.whosTurn,
                'twoStack' : 0,            
            }
            socket.broadcast.to(gameId).emit('other play turn', turn);
        }
    });

});


io.on('close' , function (socket) {
  console.log("user closed");
})

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});