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
        let index = clicked.indexOf(id);
        console.log(id, clicked)
        if(index !== -1){
            clicked.splice(index,1);
        }
        else{
            clicked.push(id);
        }
        console.log(id, clicked)
    }
    let cards = props.cards;
    let clicked = [];
    let cardList = cards.map(function(card, index){
        return <Card cardName ={card.fileName}></Card>;
    });

return (
    <div >
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
