import React from 'react';
import ListItem from './listItem';

function List(props) {
    function onItemClick(id) {
        console.log(id);
    }
    return (
        <ul id = 'playerHand'>
            {props.items.map(item =>
                <ListItem key={item.id} item={item} onItemClick={onItemClick} />
            )}
        </ul>
    );
}

export default List