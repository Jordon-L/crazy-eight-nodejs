/*
    File name: discardCard.js
    Description: button to discard selected cards
*/

import React, {useContext} from 'react';
import {SocketContext} from 'context/socket';
import {GameDataContext} from 'context/gameData';
import MKButton from "components/materialKit/MKButton";
function DiscardCard(props) {
    let socket = useContext(SocketContext);
    let gameData = useContext(GameDataContext).state;

    let isDisabled = !gameData.turn;
    function discardAction() {
        let selectedIndices = props.selected;
        console.log(gameData.twoStack);
        if(props.selected.length !== 0){
            console.log('discard');
            socket.emit('discard card', selectedIndices);          
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