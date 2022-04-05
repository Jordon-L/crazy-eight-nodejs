/*
    File name: drawCard.js
    Description: Draw a card
*/

import React, {useContext} from 'react';
import {SocketContext} from '../../context/socket';
import {GameDataContext} from '../../context/gameData';
function DrawCard(props) {
    let socket = useContext(SocketContext);
    let gameData = useContext(GameDataContext);
    function drawAction() {
        console.log('sne')
        let twoStack = gameData.twoStack;
        if(twoStack !== 0){
            let draw = twoStack * 2;
            socket.emit('draw card', draw.toString());
            gameData.setTwoStack(0);
        }
        else{
            socket.emit('draw card', "1");
        }
    }

    return (
        <button onClick={drawAction} disabled = {!gameData.turn}>
            Draw card
        </button>
    );
}

export default DrawCard