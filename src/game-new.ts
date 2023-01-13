import Player from "./player-new.js";
import Card from "./card.js";
import Deck from "./deck-new.js";
import { displayMessage, displaySpecialMessage } from "./index-new.js";
import { Direction, GameStateWrapper, SocketInfo } from "./types.js";
import { createMessage } from "./utils.js";

class Game {
  id: number;
  playerList: Map<string, Player>;
  playerOrder: Player[];
  playerHand: Map<string, Card[]>;
  playerHandsLength: Map<string, number>;
  discardPile: Card[];
  currentTurn: string;
  currentPlayer: Player;
  turnDirection: Direction;
  numOfPlayers: number;
  numReady: number;
  currentCard: Card[] | undefined;
  deck: Deck;
  twoStack: number;
  started: boolean;
  currentSuit: string;
  currentRank: string;
  specialCardMessage: string;
  allSuits : {[key:string]: string;};

  constructor(id: number, socketInfo: SocketInfo) {
    let player = new Player(socketInfo.name, socketInfo.id);
    this.id = id;
    this.playerList = new Map<string, Player>();
    this.playerHand = new Map<string, Card[]>();
    this.playerHandsLength = new Map<string, number>();
    this.discardPile = [];
    this.playerList.set(socketInfo.id, player);
    this.playerOrder = [player];
    this.currentTurn = this.playerOrder[0].name;
    this.currentPlayer = this.playerOrder[0];
    this.turnDirection = Direction.Clockwise;
    this.numOfPlayers = 1;
    this.deck = new Deck();
    this.currentCard = undefined;
    this.twoStack = 0;
    this.started = false;
    this.currentSuit = "S";
    this.allSuits = {H: "Heart", D: "Diamond", S: "Spade", C: "Club"}
    this.currentRank = "A";
    this.numReady = 0;
    this.specialCardMessage = "";
  }
  gameStart(socketInfo: SocketInfo): boolean {
    if (
      socketInfo.id !== Array.from(this.playerList.values())[0].id ||
      this.numReady != this.numOfPlayers
    ) {
      return false;
    }
    let players = this.getPlayerNameList();
    this.currentCard = this.deck.drawNCards(1);
    this.currentSuit = this.currentCard[0].suit;
    this.currentRank = this.currentCard[0].rank;
    this.numReady = 0;

    for (let player of players) {
      this.currentPlayer = this.getRoomMaster()!;
      this.currentTurn = this.currentPlayer.name;
      this.discardPile = [];
      this.turnDirection = Direction.Clockwise;
      this.twoStack = 0;
      this.playerHand.set(player.name, this.deck.drawNCards(5));
      this.playerHandsLength.set(player.name, 5);
      this.started = true;
      player.ready = false;
    }
    return true;
  }
  getTurnData(): GameStateWrapper {
    return {
      gameId: this.getID(),
      otherHands: Object.fromEntries(this.playerHandsLength),
      inPlay: this.currentCard,
      whosTurn: this.currentTurn,
      twoStack: this.twoStack,
      currentSuit: this.currentSuit,
      currentRank: this.currentRank,
    };
  }
  getGameData(socketInfo: SocketInfo | Player): GameStateWrapper {
    return {
      playerId: socketInfo.id,
      gameId: this.getID(),
      playerHand: this.playerHand.get(socketInfo.name) as Card[],
      otherHands: Object.fromEntries(this.playerHandsLength),
      inPlay: this.currentCard,
      whosTurn: this.currentTurn,
      currentSuit: this.currentSuit,
      currentRank: this.currentRank,
      specialMessage: this.specialCardMessage,
    };
  }
  getHandData(): GameStateWrapper {
    return {
      gameId: this.getID(),
      otherHands: Object.fromEntries(this.playerHandsLength),
      twoStack: this.twoStack,
    };
  }
  getRoomMaster(): Player | undefined {
    let master = Array.from(this.playerList.values())[0];
    if (master != undefined) {
      return master;
    }
    return undefined;
  }
  addPlayer(socketInfo: SocketInfo) {
    let player = new Player(socketInfo.name, socketInfo.id);
    this.playerList.set(player.id, player);
    this.playerOrder.push(player);
    this.numOfPlayers++;
  }

  removePlayer(socketInfo: SocketInfo) {
    let player = this.playerList.get(socketInfo.id) as Player | undefined;
    if (player == undefined) {
      return;
    }
    if (this.currentTurn === player.name) {
      this.currentPlayer = this.nextPlayer();
      this.currentTurn = this.currentPlayer.name;
    }
    this.playerList.delete(socketInfo.id);
    this.playerHandsLength.delete(socketInfo.name);
    this.playerOrder = this.playerOrder.filter(
      (player) => player.id !== socketInfo.id
    );
    this.numOfPlayers--;
  }

  getPlayerNameList(): Player[] {
    let list = Array.from(this.playerList.values());
    return list;
  }

  getNumOfPlayers() {
    return this.numOfPlayers;
  }

  getID() {
    return this.id;
  }

