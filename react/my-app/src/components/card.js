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
    let path = cardPaths[`./${props.cardName}.svg`];
    return (
        <img src={path} alt={props.cardName}></img>
    )
}

export default Card