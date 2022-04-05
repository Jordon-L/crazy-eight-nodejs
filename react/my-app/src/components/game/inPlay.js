/*
    File name: inPlay.js
    Description: Displays what cards were played and the draw button
*/
import React, {useContext} from 'react';
import Card from '../cards/card'
import ListItem from '../cards/listItem'
import DrawCard from './drawCard'
import DisplaySuit from './DisplaySuit'
import { GameDataContext } from '../../context/gameData';

function InPlay(props) {
    let gameData = useContext(GameDataContext);
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
            <DisplaySuit></DisplaySuit>
        </ul>
        <p>{gameData.whosTurn}'s Turn</p>
    </div>
);
}

export default InPlay
