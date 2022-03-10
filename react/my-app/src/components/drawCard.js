import React, {useContext} from 'react';
import {SocketContext} from '../context/socket';

function DrawCard(props) {
    let socket = useContext(SocketContext);

    function drawAction() {
        console.log('sne')
        socket.emit('draw card', "1");
    }

    return (
        <button onClick={drawAction}>
            Draw card
        </button>
    );
}

export default DrawCard