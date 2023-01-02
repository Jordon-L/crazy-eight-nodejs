import Game from "./game-new.js";
import Player from "./player-new.js";
import { SocketInfo } from "./types";

class RoomController {
  gameList: Map<string, Game>;
  playerList: Map<string, string>;
  idCounter: number;
  constructor() {
    this.idCounter = 0;
    this.gameList = new Map<string, Game>();
    this.playerList = new Map<string, string>();
  }

  getGameList() {
    return Array.from(this.gameList.values());
  }
  getIdCounter() {
    this.idCounter++;
    return this.idCounter;
  }
  createGame(socketInfo: SocketInfo) : Game {
    let game = new Game(this.getIdCounter(), socketInfo);
    let gameId = game.getID().toString();
    this.gameList.set(gameId, game);
    this.playerList.set(socketInfo.id, gameId);
    return game;
  }
  joinGame(socketInfo: SocketInfo, gameId: string) {
    let targetGame = this.gameList.get(gameId);
    let player = new Player(socketInfo.name, socketInfo.id);
    if (targetGame != undefined) {
      targetGame?.addPlayer(player);
      this.gameList.set(gameId, targetGame);
      this.playerList.set(socketInfo.id, gameId);
    }
    return targetGame;
  }
  leaveGame(socketInfo: SocketInfo) {
    let roomID = this.playerList.get(socketInfo.id);
    if (roomID != undefined) {
      let targetGame = this.gameList.get(roomID);
      targetGame?.removePlayer(socketInfo);
      let numOfPlayers = targetGame?.getNumOfPlayers();
      if (numOfPlayers == 0) {
        this.deleteGame(roomID);
      }
    }
  }

  deleteGame(id: string) {
    this.gameList.delete(id);
  }
  deletePlayer(id: string) {
    this.playerList.delete(id);
  }
  getGame(socketInfo: SocketInfo) {
    let roomID = this.playerList.get(socketInfo.id);
    if (roomID != undefined) {
      return this.gameList.get(roomID);
    }
    return undefined;
  }
}

export default RoomController;