  discardCards(socketInfo: SocketInfo, cardstoDiscard: Card[]): boolean {
    let player = this.playerList.get(socketInfo.id) as Player | undefined;
    if (player == undefined) {
      return false;
    }

    let hand = this.playerHand.get(player.name);
    if (hand != undefined && this.isValidPlay(cardstoDiscard)) {
      for (let i = 0; i < cardstoDiscard.length; i++) {
        let card = cardstoDiscard[i];
        this.specialCard(card);
      }
      let stringifyCards = cardstoDiscard.map((card) => JSON.stringify(card));
      let newHand = hand?.filter(
        (card) => !stringifyCards.includes(JSON.stringify(card))
      );
      let validCard = cardstoDiscard.find(
        (card) => card.suit === this.currentSuit
      );
      if (validCard != undefined) {
        let otherCards = cardstoDiscard.filter(
          (card) => card.suit != validCard!.suit
        );
        cardstoDiscard = [validCard, ...otherCards];
      }
      this.playerHand.set(player.name, newHand);
      if(this.currentCard != undefined){
        this.discardPile = [...this.discardPile, ...this.currentCard];
      }
      this.currentCard = cardstoDiscard;
      let length = cardstoDiscard.length;
      this.currentSuit = cardstoDiscard[length - 1].suit;
      this.currentRank = cardstoDiscard[length - 1].rank;
      this.playerHandsLength.set(player.name, newHand.length);
      this.currentPlayer = this.nextPlayer();
      this.currentTurn = this.currentPlayer.name;
      return true;
    }
    return false;
  }

  nextPlayer() {
    let index = this.playerOrder.indexOf(this.currentPlayer);
    if (this.turnDirection === Direction.Clockwise) {
      index++;
    } else {
      index--;
    }
    let length = this.playerOrder.length;
    return this.playerOrder[((index % length) + length) % length];
  }

  drawCards(socketInfo: SocketInfo) {
    let player = this.playerList.get(socketInfo.id) as Player | undefined;
    if (player == undefined) {
      return;
    }
    let hand = this.playerHand.get(player.name);
    if (hand != undefined) {
      if (this.twoStack == 0) {
        let validHand = this.hasValidHand(hand);
        if(validHand != undefined){
          displayMessage(player.id, createMessage(`you have a valid play ${validHand.rank} of ${this.allSuits[validHand.suit]}`))
          return;
        }
        hand.push(...this.deck.drawNCards(1));
      } else {
        hand.push(...this.deck.drawNCards(this.twoStack * 2));
        this.twoStack = 0;
      }
      this.playerHandsLength.set(player.name, hand.length);
    }
  }

  changeSuit(suit: string) {
    this.currentSuit = suit;
  }

  ready(socketInfo: SocketInfo) {
    let player = this.playerList.get(socketInfo.id) as Player | undefined;
    if (player == undefined) {
      return;
    }
    if (!player.ready) {
      this.numReady++;
    } else {
      this.numReady--;
    }
    player.toggleReady();
  }

  isValidPlay(cards: Card[]): boolean {
    if (this.twoStack > 0) {
      return this.isTwoStack(cards);
    }
    if (this.checkCards(cards)) {
      return true;
    }
    return false;
  }

  isTwoStack(cards: Card[]) {
    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      if (card.rank !== "2" || this.currentRank !== "2") {
        return false;
      }
    }
    return true;
  }

  checkCards(cards: Card[]) {
    let rank = cards[0].rank;
    let count = 0;
    let eightCount = 0;
    let valid = false;
    for (let card of cards) {
      if (card.rank == "8") {
        eightCount++;
      }
      if (card.rank !== rank && card.rank !== "8") {
        return false;
      }
      if (card.suit === this.currentSuit) {
        valid = true;
      }
      count++;
    }
    if (eightCount > 1 || (eightCount != 0 && count > 1)) {
      return false;
    }
    if (rank === "8" || rank === this.currentRank) {
      valid = true;
    }
    return count === cards.length && valid;
  }

  specialCard(card: Card) {
    let rank = card.rank;
    let nextPlayer = this.nextPlayer();
    if (rank === "Q") {
      this.currentPlayer = nextPlayer;
      this.currentTurn = nextPlayer.name;
      displaySpecialMessage(nextPlayer.getID(), createMessage("Turn Skipped"));
    } else if (rank === "A") {
      if (this.turnDirection === Direction.Clockwise) {
        this.turnDirection = Direction.CounterClockwise;
      } else {
        this.turnDirection = Direction.Clockwise;
      }
      let players = this.getPlayerNameList();
      for (let player of players) {
        displaySpecialMessage(
          player.getID(),
          createMessage(`Reverse Direction`)
        );
      }
    } else if (rank === "2") {
      this.twoStack++;
      displaySpecialMessage(
        nextPlayer.getID(),
        createMessage(`Draw ${this.twoStack * 2} or play a 2`)
      );
    }
  }

  hasValidHand(cards: Card[]) {
    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      if (
        card.rank === this.currentRank ||
        card.suit === this.currentSuit ||
        card.rank === "8"
      ) {
        return card;
      }
    }
    return undefined;
  }
}

export default Game;
