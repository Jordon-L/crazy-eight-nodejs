import Game from "./game-new.js";
import RoomController from "./roomController.js";
import { ErrorMessage, GameList, GameStateWrapper, SocketInfo } from "./types";
import { errorMessage, formatGameList } from "./utils.js";

abstract class Action {
  constructor() {}
  abstract execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    data: any
  ): GameStateWrapper | ErrorMessage
}

class discardAction extends Action {
  constructor() {
    super();
  }
  execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    _data: any
  ): GameStateWrapper | ErrorMessage {
    let game = roomController.getGame(socketInfo) as Game | undefined;
    if (game != undefined) {
      game.discardCards(socketInfo, _data);
      return game.getGameData(socketInfo);
    }
    return errorMessage("game does not exist");
  }
}

class drawAction extends Action {
  constructor() {
    super();
  }
  execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    _data: any
  ): GameStateWrapper | ErrorMessage {
    let game = roomController.getGame(socketInfo) as Game | undefined;
    if (game != undefined) {
      game.drawCards(socketInfo, 1);
      return game.getGameData(socketInfo);
    }
    return errorMessage("game does not exist");
  }
}

class selectSuitAction extends Action {
  constructor() {
    super();
  }
  execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    _data: any
  ): GameStateWrapper | ErrorMessage {
    let game = roomController.getGame(socketInfo) as Game | undefined;
    if (game != undefined) {
      game.changeSuit(_data);
      return game.getGameData(socketInfo);
    }
    return errorMessage("Game does not exist");
  }
}

class createAction extends Action {
  constructor() {
    super();
  }
  execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    _data: any
  ): GameStateWrapper | ErrorMessage {
    let game = roomController.createGame(socketInfo) as Game
    return {gameId: game.getID(), players: game.getPlayerNameList(), playerName: socketInfo.name, master: socketInfo.name} as GameStateWrapper;
  }
}

class joinAction extends Action {
  constructor() {
    super();
  }
  execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    _data: any
  ): GameStateWrapper | ErrorMessage {
    let game = roomController.joinGame(socketInfo, _data);
    if (game != undefined) {
      let master = game.getRoomMaster();
      console.log(master);
      return {gameId: game!.getID(), players: game!.getPlayerNameList(), playerName: socketInfo.name, master: master} as GameStateWrapper;
    }
    return errorMessage("Game does not exist");
  }
}

class leaveAction extends Action {
  constructor() {
    super();
  }
  execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    _data: any
  ): GameStateWrapper | ErrorMessage {
    let game = roomController.getGame(socketInfo);
    if (game != undefined) {
      roomController.leaveGame(socketInfo);
      let master = game.getRoomMaster();
      return {gameId: game!.getID(), players: game!.getPlayerNameList(), playerName: socketInfo.name, master: master} as GameStateWrapper;
    }
    return errorMessage("Not in game");
  }
}

class readyAction extends Action {
  constructor() {
    super();
  }
  execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    _data: any
  ): GameStateWrapper | ErrorMessage {
    let game = roomController.getGame(socketInfo);
    if (game != undefined) {
      game!.ready(socketInfo);
      return {gameId: game!.getID(), players: game!.getPlayerNameList(), playerName: socketInfo.name};
    }
    return errorMessage("Game does not exist");
  }
}

class startAction extends Action {
  constructor() {
    super();
  }
  execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    _data: any
  ): GameStateWrapper | ErrorMessage {
    let game = roomController.getGame(socketInfo);
    //game!.start(socketInfo);
    return {gameId: game!.getID(), players: game!.getPlayerNameList(), playerName: socketInfo.name};
  }
}


class ActionHandler {
  roomController: RoomController;
  actions: Map<string, Action>;
  constructor() {
    this.actions = new Map<string, Action>();
    this.roomController = new RoomController();
    this.actions.set("discard card", new discardAction());
    this.actions.set("draw card", new drawAction());
    this.actions.set("selectSuit", new selectSuitAction());

    this.actions.set("join game", new joinAction());
    this.actions.set("ready game", new readyAction());
    this.actions.set("create game", new createAction());
    this.actions.set("start game", new startAction());
    this.actions.set("leave game", new leaveAction());
  }

  executeAction(command: string, socketInfo: SocketInfo, incomingData: string | null = null) {
    let action = this.actions.get(command);
    return action?.execute(socketInfo, this.roomController, incomingData);
  }
  getGameList() {
    let games = formatGameList(this.roomController.getGameList());
    return {gameList: games} as GameList;
  }
}
export default ActionHandler;
