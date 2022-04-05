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
            if(props.location !== 'top'){
                list.push(<Card cardName = '1BSide' clickedPos = {-1} onItemClick={onItemClick}></Card>);
            }
            else{
                list.push(<Card cardName = '1B' clickedPos = {-1} onItemClick={onItemClick}></Card>);
            }
        }
        return list;
    };

    let cardList = cards(props.number);      
    let spacing = "-50px";
    if(props.number > 10){
        spacing = "-75px"
    }
    if(props.number > 20){
        spacing = "-85px"
    }
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
        <ul>
            
            {cardList.map((item,index) =>
                    <ListItem index={index} item={item} spacing = {style}  />
            )}
        </ul>
    </div>    
);
}

export default OtherPlayers
