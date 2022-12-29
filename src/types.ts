import Card from "./card";
import Deck from "./deck-new";
import Player from "./player-new";

export enum Direction {
  Clockwise,
  CounterClockwise,
}

export interface SocketInfo {
  id: string;
  name: string;
}

export interface GameStateWrapper {
  id?: number;
  playerList?: Map<string, Player>;
  playerHand?: Map<string, Card[]>;
  currentTurn?: string;
  turnDirection?: Direction;
  numOfPlayers?: number;
  numReady?: number;
  currentCard?: Card;
  deck?: Deck; 
  twoStack?: number;
  started?: boolean;
  currentSuit?: string;
}


