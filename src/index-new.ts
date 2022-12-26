import express from "express";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { uniqueNamesGenerator, animals } from "unique-names-generator";
import ActionHandler from "./actions";
import http from "http";
import { SocketInfo } from "./types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 5000;
const app = express();

const server = http.createServer(app);
const io = new Server(server);
let actionHandler = new ActionHandler();

app.use(express.static(path.resolve(__dirname, "./react/my-app/build")));

app.get("/", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "./react/my-app/build", "index.html"));
});

app.get("*", function (_req, res) {
  res.sendFile(path.resolve(__dirname, "./react/my-app/build", "index.html"));
});

function generateName() {
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const randomString = uniqueNamesGenerator({
    dictionaries: [animals, numbers],
  });
  return randomString;
}

io.on("connection", function (socket) {
  console.log("a user connected");
  socket.data.data = { id: socket.id, name: generateName() } as SocketInfo;
  socket.on("create game", function () {});

  socket.on("play as guest", function () {
    generateName();
  });

  socket.on("game list", function () {
    actionHandler.getGameList();
  });

  socket.on("join game", function () {
    actionHandler.executeAction("join game", socket.data.data);
  });

  socket.on("game ready", function () {
    actionHandler.executeAction("game ready", socket.data.data);
  });

  socket.on("discard card", function () {
    actionHandler.executeAction("discard card", socket.data.data);
  });

  socket.on("draw card", function () {
    actionHandler.executeAction("draw card", socket.data.data);
  });

  socket.on("close", function () {
    console.log("socket closed");
  });
});

io.on("close", function () {
  console.log("user closed");
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
