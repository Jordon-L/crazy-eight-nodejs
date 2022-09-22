/*
    File name: discardCard.js
    Description: button to discard selected cards
*/

import React, {useContext} from 'react';
import {SocketContext} from 'context/socket';
import {GameDataContext} from 'context/gameData';
import DiscardCard from 'components/game/discardCard';
import SelectSuit from 'components/game/selectSuit';

function PlayerActions(props) {
    let socket = useContext(SocketContext);
    let gameData = useContext(GameDataContext).state;
    
    let isDisabled = !gameData.turn;
    let show = gameData.showSelectSuit;
    return (
        show ?  <SelectSuit></SelectSuit>:<DiscardCard selected ={props.selected} setSelected = {props.setSelected}></DiscardCard>
    );
}

export default PlayerActions