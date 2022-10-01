/*
    File name: displaySuit.js
    Description: Display the selected suit if an eight is played
*/
import React, {useContext} from 'react';
import {GameDataContext} from 'context/gameData';

function DisplaySuit(props) {
    let gameData = useContext(GameDataContext).state;
    return (
        <p>
            current suit : {gameData.currentSuit}
        </p>
    );
}

export default DisplaySuit
