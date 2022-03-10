import React,{useCallback, useContext, useEffect, useState} from 'react'
import io from 'socket.io-client';
import PlayerHand from "./playerHand";
import DrawCard from './drawCard';
import {SocketContext} from '../context/socket';
import DiscardCard from './discardCard';

function Game(props){
    let socket = useContext(SocketContext);
    let connected = socket.connected;
    const [cards, setCards] = useState([]);

    const handlePlayerHand = useCallback((gameData) => {
        setCards(gameData.playerHand);
    }, []);

    const drawCard = useCallback((gameData) => {
        let newCard = gameData.newCard;
        setCards(cards => [...cards, newCard]);
    }, []);

    const playCard = useCallback((gameData) =>{

    },[]);


    useEffect(() =>{
        socket.on('game', handlePlayerHand);
        socket.on('draw card', drawCard);

        return () => {
            socket.off('game', handlePlayerHand);
            socket.off('draw card', drawCard);
        }
    });
    let game = <div>
        <PlayerHand cards = {cards}></PlayerHand>
        <DrawCard></DrawCard>
        <DiscardCard></DiscardCard>
    </div>
    let full = <div>Website Full</div>
    return (
        <div>
            {socket.connected ? game:full}
        </div>
        
    )   
}

export default Game;