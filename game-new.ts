import Player from "./player-new";
import Card from "./card";
import Deck from "./deck-new";

enum Direction {
  Clockwise,
  CounterClockwise,
}

class Game {
  id: number;
  playerList: Player[];
  currentTurn: string;
  turnDirection: Direction;
  numOfPlayers: number;
  currentCard: Card;
  deck: Deck;
  twoStack: number;

  constructor(id: number, player: Player) {
    this.id = id;
    this.playerList.push(player);
    this.currentTurn = player.getName();
    this.turnDirection = Direction.Clockwise;
    this.numOfPlayers = 1;
    this.deck = new Deck();
    this.currentCard = this.deck.drawNCards(1)[0];
    this.twoStack = 0;
  }

  addPlayer(player: Player) {
    this.playerList.push(player);
    this.numOfPlayers++;
  }

  removePlayer(targetPlayer: Player) {
    this.playerList.filter((player) => {
      return player.id !== targetPlayer.id;
    });
  }

  getID(){
    return this.id;
  }

}

export default Game;
