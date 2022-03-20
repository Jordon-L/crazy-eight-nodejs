import React,{useCallback, useContext, useEffect, useState} from 'react'
import io from 'socket.io-client';
import PlayerHand from "./playerHand";
import DrawCard from './drawCard';
import {SocketContext} from '../context/socket';
import DiscardCard from './discardCard';
import JoinRoom from './joinRoom';
import PlayerTable from './playerTable'

function Game(props){
    function createPlayerStatus(name, ready) {
        return { 'name': name, 'ready': ready};
    }

    let socket = useContext(SocketContext);
    let connected = socket.connected;
    let gameStart = false;
    const [gameJoin, setGameJoin] = useState(false);
    const [cards, setCards] = useState([]);
    const [gameId, setgameId] = useState(null);
    const [players, setPlayers] = useState([]);
    const [readyPlayers, setReadyPlayers] = useState([false,false,false,false])
    const [playerIndex, setPlayerIndex] = useState(null);
    const [name, setName] = useState([]);
    const [gameMaster,setGameMaster] = useState(false);
    const handlePlayerHand = useCallback((gameData) => {
        setCards(gameData.playerHand);
    }, []);

    const drawCard = useCallback((gameData) => {
        let newCard = gameData.newCard;
        setCards(cards => [...cards, newCard]);
    }, []);

    const handleGameId = useCallback((gameData) => {
        setgameId(gameData.gameId);
        setPlayers(gameData.players);
        setName(gameData.name);
        setGameJoin(true);
    }, []);

    const handleUserJoined = useCallback((gameData) => {
        console.log('user joined');
        setPlayers(gameData.players);   
        setName(gameData.name);
        setgameId(gameData.gameId);
    }, []);

    const handleUserLeave = useCallback((gameData) => {
        console.log('user leave');
        setPlayers(gameData.players);
    }, []);  

    const handleGameReady = useCallback((gameData) => {
        setReadyPlayers(gameData.readyPlayers);
    }, []);  

    const onClickReadyButton = function() {
        socket.emit('game ready');
    } 
    useEffect(() =>{
        socket.on('game', handlePlayerHand);
        socket.on('draw card', drawCard);
        socket.on('join', handleGameId);
        socket.on('user joined', handleUserJoined);
        socket.on('user leave', handleUserLeave);
        socket.on('game ready', handleGameReady);
        return () => {
            socket.off('game', handlePlayerHand);
            socket.off('draw card', drawCard);
            socket.off('join', handleGameId);
            socket.off('user joined', handleUserJoined);
            socket.off('user leave', handleUserLeave);
            socket.off('game ready', handleGameReady);
        }
    });
    let game = <div>
        <PlayerHand cards = {cards}></PlayerHand>
        <DrawCard></DrawCard>
        </div>
    let waiting = <div> 
        <PlayerTable players = {players}></PlayerTable>
    </div>
    let join = <JoinRoom></JoinRoom>
    return (
        <div>
            {gameJoin ? waiting :join}
        </div>
        
    )   
}

export default Game;