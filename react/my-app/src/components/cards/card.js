/*
    File name: card.js
    Description: Image of a card given its file name.
*/

import React, {render} from 'react';
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
    let name = '';
    let displayNumber = 0;
    let selected = false;
    if(props.clickedPos !== -1){
        name = 'selected'
        selected = true;
        displayNumber = props.clickedPos

    }    
    return (
        <div className = 'cardInline'>
            {selected ? <p className = 'text'>{displayNumber}</p> : <React.Fragment></React.Fragment>}
            <img className={name} src={path} alt={props.cardName} onClick={handleClick}></img>
        </div>
    );
}

export default Card