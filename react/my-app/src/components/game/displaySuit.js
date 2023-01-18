/*
    File name: displaySuit.js
    Description: Display the selected suit if an eight is played
*/
import React, { useContext } from "react";
import { GameDataContext } from "context/gameData";
import {suitPaths} from 'components/cards/suitPaths'

let suits = {
  H: suitPaths[`./heart.svg`],
  D: suitPaths[`./diamond.svg`],
  S: suitPaths[`./spade.svg`],
  C: suitPaths[`./club.svg`],
};

function DisplaySuit(props) {
  let gameData = useContext(GameDataContext).state;
  let currentSuit = suits[gameData.currentSuit].default;
  return <p>current suit : <img style={{width: "25px", height: "25px"}} src={currentSuit} alt= {gameData.currentSuit}></img> </p>;
}


export default DisplaySuit;
