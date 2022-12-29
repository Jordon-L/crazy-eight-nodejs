import Player from "./player-new.js";
import Card from "./card.js";
import Deck from "./deck-new.js";
import { Direction, SocketInfo } from "./types";



class Game {
  id: number;
  playerList: Map<string, Player>;
  playerHand: Map<string, Card[]>;
  currentTurn: string;
  turnDirection: Direction;
  numOfPlayers: number;
  numReady: number;
  currentCard: Card;
  deck: Deck;
  twoStack: number;
  started: boolean;
  currentSuit: string;

  constructor(id: number, socketInfo: SocketInfo) {
    let player = new Player(socketInfo.name, socketInfo.id);
    this.id = id;
    this.playerList = new Map<string, Player>();
    this.playerHand = new Map<string, Card[]>();
    this.playerList.set(socketInfo.id, player);
    this.currentTurn = player.getName();
    this.turnDirection = Direction.Clockwise;
    this.numOfPlayers = 1;
    this.deck = new Deck();
    this.currentCard = this.deck.drawNCards(1)[0];
    this.twoStack = 0;
    this.started = false;
    this.currentSuit = "S";
    this.numReady = 0;
  }

  getRoomMaster() {
    return Object.values(this.playerList)[0];
  }
  addPlayer(socketInfo: SocketInfo) {
    let player = new Player(socketInfo.name, socketInfo.id);
    this.playerList.set(player.id, player);
    this.numOfPlayers++;
  }

  removePlayer(socketInfo: SocketInfo) {
    this.playerList.delete(socketInfo.id);
    this.numOfPlayers--;
  }

  getNumOfPlayers() {
    return this.numOfPlayers;
  }

  getID() {
    return this.id;
  }

  discardCards(socketInfo: SocketInfo, cardstoDiscard: Card[]) {
    let player = this.playerList.get(socketInfo.id) as Player | undefined;
    if (player == undefined) {
      return;
    }
    let hand = this.playerHand.get(player.id);
    hand?.filter((card) => !cardstoDiscard.includes(card));
    //this.playerHand.set(player.id, hand);
  }

  drawCards(socketInfo: SocketInfo, num: number) {
    let player = this.playerList.get(socketInfo.id) as Player | undefined;
    if (player == undefined) {
      return;
    }
    let hand = this.playerHand.get(player.id);
    hand?.push(...this.deck.drawNCards(num));
  }
  changeSuit(suit: string) {
    this.currentSuit = suit;
  }
  ready(socketInfo: SocketInfo) {
    let player = this.playerList.get(socketInfo.id) as Player | undefined;
    if (player == undefined) {
      return;
    }
    if (!this.started) {
      this.numReady++;
    } else {
      this.numReady--;
    }
    player.ready = !player.ready;
  }
}

export default Game;
