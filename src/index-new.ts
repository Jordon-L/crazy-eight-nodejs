import express from "express";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { uniqueNamesGenerator, animals } from "unique-names-generator";
import ActionHandler from "./actions.js";
import http from "http";
import { SocketInfo, GameList, GameStateWrapper, Message } from "./types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 5000;
const app = express();

const server = http.createServer(app);
const io = new Server(server);
let actionHandler = new ActionHandler();

app.use(express.static(path.resolve(__dirname, "../react/my-app/build")));

app.get("/", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../react/my-app/build", "index.html"));
});

app.get("*", function (_req, res) {
  res.sendFile(path.resolve(__dirname, "../react/my-app/build", "index.html"));
});

function generateName() {
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const randomString = uniqueNamesGenerator({
    dictionaries: [animals, numbers],
  });
  return randomString;
}

function isGameState(object: any): object is GameStateWrapper {
  return (object as GameStateWrapper).gameId !== undefined;
}

function isMessage(object: any): object is Message {
  return (object as Message).message !== undefined;
}

function isGameStateArray(object: any): object is GameStateWrapper[] {
  return (object as GameStateWrapper[])[0].gameId !== undefined;
}

export function displaySpecialMessage(socketID: string, message: Message){
  io.to(socketID).emit("display special message", message);
}

export function displayMessage(socketID: string, message: Message){
  io.to(socketID).emit("display message", message);
}

io.on("connection", function (socket) {
  socket.data.data = { id: socket.id, name: generateName() } as SocketInfo;
  socket.on("create game", function () {
    let data = actionHandler.executeAction("create game", socket.data.data) as
      | GameStateWrapper
      | Message;
    if (isGameState(data)) {
      socket.emit("room join", data);
      let id = data.gameId as number;
      socket.join(id.toString());
    }
  });

  socket.on("play as guest", function () {
    generateName();
  });

  socket.on("game list", function () {
    let gameList = actionHandler.getGameList() as GameList;
    socket.emit("game list", gameList);
  });

  socket.on("join game", function (incomingData) {
    let data = actionHandler.executeAction(
      "join game",
      socket.data.data,
      incomingData
    );
    if (isMessage(data)) {
      socket.emit("lobby message", data);
    }
    if (isGameState(data)) {
      socket.emit("room join", data);
      let id = data.gameId as number;
      io.to(id.toString()).emit("room update", data);
      socket.join(id.toString());
    }
  });

  socket.on("game ready", function () {
    let data = actionHandler.executeAction("ready game", socket.data.data);
    if (isGameState(data)) {
      let id = data.gameId as number;
      socket.join(id.toString());
      io.to(id.toString()).emit("room ready", data);
    }
  });

  socket.on("start game", function () {
    let dataArray = actionHandler.executeAction("start game", socket.data.data);
    if (isMessage(dataArray)) {
      return;
    }
    if (isGameStateArray(dataArray)) {
      for (let data of dataArray) {
        let playerId = data.playerId as string;
        io.to(playerId).emit("start game", data);
      }
    }
  });

  function endTurn() {
    let endTurn = actionHandler.executeAction("end turn", socket.data.data);
    if (isMessage(endTurn)) {
      return;
    }
    if (isGameState(endTurn)) {
      let id = endTurn.gameId as number;
      io.to(id.toString()).emit("end turn", endTurn);
    }

    let winnerData = actionHandler.executeAction("winner", socket.data.data);
    if(isGameState(winnerData)){
      let id = winnerData.gameId as number;
      io.to(id.toString()).emit("winner", winnerData);     
    }
  }
  socket.on("discard card", function (cards) {
    let data = actionHandler.executeAction(
      "discard card",
      socket.data.data,
      cards
    );
    if (isMessage(data)) {
      socket.emit("display message", data);
      return;
    }
    if (isGameState(data)) {
      socket.emit("discard card", data);
      if (data.currentRank == "8") {
        socket.emit("discard eight card", data);
        return;
      }
    }
    endTurn();
  });

  socket.on("discard eight card", function (suit) {
    let data = actionHandler.executeAction(
      "selectSuit",
      socket.data.data,
      suit
    );
    if (isMessage(data)) {
      return;
    }

    endTurn();
  });

  socket.on("draw card", function () {
    let data = actionHandler.executeAction("draw card", socket.data.data);
    if (isMessage(data)) {
      socket.emit("display message", data);
      return;
    }
    if (isGameState(data)) {
      socket.emit("draw card", data);
      let update = actionHandler.executeAction(
        "update hands",
        socket.data.data
      );
      if (isGameState(update)) {
        let id = update.gameId as number;
        io.to(id.toString()).emit("update hands", update);
      }
    }
  });

  socket.on("close", function () {
    console.log("socket closed");
  });

  socket.on("disconnecting", function () {
    console.log("disconnecting");
    let data = actionHandler.executeAction("leave game", socket.data.data);
    if (isMessage(data)) {
      return;
    }
    if (isGameState(data)) {
      let id = data.gameId as number;
      io.to(socket.id).emit("leave room");
      socket.leave(id.toString());
      io.to(id.toString()).emit("room update", data);
      return;
    }
    if (isGameStateArray(data)) {
      for (let d of data) {
        let playerId = d.playerId as string;
        io.to(playerId).emit("user change", d);
      }
    }
  });

  socket.on("leave room", function () {
    
    let data = actionHandler.executeAction("leave game", socket.data.data);
    if (isMessage(data)) {
      io.to(socket.id).emit("leave room");
      return;
    }
    if (isGameState(data)) {
      let id = data.gameId as number;
      io.to(socket.id).emit("leave room");
      socket.leave(id.toString());
      io.to(id.toString()).emit("room update", data);
    }
  });
});


io.on("close", function () {
  console.log("user closed");
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
