import React, {useContext} from 'react';
import {SocketContext} from '../context/socket';

function DiscardCard(props) {
    let socket = useContext(SocketContext);

    function discardAction() {
        socket.emit('discard', "1");
    }

    return (
        <button onClick={discardAction}>
            Discard card
        </button>
    );
}

export default DiscardCard