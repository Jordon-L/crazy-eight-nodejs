/*
    File name: clickableCard.js
    Description: Image of a clickable card given its file name. Card move up a bit when clicked
*/

import React from 'react';
import {cardPaths} from 'components/cards/cardPaths'

/*
    Card Data
    {
        suit: clover,
        rank: two,
        fileName: 2C
    }
*/

function ClickableCard(props) {
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
        displayNumber = props.clickedPos+1;

    }    
    return (
        <div className = 'cardInline'>
            {selected ? <p className = 'text'>{displayNumber}</p> : <React.Fragment></React.Fragment>}
            <img className={name} src={path.default} alt={props.cardName} onClick={handleClick}></img>
        </div>
    );
}

export default ClickableCard