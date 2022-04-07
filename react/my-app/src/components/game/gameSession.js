/*
    File name: gameSession.js
    Description: Handles displaying the game itself
*/


import React, {useContext} from 'react';
import {GameDataContext} from 'context/gameData';
import OtherPlayers from 'components/game/otherPlayers';
import PlayerHand from 'components/game/playerHand';
import InPlay from 'components/game/inPlay';

function GameSession(props) {
    let gameData = useContext(GameDataContext);

    function cards() {
        //let bottom = gameData.players[order[0]];
        let order = displayOrder()
        let right =  gameData.players[order[1]];
        let top = gameData.players[order[2]];
        let left = gameData.players[order[3]];
        return (
            <div id = 'game'>  
                <OtherPlayers location = 'top' number = {gameData.otherHands[top.name]} name = {top.name}> </OtherPlayers>
                <OtherPlayers location = 'left' number = {gameData.otherHands[left.name]} name = {left.name}> </OtherPlayers>
                <InPlay cards = {gameData.inPlay}></InPlay>
                <OtherPlayers location = 'right' number = {gameData.otherHands[right.name]} name = {right.name} > </OtherPlayers>
                
                <PlayerHand cards = {gameData.cards} name = {gameData.name}></PlayerHand>
            </div>
        );
    }
    //bottom,right,top,left

    function displayOrder(){
        let bottom = 0;
        let order = [0,1,2,3]
        for(let i = 0; i < gameData.players.length; i++){
            let players = gameData.players;
            if(players[i].name === gameData.name){
                
                bottom = i;
                switch(bottom){
                    case 0:
                        order = [0,1,2,3];
                        break;
                    case 1:
                        order = [1,2,3,0];
                        break;
                    case 2:
                        order = [2,3,0,1];
                        break;
                    case 3:
                        order = [3,0,1,2];
                        break;
                    default:
                        order = [0,1,2,3];
                }
                break;
            }
        }
        return order;
    }

    return (
        cards()
    );
}

export default GameSession