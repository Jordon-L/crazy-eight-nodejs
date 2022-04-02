/*
    File name: playerHands.js
    Description: Display the Player's hand given an array of Cards, save clicked on cards to be discarded
*/
import React, {useState} from 'react';
import Card from '../cards/card'
import ListItem from '../cards/listItem'
import DiscardCard from './discardCard'


function PlayerHand(props) {
    

    function onItemClick(id) {
        let index = clicked.indexOf(id);
        if(index !== -1){
            setClicked(clicked.filter(item => item !== id));
        }
        else{
            setClicked([...clicked, id]);
        }
    }
    const [clicked, setClicked] = useState([]);

    let cards = props.cards;
    let cardList = cards.map(function(card, index){
        let isClicked = false;
        let clickedPos = clicked.indexOf(index);
        return <Card index ={index} cardName ={card.fileName} clickedPos = {clickedPos} onItemClick={onItemClick}></Card>;
        
    });
  
    let spacing = "-50px";
    if(cards.length > 10){
        spacing = "-75px"
    }
    if(cards.length > 20){
        spacing = "-85px"
    }
    let style = {marginLeft: spacing}

return (
    <div id = "bottom">
        <DiscardCard selected ={clicked}></DiscardCard>
        <ul id = 'playerHand'>   
            {cardList.map((item,index) => {
                return( 
                    <ListItem index={index} item={item} spacing = {style} /> 
                )
            }
            )}
        </ul>
    </div>
);
}

export default PlayerHand
