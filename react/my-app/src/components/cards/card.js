/*
    File name: card.js
    Description: Image of a card given its file name.
*/

import React from 'react';
import {cardPaths} from './cardPaths'

/*
    Card Data
    {
        suit: clover,
        rank: two,
        fileName: 2C
    }
*/

function Card(props) {
    function handleClick() {
        props.onItemClick(props.index);
    }
    let path = cardPaths[`./${props.cardName}.svg`];
    return (
        <img src={path} alt={props.cardName} onClick={handleClick}></img>
    );
}

export default Card