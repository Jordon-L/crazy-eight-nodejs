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
    let gameData = useContext(GameDataContext).state;
    function drawAction() {
        if(gameData.turn === true){
          socket.emit('draw card');        
        }
    }

    return (
        <img class = 'drawCard' src = {cardStack} onClick={drawAction}></img>
    );
}

export default DrawCard