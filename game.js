const Deck = require('./deck')

class Game {
    constructor(){
        this.gameId = null;
        this.deck = new Deck();
        this.deck.shuffle();
        this.numOfPlayers = 0;
        this.ready = 0;
        this.playerSocketIds = {};
        this.players = {};
        this.playerHands = {};
        this.discardPile = [];
        this.currentlyInPlay = [];
        this.playerHandsLength = {};
    }


}

module.exports = Game;