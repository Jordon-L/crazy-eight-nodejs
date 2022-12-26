import Player from "./player-new";
import RoomController from "./roomController";
import { SocketInfo } from "./types";

abstract class Action {
  constructor() {}
  abstract execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    data: any
  ): void;
}

class discardAction extends Action {
  constructor() {
    super();
  }
  execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    _data: any
  ): void {
    let game = roomController.getGame(socketInfo);
    if (game != undefined) {
      game.discardCards(socketInfo, _data);
    }
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
  ): void {
    let game = roomController.getGame(socketInfo);
    game!.drawCards(socketInfo, 1);
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
  ): void {
    let game = roomController.getGame(socketInfo);
    game!.changeSuit(_data);
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
  ): void {
    roomController.createGame(socketInfo);
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
  ): void {
    let game = roomController.getGame(socketInfo);
    game!.addPlayer(socketInfo);
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
  ): void {
    let game = roomController.getGame(socketInfo);
    game!.removePlayer(socketInfo);
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
  ): void {
    let game = roomController.getGame(socketInfo);
    game!.ready(socketInfo);
  }
}

class gameListAction extends Action {
  constructor() {
    super();
  }
  execute(_player: Player, _roomController: RoomController, _data: any): void {}
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
    this.actions.set("game ready", new readyAction());
    this.actions.set("game list", new gameListAction());
    this.actions.set("create game", new createAction());
    this.actions.set("ready", new readyAction());
    this.actions.set("leave", new leaveAction());
  }

  executeAction(command: string, socketInfo: SocketInfo) {
    let action = this.actions.get(command);
    action?.execute(socketInfo, this.roomController, null);
  }
  getGameList() {
    return this.roomController.getGameList();
  }
}
export default ActionHandler;
