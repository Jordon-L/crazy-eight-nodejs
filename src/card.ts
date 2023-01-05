class Card {
  rank: string;
  suit: string;
  fileName: string;
  constructor(options = {suit:'', rank:''}) {
    this.suit = options.suit;
    this.rank = options.rank;
    this.fileName = options.rank + options.suit;
  }
}

export default Card;
