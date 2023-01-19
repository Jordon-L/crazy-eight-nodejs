import Card from "./card.js";
import Game from "./game-new.js";
import Player from "./player-new.js";
import RoomController from "./roomController.js";
import { Message, GameList, GameStateWrapper, SocketInfo } from "./types";
import { createMessage, formatGameList } from "./utils.js";

abstract class Action {
  constructor() {}
  abstract execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    data: any
  ): GameStateWrapper | GameStateWrapper[] | Message;
}

class discardAction extends Action {
  constructor() {
    super();
  }
  execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    data: any
  ): GameStateWrapper | Message {
    let game = roomController.getGame(socketInfo) as Game | undefined;
    if (game != undefined && game.currentTurn === socketInfo.name) {
      let cards = [];
      for (let i of data) {
        cards.push(new Card(i));
      }
      let results = game.discardCards(socketInfo, cards);
      if (results == true) {
        return game.getGameData(socketInfo);
      }
      return createMessage("Invalid Play");
    }
    return createMessage("game does not exist or not players turn");
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
  ): GameStateWrapper | Message {
    let game = roomController.getGame(socketInfo) as Game | undefined;
    if (game != undefined && game.currentTurn === socketInfo.name) {
      game.drawCards(socketInfo);
      return game.getGameData(socketInfo);
    }
    return createMessage("game does not exist or not players turn");
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
  ): GameStateWrapper | Message {
    let game = roomController.getGame(socketInfo) as Game | undefined;
    if (game != undefined) {
      game.changeSuit(_data);
      return game.getGameData(socketInfo);
    }
    return createMessage("Game does not exist");
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
  ): GameStateWrapper | Message {
    let game = roomController.createGame(socketInfo) as Game;
    return {
      gameId: game.getID(),
      players: game.getPlayerNameList(),
      playerName: socketInfo.name,
      master: socketInfo.name,
    } as GameStateWrapper;
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
  ): GameStateWrapper | Message {
    let game = roomController.joinGame(socketInfo, _data);
    if (game != undefined) {
      let master = game.getRoomMaster() as Player;
      return {
        gameId: game!.getID(),
        players: game!.getPlayerNameList(),
        playerName: socketInfo.name,
        master: master.name,
      } as GameStateWrapper;
    }
    return createMessage("Game does not exist or is full");
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
  ): GameStateWrapper | GameStateWrapper[] | Message {
    let game = roomController.getGame(socketInfo);
    if (game != undefined) {
      roomController.leaveGame(socketInfo);
      let master = game.getRoomMaster() as Player;
      if (game.started) {
        let dataArray = [];
        let players = game.getPlayerNameList();
        for (let player of players) {
          let data = game.getGameData(player);
          dataArray.push(data);
        }
        if (dataArray.length == 0) {
          return createMessage("Game is empty");
        }
        return dataArray;
      } else {
        if (master == undefined) {
          return createMessage("Game is empty");
        }
        return {
          gameId: game!.getID(),
          players: game!.getPlayerNameList(),
          master: master.name,
        } as GameStateWrapper;
      }
    }
    return createMessage("Not in game");
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
  ): GameStateWrapper | Message {
    let game = roomController.getGame(socketInfo);
    if (game != undefined) {
      game!.ready(socketInfo);
      return {
        gameId: game!.getID(),
        players: game!.getPlayerNameList(),
        playerName: socketInfo.name,
      };
    }
    return createMessage("Game does not exist");
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
  ): GameStateWrapper[] | Message {
    let game = roomController.getGame(socketInfo);
    if (game != undefined) {
      if (game.gameStart(socketInfo)) {
        let dataArray = [];
        let players = game.getPlayerNameList();
        for (let player of players) {
          let data = game.getGameData(player);
          dataArray.push(data);
        }
        return dataArray;
      }
      return createMessage("Everyone is not ready");
    }
    return createMessage("Game does not exist");
  }
}

class updateAction extends Action {
  constructor() {
    super();
  }
  execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    _data: any
  ): GameStateWrapper | Message {
    let game = roomController.getGame(socketInfo);
    if (game != undefined) {
      let data = game.getTurnData();
      return data;
    }
    return createMessage("Game does not exist");
  }
}

class updateHandsAction extends Action {
  constructor() {
    super();
  }
  execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    _data: any
  ): GameStateWrapper | Message {
    let game = roomController.getGame(socketInfo);
    if (game != undefined) {
      let data = game.getHandData();
      return data;
    }
    return createMessage("Game does not exist");
  }
}

class winAction extends Action {
  constructor() {
    super();
  }
  execute(
    socketInfo: SocketInfo,
    roomController: RoomController,
    _data: any
  ): GameStateWrapper | Message {
    let game = roomController.getGame(socketInfo);
    if (game != undefined) {
      let data = game.getGameData(socketInfo);
      if (data.playerHand!.length == 0) {
        return {
          gameId: game!.getID(),
          players: game!.getPlayerNameList(),
          playerName: socketInfo.name,
          winner: socketInfo.name,
        };
      }
    }
    return createMessage("Game does not exist");
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

    this.actions.set("end turn", new updateAction());
    this.actions.set("update hands", new updateHandsAction());
    this.actions.set("join game", new joinAction());
    this.actions.set("ready game", new readyAction());
    this.actions.set("create game", new createAction());
    this.actions.set("start game", new startAction());
    this.actions.set("leave game", new leaveAction());
    this.actions.set("winner", new winAction());
  }

  executeAction(
    command: string,
    socketInfo: SocketInfo,
    incomingData: string | null = null
  ) {
    let action = this.actions.get(command);
    return action?.execute(socketInfo, this.roomController, incomingData);
  }
  getGameList() {
    let games = formatGameList(this.roomController.getGameList());
    return { gameList: games } as GameList;
  }
}
export default ActionHandler;
