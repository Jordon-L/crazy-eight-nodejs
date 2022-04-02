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
        this.whosTurn = 'player1';
        this.whosTurnIndex = 0;
        this.direction = 'cw';
    }
    //is this a valid play
    isValidPlay(cards){
        let currentCardIndex = this.currentlyInPlay.length -1;
        let currentCard = this.currentlyInPlay[currentCardIndex];
        if(cards.length > 1){
            for(let i = 0; i < cards.length; i++){
                let card = cards[i];
                if(card.rank === currentCard.rank){
                    return true;
                }
                else{
                    return false;
                }
            }
        }
        else if(cards.length === 1){
            let card = cards[0];
            console.log(currentCard, card)
            if(currentCard.rank === card.rank){
                return true;
            }
            else if(currentCard.suit === card.suit){
                return true;
            }
            else if(card.rank === 'eight'){
                return true;
            }
        }
    }
    //is there a valid play in hand
    isValidHand(cards){

    }

    nextTurn(){
        let index = this.whosTurnIndex;
        let keys = Object.keys(this.playerSocketIds);
        let maxIndex = keys.length - 1;
        if(this.direction === 'ccw'){
            index--;
            if(index < 0){
                index = maxIndex;
            }
        }
        else{
            index++;
            if(index > maxIndex){
                index = 0;
            }
        }
        console.log(index);
        console.log(keys[index]);
        this.whosTurnIndex = index;

        this.whosTurn = keys[index];
    }
}

module.exports = Game;