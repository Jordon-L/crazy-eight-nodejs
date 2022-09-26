/*
    Filename : game.js
    Description: handles the data sent by the server via sockets and handles the game logic of the game.

*/

import React,{useCallback, useContext, useEffect, useState, useRef, useReducer} from 'react'
import io from 'socket.io-client';
import {SocketContext} from 'context/socket';
import {GameDataContext} from 'context/gameData';
import Lobby from 'components/lobby/lobby';
import PlayerTable from 'components/lobby/playerTable'
import GameSession from 'components/game/gameSession';
import MKButton from "components/materialKit/MKButton";
export const GameContext = React.createContext();
const socket = io();

const initialState = {
  gameStatus: 1,
  playerHand: [],
  gameId: 'placeholder',
  players: [],
  otherHands: [],
  playerName: '',
  inPlay: [],
  turn: false,
  whosTurn: '',
  showSelectSuit: false,
  currentSuit: 'placeholder',
  twoStack: 0,
};

function reducer(state, action) {
  let gameData = action.payload;
  let turn  = false;
  let whosTurn = state.whosTurn;
  switch (action.type) {
    case 'handleStart':
      if(gameData.whosTurn === state.playerName){
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
      }
    case 'handleGameId':
      if(gameData === -1){
        console.log('error');
        return {...state};
      }
      return {
        ...state,
        gameId: gameData.gameId,
        players: gameData.players,
        playerName: gameData.playerName,
        gameStatus:2,
      }
    case 'handleUserChange':
      if(gameData.whosTurn !== undefined){
        whosTurn = gameData.whosTurn;
      }
      if(gameData.whosTurn === state.playerName){
        turn = true;
      }
      return {
        ...state,
        players: gameData.players,
        otherHands: gameData.otherHands,
        inPlay: gameData.inPlay,
        currentSuit: gameData.currentSuit,
        whosTurn : whosTurn,
        turn: turn,
        twoStack: gameData.twoStack,
        showSelectSuit:false,
      }
    case 'handleDiscard':
      if(gameData.whosTurn !== undefined){
        whosTurn = gameData.whosTurn;
      }
      return {
        ...state,
        playerHand: gameData.playerHand,
        otherHands: gameData.otherHands,
        inPlay: gameData.inPlay,
        turn : false,
        currentSuit: gameData.currentSuit,
        whosTurn : whosTurn,
      }
    
    case 'handleTurn':
      if(gameData.whosTurn !== undefined){
        whosTurn = gameData.whosTurn;
      }
      if(gameData.whosTurn === state.playerName){
        turn = true;
      }
      return {
        ...state,
        otherHands: gameData.otherHands,
        inPlay: gameData.inPlay,
        currentSuit: gameData.currentSuit,
        whosTurn : whosTurn,
        turn: turn,
        twoStack: gameData.twoStack,
        showSelectSuit:false,
     }
    case 'handleEightDiscard':
      return {
        ...state,
        playerHand: gameData.playerHand,
        inPlay: gameData.inPlay,
        showSelectSuit: true,
        turn: false,
      }
    case 'handleDraw':
     return{
       ...state,
       playerHand: gameData.playerHand,
       twoStack: gameData.twoStack,
     }
    case 'handleWinner':
      return{
        ...state,
        players: gameData.players,
        gameStatus: 2,
      }
    default:
      throw new Error();
  }
}

function Game(props){
    const [state, dispatch] = useReducer(reducer, initialState);

 

    const onClickReadyButton = function() {
         socket.emit('game ready');
    } 

    // const displayMessage = useCallback((message) => {
    //     alert(message);            
    // }, []);  

    // const winner = useCallback((gameData) => {
    //     alert('game over ' + gameData.winner + ' won');
    //     setPlayers(gameData.players);
    //     setGameStatus(2);          
    // }, []);

    function handleSocket(payload, type){
      console.log('asds');
      return dispatch({type: type, payload: payload});
    }

    function playAsGuest(){
      socket.emit("play as guest");
    }
    //
    useEffect(() => {
      socket.disconnect().connect();

      if(state.playerName === ''){
        playAsGuest();
      }
      console.log('tst')
      socket.on('start game', (payload) => handleSocket(payload, 'handleStart'));
      socket.on('join', (payload) => handleSocket(payload, 'handleGameId'));
      socket.on('user change', (payload) => handleSocket(payload, 'handleUserChange'));
      socket.on('discard card', (payload) => handleSocket(payload, 'handleDiscard'));
      socket.on('other play turn', (payload) => handleSocket(payload, 'handleTurn'));
      socket.on('draw card', (payload) => handleSocket(payload, 'handleDraw'));
      socket.on('discard eight card', (payload) => handleSocket(payload, 'handleEightDiscard'));
      socket.on('winner', (payload) => handleSocket(payload, 'handleWinner'));
      return () => {
        socket.removeAllListeners();
        socket.disconnect();
    }
    },[]);
    
        
        // socket.on('discard card', handleDiscard);
        // socket.on('other play turn', handleTurn);
        // socket.on('discard eight card', handleEightDiscard);
        // socket.on('display message', displayMessage);
        //socket.on('winner', winner);


    function display(){
        switch(state.gameStatus) {
            case 1:
                return <SocketContext.Provider value ={socket}><Lobby></Lobby></SocketContext.Provider>;
            case 2:
                return <React.Fragment>
                    <SocketContext.Provider value ={socket}>
                      <div>
                        <GameContext.Provider value ={{state}}>
                          <div class='game-info'>     
                            <h1>Crazy Eights</h1>
                            <h3>Game ID: {state.gameId}</h3>
                            <h3>You are: {state.playerName}</h3>
                          </div>
                          <PlayerTable players = {state.players}></PlayerTable>
                        </GameContext.Provider>
                        <div class='game-ready'>
                          <button class='game-button-input' onClick = {onClickReadyButton}>Ready</button>
                        </div>
                      </div>
                    </SocketContext.Provider>
                </React.Fragment>;
             case 3:
                 return <SocketContext.Provider value ={socket}>
                    <GameDataContext.Provider value = {{state}}>
                      <GameSession></GameSession>
                    </GameDataContext.Provider>
                  </SocketContext.Provider>
            default:
                return <div>Error</div>;
        }
    }
    return (
        display()
    )   
}

export default Game;