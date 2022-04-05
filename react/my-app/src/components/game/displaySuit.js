/*
    File name: displaySuit.js
    Description: Display the selected suit if an eight is played
*/
import React, {useContext} from 'react';
import {SocketContext} from '../../context/socket';
import {GameDataContext} from '../../context/gameData';

function DisplaySuit(props) {
    let gameData = useContext(GameDataContext);
    let style = {}
    if(gameData.showCurrentSuit === false){
        style = {display: 'None'}
    }
    return (
        <p style = {style}>
            current suit : {gameData.currentSuit}
        </p>
    );
}

export default DisplaySuit
