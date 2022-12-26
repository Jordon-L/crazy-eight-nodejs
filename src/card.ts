class Card {
  rank: string;
  suit: string;
  fileName: string;
  constructor(rank: string, suit: string) {
    this.suit = suit;
    this.rank = rank;
    this.fileName = rank + suit;
  }
}

export default Card;
