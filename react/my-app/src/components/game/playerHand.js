/*
    File name: playerHands.js
    Description: Display the Player's hand given an array of Cards, save clicked on cards to be discarded
*/
import React from 'react';
import Card from '../cards/card'
import ListItem from '../cards/listItem'
import DiscardCard from './discardCard'
function PlayerHand(props) {

    function onItemClick(id) {
        clicked[id] = !clicked[id]
        console.log(clicked[id]);
    }
    let cards = props.cards;
    let clicked = new Array(cards.length).fill(false);
    let cardList = cards.map(function(card, index){
        return <Card cardName ={card.fileName}></Card>;
    });

return (
    <div>
        <DiscardCard selected ={clicked}></DiscardCard>
        <ul id = 'playerHand'>   
            {cardList.map((item,index) =>
                <ListItem index={index} item={item} onItemClick={onItemClick} />
            )}
        </ul>
    </div>
);
}

export default PlayerHand
