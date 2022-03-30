/*
    File name: otherPlayers.js
    Description: Display the back of other player's cards given the number of cards they have
*/
import React from 'react';
import Card from '../cards/card'
import ListItem from '../cards/listItem'

function OtherPlayers(props) {

    function onItemClick(id) {
    }
    let cards = function(n){
        let list = [];
        for(let i = 0; i < n; i++){
            list.push(<Card cardName = '1B'></Card>);
        }
        return list;
    };

    
    let cardList = cards(props.number);

return (
    <div>
        <ul id = {props.location}>
            {cardList.map((item,index) =>
                <ListItem index={index} item={item} onItemClick={onItemClick}  />
            )}
        </ul>    
    </div>
);
}

export default OtherPlayers
