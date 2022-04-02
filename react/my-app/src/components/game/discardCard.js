import React, {useContext} from 'react';
import {SocketContext} from '../../context/socket';
import {GameDataContext} from '../../context/gameData';

function DiscardCard(props) {
    let socket = useContext(SocketContext);
    let gameData = useContext(GameDataContext);
    function discardAction() {
        let selectedIndices = props.selected;
        socket.emit('discard card', selectedIndices);
    }

    return (
        <button id = 'discard' onClick={discardAction} disabled = {!gameData.turn}>
            Discard card
        </button>
    );
}

export default DiscardCard