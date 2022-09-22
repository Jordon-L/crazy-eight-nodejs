/*
    Filename : game.js
    Description: handles the data sent by the server via sockets and handles the game logic of the game.

*/

import React,{useCallback, useContext, useEffect, useState, useRef, useReducer} from 'react'
import {SocketContext} from 'context/socket';
import {GameDataContext} from 'context/gameData';
import Lobby from 'components/lobby/lobby';
import PlayerTable from 'components/lobby/playerTable'
import GameSession from 'components/game/gameSession';
import MKButton from "components/materialKit/MKButton";
export const GameContext = React.createContext();

const initialState = {
  gameStatus: 1,
  playerHand: [],
  gameId: 'placeholder',
  players: [],
  otherHands: [],
  playerName: 'placeholder',
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
      return {
        ...state,
        players: gameData.players,
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
    const socket = useContext(SocketContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    //console.log(state);


    // const handleEightDiscard = useCallback((gameData) => {
    //     setCards(gameData.playerHand);
    //     setOtherHands(gameData.otherHands);
    //     setInPlay(gameData.inPlay);
    //     setShowSelectSuit(true);
    //     setTurn(false);
        
    // }, []);

    // const drawCard = useCallback((gameData) => {
    //     let newCards = gameData.newCards;
    //     setCards(cards => [...cards, ...newCards]);
    // }, []);

 

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
    //
    useEffect(() => {
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
                return <Lobby></Lobby>;
            case 2:
                return <React.Fragment>
                    <GameContext.Provider value ={{state}}>
                        <h1>Crazy Eight</h1>
                        <h3>Game ID: {state.gameId}</h3>
                        <h3>You are: {state.playerName}</h3>
                        <PlayerTable players = {state.players}></PlayerTable>
                    </GameContext.Provider>
                    
                    <MKButton onClick = {onClickReadyButton}>Ready</MKButton>
                </React.Fragment>;
             case 3:
                 return <GameDataContext.Provider value = {{state}}>
                         <GameSession></GameSession>
                    </GameDataContext.Provider>
            default:
                return <div>Error</div>;
        }
    }
    return (
        display()
    )   
}

export default Game;