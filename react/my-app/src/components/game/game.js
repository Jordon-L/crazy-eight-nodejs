/*
    Filename : game.js
    Description: handles the data sent by the server via sockets and handles the game logic of the game.

*/

import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  useReducer,
} from "react";
import io from "socket.io-client";
import { SocketContext } from "context/socket";
import { GameDataContext } from "context/gameData";
import Lobby from "components/lobby/lobby";
import PlayerTable from "components/lobby/playerTable";
import GameSession from "components/game/gameSession";
export const GameContext = React.createContext();
const socket = io();

const initialState = {
  gameStatus: 1,
  playerHand: [],
  gameId: "placeholder",
  players: [],
  otherHands: [],
  playerName: "",
  inPlay: [],
  turn: false,
  whosTurn: "",
  showSelectSuit: false,
  currentSuit: "placeholder",
  twoStack: 0,
  message: "",
  specialMessage:"",
  master: "",
};

function reducer(state, action) {
  let gameData = action.payload;
  let turn = false;
  let whosTurn = state.whosTurn;
  let message = state.message;
  let specialMessage = state.specialMessage;
  switch (action.type) {
    case "handleStart":
      if (gameData.whosTurn === state.playerName) {
        turn = true;
      }
      return {
        ...state,
        playerHand: gameData.playerHand,
        otherHands: gameData.otherHands,
        inPlay: gameData.inPlay,
        whosTurn: gameData.whosTurn,
        showSelectSuit: false,
        currentSuit: gameData.currentSuit,
        twoStack: 0,
        turn: turn,
        gameStatus: 3,
      };
    case "handleJoin":
      if (gameData === -1) {
        return { ...state };
      }
      return {
        ...state,
        gameId: gameData.gameId,
        players: gameData.players,
        playerName: gameData.playerName,
        master: gameData.master,
        gameStatus: 2,
      };
    case "handleRoomUpdate":
      if (gameData === -1) {
        return { ...state };
      }
      return {
        ...state,
        gameId: gameData.gameId,
        players: gameData.players,
        master: gameData.master,
        gameStatus: 2,
      };
    case "handleRoomReady":
      if (gameData === -1) {
        return { ...state };
      }
      return {
        ...state,
        gameId: gameData.gameId,
        players: gameData.players,
        gameStatus: 2,
      };
    case "handleUserChange":
      if (gameData.whosTurn !== undefined) {
        whosTurn = gameData.whosTurn;
      }
      if (gameData.whosTurn === state.playerName) {
        turn = true;
      }
      return {
        ...state,
        players: gameData.players,
        otherHands: gameData.otherHands,
        inPlay: gameData.inPlay,
        currentSuit: gameData.currentSuit,
        whosTurn: whosTurn,
        turn: turn,
        twoStack: gameData.twoStack,
        showSelectSuit: false,
        master: gameData.master,
      };
    case "handleTurn":
      if (gameData.whosTurn !== undefined) {
        whosTurn = gameData.whosTurn;
      }
      if (gameData.whosTurn === state.playerName) {
        turn = true;
        message =  "Your Turn";
      }
      return {
        ...state,
        otherHands: gameData.otherHands,
        inPlay: gameData.inPlay,
        currentSuit: gameData.currentSuit,
        whosTurn: whosTurn,
        turn: turn,
        twoStack: gameData.twoStack,
        showSelectSuit: false,
        message: message,
      };
    case "handleDiscard":
      if (gameData.whosTurn !== undefined) {
        whosTurn = gameData.whosTurn;
      }
      return {
        ...state,
        playerHand: gameData.playerHand,
        otherHands: gameData.otherHands,
        inPlay: gameData.inPlay,
        turn: false,
        currentSuit: gameData.currentSuit,
        whosTurn: whosTurn,
        message: "",
      };
    case "handleEightDiscard":
      return {
        ...state,
        playerHand: gameData.playerHand,
        inPlay: gameData.inPlay,
        showSelectSuit: true,
        turn: false,
      };
    case "handleDraw":
      return {
        ...state,
        playerHand: gameData.playerHand,
        twoStack: gameData.twoStack,
      };
    case "handleOtherPlayerUpdate":
      return {
        ...state,
        otherHands: gameData.otherHands,
        twoStack: gameData.twoStack,
      };
    case "handleWinner":
      return {
        ...state,
        players: gameData.players,
        gameStatus: 2,
      };
    case "handleLeave":
      return {
        ...state,
        gameStatus: 1,
      };
    case "handleMessage":
      return {
        ...state,
        message: gameData.message,
      };
      case "handleSpecialMessage":
        return {
          ...state,
          specialMessage: gameData.message,
        };
    default:
      throw new Error();
  }
}

