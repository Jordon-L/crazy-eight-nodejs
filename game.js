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
    //is this a valid play
    isValidPlay(cards){

    }
    //is there a valid play in hand
    isValidHand(cards){

    }
}

module.exports = Game;