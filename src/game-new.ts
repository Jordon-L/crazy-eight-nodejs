import Player from "./player-new.js";
import Card from "./card.js";
import Deck from "./deck-new.js";
import { Direction, GameStateWrapper, SocketInfo } from "./types.js";

class Game {
  id: number;
  playerList: Map<string, Player>;
  playerOrder: Player[];
  playerHand: Map<string, Card[]>;
  playerHandsLength: Map<string, number>;
  discardPile: Card[];
  currentTurn: string;
  turnDirection: Direction;
  numOfPlayers: number;
  numReady: number;
  currentCard: Card[] | undefined;
  deck: Deck;
  twoStack: number;
  started: boolean;
  currentSuit: string;

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
    this.turnDirection = Direction.Clockwise;
    this.numOfPlayers = 1;
    this.deck = new Deck();
    this.currentCard = undefined;
    this.twoStack = 0;
    this.started = false;
    this.currentSuit = "S";
    this.numReady = 0;
    
  }
  gameStart(socketInfo: SocketInfo): boolean{
    if(socketInfo.id !== Array.from(this.playerList.values())[0].id || this.numReady != this.numOfPlayers){
      return false;
    }
    let players = this.getPlayerNameList();
    this.currentCard = this.deck.drawNCards(1);
    this.currentSuit = this.currentCard[0].suit;
    this.numReady = 0;

    for(let player of players){
      this.currentTurn = this.getRoomMaster();
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
  getEndTurnData(socketInfo: SocketInfo | Player): GameStateWrapper {
    const otherHands = new Map(
      [...this.playerHandsLength]
      .filter(([k]) => k != socketInfo.name )
    );

    return {
      playerId: socketInfo.id,
      gameId: this.getID(),
      otherHands: Object.fromEntries(otherHands),
      inPlay: this.currentCard,
      whosTurn: this.currentTurn,
      twoStack: this.twoStack,
      currentSuit: this.currentSuit,
    };
  }
  getGameData(socketInfo: SocketInfo | Player): GameStateWrapper {
    const otherHands = new Map(
      [...this.playerHandsLength]
      .filter(([k]) => k != socketInfo.name )
    );
    return {
      playerId: socketInfo.id,
      gameId: this.getID(),
      playerHand: this.playerHand.get(socketInfo.name) as Card[],
      otherHands: Object.fromEntries(otherHands),
      inPlay: this.currentCard,
      whosTurn: this.currentTurn,
      currentSuit: this.currentSuit,
    };
  }
  getRoomMaster(): string {
    let master = Array.from(this.playerList.values())[0];
    if (master != undefined) {
      return master.name;
    }
    return "";
  }
  addPlayer(socketInfo: SocketInfo) {
    let player = new Player(socketInfo.name, socketInfo.id);
    this.playerList.set(player.id, player);
    this.playerOrder.push(player);
    this.numOfPlayers++;
  }

  removePlayer(socketInfo: SocketInfo) {
    this.playerList.delete(socketInfo.id);
    this.playerOrder.filter((player) => socketInfo.id === player.id);
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

  discardCards(socketInfo: SocketInfo, cardstoDiscard: Card[]) {
    let player = this.playerList.get(socketInfo.id) as Player | undefined;
    if (player == undefined) {
      return;
    }
    
    let hand = this.playerHand.get(player.name);
    
    if(hand != undefined){
      let stringifyCards = cardstoDiscard.map((card) => JSON.stringify(card));
      let newHand = hand?.filter((card) => !stringifyCards.includes(JSON.stringify(card)));
      this.playerHand.set(player.name, newHand);
      this.discardPile = [...this.discardPile, ...cardstoDiscard];
      this.currentCard = cardstoDiscard;
      this.playerHandsLength.set(player.name, newHand.length);
      this.currentTurn = this.nextPlayer(player);
    }
  }

  nextPlayer(player: Player){
    let index = this.playerOrder.indexOf(player) + 1;
    let length = this.playerOrder.length;
    return this.playerOrder[(index % length + length) % length].name;
  }
  drawCards(socketInfo: SocketInfo, num: number) {
    let player = this.playerList.get(socketInfo.id) as Player | undefined;
    if (player == undefined) {
      return;
    }
    let hand = this.playerHand.get(player.name);
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
    if (!player.ready) {
      this.numReady++;
    } else {
      this.numReady--;
    }
    player.toggleReady()
  }
}

export default Game;
