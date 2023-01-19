/*
    File name: displaySuit.js
    Description: Display buttons to select the suit if an eight is played
*/

import React, { useContext } from "react";
import { SocketContext } from "context/socket";
import { suitPaths } from "components/cards/suitPaths";

let suits = {
  H: suitPaths[`./heart.svg`],
  D: suitPaths[`./diamond.svg`],
  S: suitPaths[`./spade.svg`],
  C: suitPaths[`./club.svg`],
};

function SelectSuit(props) {
  let socket = useContext(SocketContext);

  function select(suit) {
    socket.emit("discard eight card", suit);
  }
  return (
    <>
      <button class="game-button-input" onClick={() => select("H")}>
        <img
          style={{ width: "25px", height: "25px" }}
          src={suits["H"].default}
          alt="Heart"
        ></img>
      </button>
      <button class="game-button-input" onClick={() => select("S")}>
        <img
          style={{ width: "25px", height: "25px" }}
          src={suits["S"].default}
          alt="Spade"
        ></img>
      </button>
      <button class="game-button-input" onClick={() => select("C")}>
        <img
          style={{ width: "25px", height: "25px" }}
          src={suits["C"].default}
          alt="Club"
        ></img>
      </button>
      <button class="game-button-input" onClick={() => select("D")}>
        <img
          style={{ width: "25px", height: "25px" }}
          src={suits["D"].default}
          alt="Diamond"
        ></img>
      </button>
    </>
  );
}

export default SelectSuit;
