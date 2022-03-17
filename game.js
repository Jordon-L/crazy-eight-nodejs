const Deck = require('./deck')

class Game {
    constructor(){
        this.deck = new Deck();
        this.deck.shuffle();
        this.numOfPlayers = 0;
        this.playerSocketIds = [null,null,null,null];
        this.playerNames = [null,null,null,null];
        this.p0Hand = [];
        this.p1Hand = [];
        this.p2Hand = [];
        this.p3Hand = [];
        this.discardPile = [];

    }

}

module.exports = Game;