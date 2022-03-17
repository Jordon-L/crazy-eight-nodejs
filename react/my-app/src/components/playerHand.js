import React from 'react';
import Card from './card'
import ListItem from './cards/listItem'
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
    <ul id = 'playerHand'>
        {cardList.map((item,index) =>
            <ListItem index={index} item={item} onItemClick={onItemClick} />
        )}
    </ul>
    <DiscardCard selected = {clicked}></DiscardCard>    
    </div>
);
}

export default PlayerHand
