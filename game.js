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
      this.players[playerName].ready = ready;
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

  drawCards(n){
    if(this.deck.getLength() < n){
      let cardsLeftToDraw = n - this.deck.getLength();
      let cards = this.deck.drawNCards(this.deck.getLength());
      this.gameId.shuffleDiscardIntoDeck();
      cards.push(...this.deck.drawNCards(cardsLeftToDraw));
      return cards;
    }
    return this.deck.drawNCards(n);
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

  getGameData(playerName) {
    return {
      playerHand: this.playerHands[playerName],
      otherHands: this.playerHandsLength,
      inPlay: this.currentlyInPlay,
      whosTurn: this.whosTurn,
      currentSuit: this.currentSuit,
    };
  }

  joinLobby(playerName) {
    return {
      playerName: playerName,
      gameId: this.gameId,
      players: Object.values(this.players),
    };
  }
  //
  //Game logic
  //
  specialCard(card) {
    let rank = card.rank;
    if (rank === "Q") {
      this.nextTurn();
    } else if (rank === "A") {
      if (this.direction === "clockwise") {
        this.direction = "counterClockwise";
      } else {
        this.direction = "clockwise";
      }
    } else if (rank === "2") {
      this.twoStack++;
    }
  }
  checkCards(cards, currentCard) {
    let rank = cards[0].rank;
    let count = 0;
    let valid = false;
    for (let card of cards) {
      if (card.rank !== rank && card.rank !== "8") {
        return false;
      }
      if (card.suit === currentCard.suit) {
        valid = true;
      }
      count++;
    }
    if (rank === "8" || rank === currentCard.rank) {
      valid = true;
    }
    return count === cards.length && valid;
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
        card.rank === "8"
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
      if (card.rank !== "2" || currentCard.rank !== "2") {
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
