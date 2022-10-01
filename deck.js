import Card from './card.js';

class Deck {
    constructor(){
        this.cards = [];
    }
    createDeck(){
        this.cards = [];
        let suits = ["club", "spade", "heart", "diamond"];
        let ranks = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"]; 
        let fileSuits = ["C", "S", "H", "D"];
        let fileRanks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];              
        let ranksLength = ranks.length;
        let suitsLength = suits.length;
        for(let i = 0; i < ranksLength; i++){
            for(let j = 0; j < suitsLength; j++){
                let fileName = fileRanks[i] + fileSuits[j];
                this.cards.push(new Card(ranks[i], suits[j], fileName));
            }
        }
    }
    shuffle(){
        let deckLength = this.cards.length;
        for(let i = deckLength -1; i > 0; i--){
            let j = Math.floor(Math.random() * (i+1))
            let temp = this.cards[j];
            this.cards[j] = this.cards[i];
            this.cards[i] = temp;
        }
    }
    drawCard(){
        if(this.cards.length === 0){
            return [];
        }
        return this.cards.shift();
    }
    drawNCards(n){
        let cards = [];
        for(let i = 0; i < n; i++){
            if(this.cards.length === 0){
                break;
            }
            cards.push(this.cards.shift());
        }
        return cards;
    }
    insertCard(card){
        if(card instanceof Card){
            let length = this.cards.length
            this.cards.splice(length/2, 0, card);
        }         
    }
    insertDiscardPile(discardPile){
        this.cards.push(...discardPile);
    }
    getLength(){
        return this.cards.length;
    }
}

export default Deck;
