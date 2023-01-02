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
  gameId?: number;
  playerName?: string,
  players?: Player[],
  playerHand?: Card[];
  otherHands?: Map<string, number>;
  whosTurn?: string;
  turnDirection?: Direction;
  numOfPlayers?: number;
  numReady?: number;
  inPlay?: Card;
  deck?: Deck; 
  twoStack?: number;
  started?: boolean;
  currentSuit?: string;
  master?: string;
}

export interface ErrorMessage {
  message: string;
}

export interface GameList {
  gameList: {
    id : string,
    master: string,
    capacity: number,
  }[];
}

