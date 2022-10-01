/*
    File name: displaySuit.js
    Description: Display buttons to select the suit if an eight is played
*/

import React, {useContext} from 'react';
import {SocketContext} from 'context/socket';
import {GameDataContext} from 'context/gameData';
import MKButton from "components/materialKit/MKButton";
function SelectSuit(props) {
    let socket = useContext(SocketContext);
    
    
    function select(suit) {
        socket.emit('discard eight card', suit);   
    }
    return (
        <>
            <button class='game-button-input' onClick={() => select('heart')}>
                Heart
            </button>
            <button class='game-button-input' onClick={() => select('spade')}>
                Spade
            </button>
            <button class='game-button-input' onClick={() => select('club')}>
                Club
            </button>
            <button class='game-button-input' onClick={() => select('diamond')}>
                Diamond
            </button>                                    
        </>        
    );
}

export default SelectSuit