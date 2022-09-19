import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import Game from './game.js';
import { strict } from 'assert';
import { fileURLToPath } from 'url';

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

function generateName(){}

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

    socket.on('play as guest', function(){
      socket.playerName = generate();

    });

    socket.on('join game', function(gameId) {
        if(games[gameId] != null && games[gameId].numOfPlayers < 4){

            let game = games[gameId]
            if(game.started === true){
                return;
                //gamefull
            }
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

    socket.on('discard card', function(selectedIndices){
        let gameId = socket.gameId;
        let playerName = socket.playerName;
        let socketId = socket.id;
        let game = games[gameId];
        let inPlay = [];

        if(game != undefined){
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
    socket.on('draw card', function (numberOfCards) {   
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
            if(deck.getLength() < numberOfCards){
                if(game.discardPile.length === 0){
                    io.to(socketId).emit('display message', 'no more cards available');
                    return;
                }
                deck.insertDiscardPile(game.discardPile);
                game.discardPile = [];
                deck.shuffle();
            }
            if(numberOfCards !== '1'){
                game.twoStack = 0;
            }
            let cards = deck.drawNCards(numberOfCards);
            
            playerHand.push(...cards);
            game.playerHandsLength[playerName] = playerHand.length;
            let gameData = {
                'newCards' : cards
            }
            io.to(socketId).emit('draw card', gameData);
    
            let turn = {
                'otherHands': game.playerHandsLength,
                'inPlay' : game.currentlyInPlay,
                'whosTurn': game.whosTurn,            
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