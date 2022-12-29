import Game from "./game-new.js";
import Player from "./player-new.js";
import { SocketInfo } from "./types";

class RoomController {
  gameList: Map<Number, Game>;
  playerList: Map<string, Number>;
  idCounter: number;
  constructor() {
    this.idCounter = 0;
    this.gameList = new Map<Number, Game>();
    this.playerList = new Map<string, Number>();
  }

  getGameList() {
    return this.gameList;
  }
  getIdCounter() {
    this.idCounter++;
    return this.idCounter;
  }
  createGame(socketInfo: SocketInfo) {
    let game = new Game(this.getIdCounter(), socketInfo);
    this.gameList.set(game.getID(), game);
    this.playerList.set(socketInfo.id, game.getID());
  }
  joinGame(socketInfo: SocketInfo, gameId: number) {
    let targetGame = this.gameList.get(gameId);
    let player = new Player(socketInfo.name, socketInfo.id);
    if (targetGame != undefined) {
      targetGame?.addPlayer(player);
    }
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

  deleteGame(id: Number) {
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
