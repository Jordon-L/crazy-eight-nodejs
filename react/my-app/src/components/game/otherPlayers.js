/*
    File name: otherPlayers.js
    Description: Display the back of other player's cards given the number of cards they have
*/
import React from "react";
import Card from "components/cards/card";
import ListItem from "components/cards/listItem";
import PlayerInfo from "components/game/playerInfo";

function OtherPlayers(props) {
  function onItemClick(id) {}
  let cards = function (n) {
    let list = [];
    for (let i = 0; i < n; i++) {
      if (props.location !== "top") {
        list.push(
          <Card
            cardName="1BSide"
            clickedPos={-1}
            onItemClick={onItemClick}
          ></Card>
        );
      } else {
        list.push(
          <Card cardName="1B" clickedPos={-1} onItemClick={onItemClick}></Card>
        );
      }
    }
    return list;
  };
  let number = props.number;
  if (props.number > 8) {
    number = 8;
  }
  let cardList = cards(number);

  let spacing = "-50px";

  let style = {};
  if (props.location !== "top") {
    style = { marginTop: spacing };
  } else {
    style = { marginLeft: spacing };
  }

  function Display() {
    if (props.location === "top") {
      return (
        <div id={props.location}>
          <ul>
            {cardList.map((item, index) => (
              <ListItem index={index} item={item} spacing={style} />
            ))}
          </ul>
          <PlayerInfo {...props}></PlayerInfo>
        </div>
      );
    } else {
      return (
        <div id={props.location}>
          <PlayerInfo {...props}></PlayerInfo>
          <ul>
            {cardList.map((item, index) => (
              <ListItem index={index} item={item} spacing={style} />
            ))}
          </ul>
        </div>
      );
    }
  }
  return <Display></Display>;
}

export default OtherPlayers;
