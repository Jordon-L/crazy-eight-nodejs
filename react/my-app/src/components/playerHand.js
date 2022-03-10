import React from 'react';
import Card from './card'
import List from './cards/list'
function PlayerHand(props) {

    let cards = props.cards;
    let clicked = new Array(cards.length).fill(0);

    let cardList = cards.map(function(card, index){
        return <Card cardName ={card.fileName}></Card>;
});
    return (
        <List items={cardList}></List>
    );
}

export default PlayerHand
