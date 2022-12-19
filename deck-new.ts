import Card from "./card.js";

class Deck {
  cards: Card[];
  constructor() {
    this.cards = this.createDeck();
    this.shuffle();
  }
  createDeck(): Card[] {
    let cards = [] as Card[];
    let suits = ["C", "S", "H", "D"];
    let ranks = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "T",
      "J",
      "Q",
      "K",
    ];
    let ranksLength = ranks.length;
    let suitsLength = suits.length;
    for (let i = 0; i < ranksLength; i++) {
      for (let j = 0; j < suitsLength; j++) {
        cards.push(new Card(ranks[i], suits[j]));
      }
    }
    return cards;
  }
  shuffle(): void {
    let deckLength = this.cards.length;
    for (let i = deckLength - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.cards[j];
      this.cards[j] = this.cards[i];
      this.cards[i] = temp;
    }
  }
  drawNCards(n: number): Card[] {
    let cards = [] as Card[];
    for (let i = 0; i < n; i++) {
      if (this.cards.length === 0) {
        break;
      }
      let card = this.cards.shift();
      if (card != undefined) {
        cards.push(card);
      }
    }
    return cards;
  }
  insertCard(card: Card): void {
    if (card instanceof Card) {
      let length = this.cards.length;
      this.cards.splice(length / 2, 0, card);
    }
  }
  insertDiscardPile(discardPile: Card[]): void {
    this.cards.push(...discardPile);
  }
  getLength(): number {
    return this.cards.length;
  }
}

export default Deck;
