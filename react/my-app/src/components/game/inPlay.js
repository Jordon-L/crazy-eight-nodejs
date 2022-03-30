/*
    File name: inPlay.js
    Description: Displays what cards were played and the draw button
*/
import React from 'react';
import Card from '../cards/card'
import ListItem from '../cards/listItem'
import DrawCard from './drawCard'

function InPlay(props) {

    function onItemClick(id) {

    }
    let cards = props.cards;
    let cardList = cards.map(function(card, index){
        return <Card cardName ={card.fileName}></Card>;
    });

return (
    <div id = 'inPlay'>
        <DrawCard></DrawCard>
        <ul>   
            {cardList.map((item,index) =>
                <ListItem index={index} item={item} onItemClick={onItemClick} />
            )}
        </ul>
    </div>
);
}

export default InPlay
