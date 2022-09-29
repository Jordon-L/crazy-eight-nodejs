/*
    File name: otherPlayers.js
    Description: Display the back of other player's cards given the number of cards they have
*/
import React from 'react';
import Card from 'components/cards/card'
import ListItem from 'components/cards/listItem'

function OtherPlayers(props) {

    function onItemClick(id) {
    }
    let cards = function(n){
        let list = [];
        for(let i = 0; i < n; i++){
            if(props.location !== 'top'){
                list.push(<Card cardName = '1BSide' clickedPos = {-1} onItemClick={onItemClick}></Card>);
            }
            else{
                list.push(<Card cardName = '1B' clickedPos = {-1} onItemClick={onItemClick}></Card>);
            }
        }
        return list;
    };
    let number = props.number;
    if(props.number > 8){
      number = 8;
    }
    let cardList = cards(number);
    
    let spacing = "-50px";

    let style = {};
    if(props.location !== 'top'){
        style = {marginTop: spacing}
    }
    else{
        style = {marginLeft: spacing}
    }
return (
    <div id = {props.location}>  
        <p> {props.name} </p>
        <div class='numberCard'>{props.number}</div>
        <ul>
            
            {cardList.map((item,index) =>
                    <ListItem index={index} item={item} spacing = {style}  />
            )}
        </ul>
    </div>    
);
}

export default OtherPlayers
