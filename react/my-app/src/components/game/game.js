/*
    File name : game.js
    Description: handles the data sent by the server via sockets and handles the game logic of the game.

*/

import React,{useCallback, useContext, useEffect, useState} from 'react'
import {SocketContext} from '../../context/socket';
import {GameDataContext} from '../../context/gameData';
import JoinRoom from '../room/joinRoom';
import PlayerTable from '../room/playerTable'
import GameSession from './gameSession';
export const GameContext = React.createContext();

function Game(props){
    const socket = useContext(SocketContext);
    const [gameStatus, setGameStatus] = useState(1);
    const [cards, setCards] = useState([]);
    const [gameId, setgameId] = useState('placeholder');
    const [players, setPlayers] = useState([]);
    const [otherHands, setOtherHands] = useState({});
    const [name, setName] = useState('placeholder');
    const [inPlay, setInPlay] = useState([]);
    const [turn, setTurn] = useState(false);
    const [whosTurn, setWhosTurn] = useState('');
    const [showSelectSuit, setShowSelectSuit] = useState(false);
    const [showCurrentSuit, setShowCurrentSuit] = useState(false);
    const [currentSuit, setCurrentSuit] = useState('placeholder');
    const [twoStack, setTwoStack] = useState(0);

    const handleStart = useCallback((gameData) => {
        setCards(gameData.playerHand);
        setOtherHands(gameData.otherHands);
        setInPlay(gameData.inPlay);
        setWhosTurn(gameData.whosTurn);
        if(gameData.whosTurn === name){
            setTurn(true);     
        }
        setGameStatus(3);
    }, [name]);

    const handleDiscard = useCallback((gameData) => {
        setCards(gameData.playerHand);
        setOtherHands(gameData.otherHands);
        setInPlay(gameData.inPlay);
        setTurn(false);
        setShowCurrentSuit(false);
        if(gameData.whosTurn !== undefined){
            setWhosTurn(gameData.whosTurn);
        }
        setGameStatus(3);
        console.log('discard');
    }, []);

    const handleEightDiscard = useCallback((gameData) => {
        setCards(gameData.playerHand);
        setOtherHands(gameData.otherHands);
        setInPlay(gameData.inPlay);
        setShowSelectSuit(true);
        setTurn(false);
        setGameStatus(3);
        console.log('discard eight');
    }, []);

    const handleTurn = useCallback((gameData) => {
        setOtherHands(gameData.otherHands);
        setInPlay(gameData.inPlay);
        setShowCurrentSuit(false);
        setWhosTurn(gameData.whosTurn)
        if(gameData.whosTurn === name){
            setTurn(true);     
        }
        setTwoStack(gameData.twoStack);
        setGameStatus(3);
    }, [name]);

    const displaySuit = useCallback((suit) => {
        setCurrentSuit(suit);
        setShowCurrentSuit(true);
        setShowSelectSuit(false);     
    },[]);

    const drawCard = useCallback((gameData) => {
        let newCards = gameData.newCards;
        setCards(cards => [...cards, ...newCards]);
    }, []);

    const handleGameId = useCallback((gameData, name, gameId) => {
        setgameId(gameId);
        setPlayers(gameData.players); 
        setName(name);
        setGameStatus(2);
    }, []);

    const handleUserJoined = useCallback((gameData) => {
        console.log('user joined');
        setPlayers(gameData.players);   
    }, []);

    const handleUserLeave = useCallback((gameData) => {
        console.log('user leave');
        setPlayers(gameData.players);
    }, []);  

    const handleGameReady = useCallback((gameData) => {
        setPlayers(gameData.players);              
    }, []);  

    const onClickReadyButton = function() {
        socket.emit('game ready');
    } 

    const displayMessage = useCallback((message) => {
        alert(message);            
    }, []);  

    const winner = useCallback((gameData) => {
        alert('game over ' + gameData.winner + ' won');
        setPlayers(gameData.players);
        setGameStatus(2);            
    }, []);  
    useEffect(() =>{
        socket.on('start game', handleStart);
        socket.on('draw card', drawCard);
        socket.on('join', handleGameId);
        socket.on('user joined', handleUserJoined);
        socket.on('user leave', handleUserLeave);
        socket.on('game ready', handleGameReady);
        socket.on('discard card', handleDiscard);
        socket.on('other play turn', handleTurn);
        socket.on('discard eight card', handleEightDiscard);
        socket.on('display suit', displaySuit);
        socket.on('display message', displayMessage);
        socket.on('winner', winner);

        return () => {
            socket.off('start game', handleStart);
            socket.off('draw card', drawCard);
            socket.off('join', handleGameId);
            socket.off('user joined', handleUserJoined);
            socket.off('user leave', handleUserLeave);
            socket.off('game ready', handleGameReady);
            socket.off('discard card', handleDiscard);
            socket.off('other play turn', handleTurn);
            socket.off('discard eight card', handleEightDiscard);
            socket.off('display suit', displaySuit);
            socket.off('display message', displayMessage);
            socket.off('winner', winner);
        }
    });

    function display(gameStatus, gameId, name, players){
        switch(gameStatus) {
            case 1:
                return <JoinRoom></JoinRoom>;
            case 2:
                return <React.Fragment>
                    <GameContext.Provider value ={{gameId, name, players}}>
                        <h1>Crazy Eight</h1>
                        <h3>Game ID: {gameId.toString()}</h3>
                        <h3>You are: {name}</h3>
                        <PlayerTable players = {players}></PlayerTable>
                    </GameContext.Provider>
                    
                    <button onClick = {onClickReadyButton}>Ready</button>
                </React.Fragment>;
            case 3:
                return <GameDataContext.Provider value = {{cards, players, name, otherHands, inPlay, turn, showSelectSuit, showCurrentSuit, currentSuit, twoStack, setTwoStack , whosTurn}}>
                        <GameSession></GameSession>
                    </GameDataContext.Provider>
            default:
                return <div>Error</div>;
        }
    }
    return (
        display(gameStatus, gameId, name, players)
    )   
}

export default Game;