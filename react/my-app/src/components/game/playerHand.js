/*
    File name: playerHand.js
    Description: Display the Player's hand given an array of Cards, save clicked on cards to be discarded
*/
import React, {useState} from 'react';
import ClickableCard from 'components/cards/clickableCard'
import ListItem from 'components/cards/listItem'
import PlayerActions from './playerActions';
import PlayerInfo from 'components/game/playerInfo'

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
        let clickedPos = clicked.indexOf(index);
        return <ClickableCard index ={index} cardName ={card.fileName} clickedPos = {clickedPos} onItemClick={onItemClick}></ClickableCard>;
        
    });
  
    let spacing = "-50px";
    let style = {marginLeft: spacing}

return (
    <div id = "bottom">
        <div>
          <PlayerInfo {...props} ></PlayerInfo>
        </div>
        <PlayerActions selected ={clicked} setSelected = {setClicked}></PlayerActions>
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
