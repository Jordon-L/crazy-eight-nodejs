import React from 'react';

function ListItem(props) {

    function handleClick() {
        props.onItemClick(props.index);
    }

    return (
        <li onClick={handleClick}>
            {props.item}
        </li>
    );
}

export default ListItem