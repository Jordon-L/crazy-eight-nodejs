import React,{useCallback, useContext, useEffect, useState} from 'react'
import io from 'socket.io-client';
import PlayerHand from "./playerHand";
import DrawCard from './drawCard';
import {SocketContext} from '../context/socket';
import DiscardCard from './discardCard';
import JoinRoom from './joinRoom';
import PlayerTable from './playerTable/playerTable'
export const GameContext = React.createContext();

function Game(props){
    function createPlayerStatus(name, number) {
        return {'name': name, 'ready': false, 'number': number};;
    }
    const socket = useContext(SocketContext);
    const [gameStatus, setGameStatus] = useState(1);
    const [cards, setCards] = useState([]);
    const [gameId, setgameId] = useState('placeholder');
    const [players, setPlayers] = useState([]);
    const [name, setName] = useState('placeholder');
    const [gameMaster,setGameMaster] = useState(false);

    const handlePlayerHand = useCallback((gameData) => {
        setCards(gameData.playerHand);
        setGameStatus(3);
    }, []);

    const drawCard = useCallback((gameData) => {
        let newCard = gameData.newCard;
        setCards(cards => [...cards, newCard]);
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
    useEffect(() =>{
        socket.on('start game', handlePlayerHand);
        socket.on('draw card', drawCard);
        socket.on('join', handleGameId);
        socket.on('user joined', handleUserJoined);
        socket.on('user leave', handleUserLeave);
        socket.on('game ready', handleGameReady);
        return () => {
            socket.off('start game', handlePlayerHand);
            socket.off('draw card', drawCard);
            socket.off('join', handleGameId);
            socket.off('user joined', handleUserJoined);
            socket.off('user leave', handleUserLeave);
            socket.off('game ready', handleGameReady);
        }
    });

    function display(gameStatus, gameId, name, players){
        switch(gameStatus) {
            case 1:
                return <JoinRoom></JoinRoom>;
            case 2:
                return <div>
                    <GameContext.Provider value ={{gameId, name, players}}>
                        <h1>Crazy Eight</h1>
                        <h3>Game ID: {gameId.toString()}</h3>
                        <h3>You are: {name}</h3>
                        <PlayerTable players = {players}></PlayerTable>
                    </GameContext.Provider>
                    
                    <button onClick = {onClickReadyButton}>Ready</button>
                </div>;
            case 3:
                return <div>
                    <PlayerHand cards = {cards}></PlayerHand>
                </div>;
            default:
                return <div>Error</div>;
        }
    }
    return (
        <div>
            {display(gameStatus, gameId, name, players)}
        </div>
        
    )   
}

export default Game;