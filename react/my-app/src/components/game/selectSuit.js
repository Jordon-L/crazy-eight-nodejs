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
        <div className = 'selectSuit'>
            <MKButton onClick={() => select('heart')}>
                Heart
            </MKButton>
            <MKButton  onClick={() => select('spade')}>
                Spade
            </MKButton>
            <MKButton  onClick={() => select('club')}>
                Club
            </MKButton>
            <MKButton  onClick={() => select('diamond')}>
                Diamond
            </MKButton>                                    
        </div>        
    );
}

export default SelectSuit