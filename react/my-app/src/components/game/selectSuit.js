/*
    File name: displaySuit.js
    Description: Display buttons to select the suit if an eight is played
*/

import React, {useContext} from 'react';
import {SocketContext} from '../../context/socket';
import {GameDataContext} from '../../context/gameData';

function SelectSuit(props) {
    let socket = useContext(SocketContext);
    let gameData = useContext(GameDataContext);
    
    let show = gameData.showSelectSuit;
    function select(suit) {
        socket.emit('discard eight card', suit);   
    }
    let style = {};
    if(show === false){
        style = {display: 'None'}
    }
    return (
        <div className = 'selectSuit' style = {style}>
            <button onClick={() => select('heart')}>
                Heart
            </button>
            <button  onClick={() => select('spade')}>
                Spade
            </button>
            <button  onClick={() => select('club')}>
                Club
            </button>
            <button  onClick={() => select('diamond')}>
                Diamond
            </button>                                    
        </div>        
    );
}

export default SelectSuit