class Card {
    constructor(rank, suit){
        this.suit = suit;
        this.rank = rank;
        this.fileName = rank+suit;
    }
}

export default Card;
