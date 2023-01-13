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
            <button class='game-button-input' onClick={() => select('H')}>
                Heart
            </button>
            <button class='game-button-input' onClick={() => select('S')}>
                Spade
            </button>
            <button class='game-button-input' onClick={() => select('C')}>
                Club
            </button>
            <button class='game-button-input' onClick={() => select('D')}>
                Diamond
            </button>                                    
        </>        
    );
}

export default SelectSuit