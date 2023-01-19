/*
    File name: discardCard.js
    Description: button to discard selected cards
*/

import React, {useContext} from 'react';
import {SocketContext} from 'context/socket';
import {GameDataContext} from 'context/gameData';
function DiscardCard(props) {
    let socket = useContext(SocketContext);
    let gameData = useContext(GameDataContext).state;

    let isDisabled = !gameData.turn;
    function discardAction() {
        let selectedIndices = props.selected;
        if(props.selected.length !== 0){
            let hand = gameData.playerHand;
            let discard = [];
            for(const index of selectedIndices){
              discard.push(hand[index]);
            }
            socket.emit('discard card', discard);          
        }
        props.setSelected([]);
 
    }
    return (
        <>
          <button class='game-button-input' onClick={discardAction} disabled = {isDisabled}>
              Discard card
          </button>
        </>
    );
}

export default DiscardCard