import React, {useContext} from 'react';
import {SocketContext} from '../../context/socket';

function DiscardCard(props) {
    let socket = useContext(SocketContext);

    function discardAction() {
        let selectedIndices = props.selected;
        socket.emit('discard card', selectedIndices);
    }

    return (
        <button id = 'discard' onClick={discardAction}>
            Discard card
        </button>
    );
}

export default DiscardCard