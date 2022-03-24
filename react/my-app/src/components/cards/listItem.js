import React from 'react';

function ListItem(props) {

    function handleClick() {
        props.onItemClick(props.index);
    }
    return (
        <li onClick={handleClick} style = {{position: 'absolute', left:(props.spacing * props.index) }} >
            {props.item}
        </li>
    );
}

export default ListItem