import Deck from './deck.js';

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
        this.currentSuit = '';
        this.playerHandsLength = {};
        this.whosTurn = undefined;
        this.whosTurnIndex = 0;
        this.direction = 'counterClockwise';
        this.twoStack = 0;
        this.started = false;

    }
    specialCard(card){
        let rank = card.rank;
        if(rank  === 'queen'){
            console.log('queen');
            this.nextTurn();
        }
        else if(rank  === 'ace'){
            console.log('ace');
            if(this.direction === 'clockwise'){
                console.log('ace ccw');
                this.direction = 'counterClockwise';
            }
            else{
                console.log('ace cw');
                this.direction = 'clockwise';
            }
        }
        else if(rank === 'two'){
            console.log('two');
            this.twoStack++;
        }
    }
    //is this a valid play
    isValidPlay(cards){
        if(this.twoStack > 0){
            return this.isTwoStack(cards);
        }
        let currentCardIndex = this.currentlyInPlay.length -1;
        let currentCard = this.currentlyInPlay[currentCardIndex];
        if(cards.length > 1){
            let firstCard = cards[0];
            if(firstCard.rank === currentCard.rank || firstCard.suit === this.currentSuit || firstCard.rank === 'eight'){
                for(let i = 0; i < cards.length; i++){
                    let card = cards[i];
                    if(firstCard.rank !== card.rank){
                        return false;
                    }
                }
                for(let i = 0; i < cards.length; i++){
                    let card = cards[i];
                    this.specialCard(card);   
                }
                
                return true;
            }
            return false;
        }
        else if(cards.length === 1){
            let card = cards[0];
            if(currentCard.rank === card.rank){
                //special cards
                this.specialCard(card);
                return true;
            }
            else if(card.suit === this.currentSuit){
                this.specialCard(card);
                return true;
            }
            else if(card.rank === 'eight'){
                return true;
            }
            
        }

        return false;
    }
    //is there a valid play in hand
    isValidHand(cards){
        let currentCardIndex = this.currentlyInPlay.length -1;
        let currentCard = this.currentlyInPlay[currentCardIndex];
        for(let i = 0; i < cards.length; i++){
            let card = cards[i];
            if(card.rank === currentCard.rank || card.suit === this.currentSuit || card.rank === 'eight'){
                return true;
            }
        }
        return false;
    }

    isTwoStack(cards){
        let currentCardIndex = this.currentlyInPlay.length -1;
        let currentCard = this.currentlyInPlay[currentCardIndex];
        let temp = this.twoStack;
        console.log('asd');
        for(let i = 0; i < cards.length; i++){
            let card = cards[i]
            if(card.rank !== 'two' || currentCard.rank !== 'two'){
                return false;
            }
            else if(card.rank === 'two'){
                temp++;
            }
            
        }
        this.twoStack = temp;
        return true;
    }
    changeSuit(suit){
        this.currentSuit = suit;
    }
    nextTurn(){
        let index = this.whosTurnIndex;
        let keys = Object.keys(this.playerSocketIds);
        let maxIndex = keys.length - 1;
        console.log(this.direction);
        if(this.direction === 'clockwise'){
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
        console.log(keys[index]);
        this.whosTurnIndex = index;

        this.whosTurn = keys[index];
    }

    whoPrevTurn(){
        let index = this.whosTurnIndex;
        let keys = Object.keys(this.playerSocketIds);
        let maxIndex = keys.length - 1;
        console.log(this.direction);
        if(this.direction === 'counterClockwise'){
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
        return keys[index]
    }
}

export default Game;