function Game(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onClickReadyButton = function () {
    socket.volatile.emit("game ready");
  };
  const onClickStartButton = function () {
    socket.volatile.emit("start game");
  };
  const onClickLeaveButton = function () {
    socket.volatile.emit("leave room");
  };

  function handleSocket(payload, type) {
    return dispatch({ type: type, payload: payload });
  }

  //
  useEffect(() => {
    socket.on("start game", (payload) => handleSocket(payload, "handleStart"));
    socket.on("room join", (payload) => handleSocket(payload, "handleJoin"));
    socket.on("room update", (payload) =>
      handleSocket(payload, "handleRoomUpdate")
    );
    socket.on("room ready", (payload) =>
      handleSocket(payload, "handleRoomReady")
    );
    socket.on("user change", (payload) =>
      handleSocket(payload, "handleUserChange")
    );
    socket.on("discard card", (payload) =>
      handleSocket(payload, "handleDiscard")
    );
    socket.on("end turn", (payload) => handleSocket(payload, "handleTurn"));
    socket.on("draw card", (payload) => handleSocket(payload, "handleDraw"));
    socket.on("update hands", (payload) =>
      handleSocket(payload, "handleOtherPlayerUpdate")
    );
    socket.on("discard eight card", (payload) =>
      handleSocket(payload, "handleEightDiscard")
    );
    socket.on("winner", (payload) => handleSocket(payload, "handleWinner"));
    socket.on("leave room", (payload) => handleSocket(payload, "handleLeave"));
    socket.on("display message", (payload) =>
      handleSocket(payload, "handleMessage")
    );
    socket.on("display special message", (payload) =>
    handleSocket(payload, "handleSpecialMessage")
  );
    return () => {
      socket.removeAllListeners();
    };
  }, []);

  function display() {
    switch (state.gameStatus) {
      case 1:
        return (
          <SocketContext.Provider value={socket}>
            <Lobby></Lobby>
          </SocketContext.Provider>
        );
      case 2:
        return (
          <React.Fragment>
            <SocketContext.Provider value={socket}>
              <div>
                <GameContext.Provider value={{ state }}>
                  <div class="game-info">
                    <h1>Crazy Eights</h1>
                    <h3>Game ID: {state.gameId}</h3>
                    <h3>You are: {state.playerName}</h3>
                    <button
                      class="game-button-input"
                      onClick={onClickLeaveButton}
                    >
                      Leave Room
                    </button>
                  </div>
                  <PlayerTable players={state.players}></PlayerTable>
                </GameContext.Provider>
                <div class="game-ready">
                  <button
                    class="game-button-input"
                    onClick={onClickReadyButton}
                  >
                    Ready
                  </button>
                  <button
                    class="game-button-input"
                    onClick={onClickStartButton}
                    disabled={!(state.playerName === state.master)}
                  >
                    Start
                  </button>
                </div>
              </div>
            </SocketContext.Provider>
          </React.Fragment>
        );
      case 3:
        return (
          <SocketContext.Provider value={socket}>
            <GameDataContext.Provider value={{ state }}>
              <GameSession></GameSession>
            </GameDataContext.Provider>
          </SocketContext.Provider>
        );
      default:
        return <div>Error</div>;
    }
  }
  return display();
}

export default Game;
