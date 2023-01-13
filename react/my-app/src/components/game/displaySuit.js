/*
    File name: displaySuit.js
    Description: Display the selected suit if an eight is played
*/
import React, {useContext} from 'react';
import {GameDataContext} from 'context/gameData';

let suits = {H: "Heart", D: "Diamond", S: "Spade", C: "Club"}

function DisplaySuit(props) {
    let gameData = useContext(GameDataContext).state;
    let currentSuit =  suits[gameData.currentSuit];
    return (
        <p>
            current suit : {currentSuit}
        </p>
    );
}

export default DisplaySuit
