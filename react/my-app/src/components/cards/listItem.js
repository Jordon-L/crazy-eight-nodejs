/*
    File name: listItem.js
    Description: A clickable list item
*/

import React from 'react';

function ListItem(props) {

    let style = props.spacing;
    if(props.index == 0){
        style = {};
    }
    else{
        style = props.spacing
    }
    return (
        <li style = {style}>
            {props.item}
        </li>
    );
}

export default ListItem