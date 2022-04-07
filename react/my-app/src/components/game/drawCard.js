/*
    File name: drawCard.js
    Description: a button to draw cards
*/

import React, {useContext} from 'react';
import {SocketContext} from 'context/socket';
import {GameDataContext} from 'context/gameData';
import cardStack from 'components/cards/cardImages/cardStack.png';

function DrawCard(props) {
    let socket = useContext(SocketContext);
    let gameData = useContext(GameDataContext);
    function drawAction() {
        if(gameData.turn === true){
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
    }

    return (
        <img class = 'drawCard' src = {cardStack} onClick={drawAction}></img>
    );
}

export default DrawCard