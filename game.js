import Deck from "./deck.js";

class Game {
  constructor() {
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
    this.currentSuit = "";
    this.playerHandsLength = {};
    this.whosTurn = undefined;
    this.whosTurnIndex = 0;
    this.direction = "counterClockwise";
    this.twoStack = 0;
    this.started = false;
  }
  //
  //Game manager
  //
  addPlayer(player) {
    this.players[player.name] = player;
    this.numOfPlayers++;
  }
  getPlayers() {
    return Object.values(this.players);
  }

  removePlayer(player) {
    if (player.name in this.players) {
      delete this.players[player.name];
      this.numOfPlayers--;
    }
  }

  toggleReady(playerName) {
    if (playerName in this.players) {
      let ready = !this.players[playerName].ready;
      if (ready) {
        this.ready++;
      } else {
        this.ready--;
      }
    }
  }

  addDisacrdPile(cards) {
    this.discardPile.push(...cards);
  }

  shuffleDiscardIntoDeck() {
    this.deck.insertDiscardPile(this.discardPile);
    this.deck.shuffle();
    this.discardPile = [];
  }

  startCondition() {
    return this.ready >= 4;
  }

  getEndTurnData() {
    return {
      otherHands: this.playerHandsLength,
      inPlay: this.currentlyInPlay,
      whosTurn: this.whosTurn,
      twoStack: this.twoStack,
      currentSuit: this.currentSuit,
    };
  }

  getGameData() {}
  //
  //Game logic
  //
  specialCard(card) {
    let rank = card.rank;
    if (rank === "queen") {
      this.nextTurn();
    } else if (rank === "ace") {
      if (this.direction === "clockwise") {
        this.direction = "counterClockwise";
      } else {
        this.direction = "clockwise";
      }
    } else if (rank === "two") {
      this.twoStack++;
    }
  }
  checkCards(cards, currentCard) {
    let rank = cards[0].rank;
    let count = 0;
    let isSuit = false;
    for (let card of cards) {
      if (card.rank !== rank && card.rank !== "eight") {
        return false;
      }
      if (card.suit === currentCard.suit) {
        isSuit = true;
      }
      count++;
    }
    if (rank === "eight") {
      isSuit = true;
    }
    return count === cards.length && isSuit;
  }
  //is this a valid play
  isValidPlay(cards) {
    if (this.twoStack > 0) {
      return this.isTwoStack(cards);
    }
    let currentCardIndex = this.currentlyInPlay.length - 1;
    let currentCard = this.currentlyInPlay[currentCardIndex];
    if (this.checkCards(cards, currentCard)) {
      return true;
    }
    return false;
  }

  //is there a valid play in hand
  isValidHand(cards) {
    let currentCardIndex = this.currentlyInPlay.length - 1;
    let currentCard = this.currentlyInPlay[currentCardIndex];
    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      if (
        card.rank === currentCard.rank ||
        card.suit === this.currentSuit ||
        card.rank === "eight"
      ) {
        return true;
      }
    }
    return false;
  }

  isTwoStack(cards) {
    let currentCardIndex = this.currentlyInPlay.length - 1;
    let currentCard = this.currentlyInPlay[currentCardIndex];
    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      if (card.rank !== "two" || currentCard.rank !== "two") {
        return false;
      }
    }
    return true;
  }
  changeSuit(suit) {
    this.currentSuit = suit;
  }
  nextTurn() {
    let index = this.whosTurnIndex;
    let keys = Object.keys(this.playerSocketIds);
    let maxIndex = keys.length - 1;
    console.log(this.direction);
    if (this.direction === "clockwise") {
      index--;
      if (index < 0) {
        index = maxIndex;
      }
    } else {
      index++;
      if (index > maxIndex) {
        index = 0;
      }
    }
    this.whosTurnIndex = index;

    this.whosTurn = keys[index];
  }

  whoPrevTurn() {
    let index = this.whosTurnIndex;
    let keys = Object.keys(this.playerSocketIds);
    let maxIndex = keys.length - 1;
    console.log(this.direction);
    if (this.direction === "counterClockwise") {
      index--;
      if (index < 0) {
        index = maxIndex;
      }
    } else {
      index++;
      if (index > maxIndex) {
        index = 0;
      }
    }
    return keys[index];
  }

  discardCards(cards) {
    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      this.specialCard(card);
    }
    this.discardPile.push(...cards);
    this.currentlyInPlay = [...cards];
    this.nextTurn();
  }
}

export default Game;
