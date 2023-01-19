/*
    File name: inPlay.js
    Description: Displays what cards were played and the draw button
*/
import React, { useContext } from "react";
import Card from "components/cards/card";
import ListItem from "components/cards/listItem";
import DrawCard from "components/game/drawCard";
import DisplaySuit from "components/game/displaySuit";
import { GameDataContext } from "context/gameData";

function InPlay(props) {
  let gameData = useContext(GameDataContext).state;
  function onItemClick(id) {}
  let cards = props.cards;
  let cardList = cards.map(function (card, index) {
    return <Card cardName={card.fileName}></Card>;
  });

  return (
    <div id="inPlay">
      <ul>
        <DrawCard></DrawCard>
      </ul>
      <ul class="discard-pile">
        {cardList.map((item, index) => (
          <ListItem index={index} item={item} onItemClick={onItemClick} />
        ))}
      </ul>
      <div class="info">
        <DisplaySuit></DisplaySuit>
        <p>{gameData.whosTurn}'s Turn</p>
        <p class="message"> {gameData.message}</p>
        <p class="message"> {gameData.specialMessage} </p>
      </div>
    </div>
  );
}

export default InPlay;
