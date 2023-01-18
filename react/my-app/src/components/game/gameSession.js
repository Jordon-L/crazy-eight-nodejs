/*
    File name: gameSession.js
    Description: Handles displaying the game itself
*/


import React, {useContext} from 'react';
import {GameDataContext} from 'context/gameData';
import OtherPlayers from 'components/game/otherPlayers';
import PlayerHand from 'components/game/playerHand';
import InPlay from 'components/game/inPlay';
import { object } from 'prop-types';

function GameSession(props) {
    let gameData = useContext(GameDataContext).state;
    
    function cards() {
        //let bottom = gameData.players[order[0]];
        let names =  Object.keys(gameData.otherHands);
        
        let index = indexOfPlayer(names);
        names = names.filter(e => e !== gameData.playerName);
        let n = names.length;
        let right =  undefined;
        let top = undefined;
        let left = undefined;
        if(n >= 1){
          right =  names[(index % n + n) % n];
        }
        if(n >= 2){
          top = names[((index+1) % n + n) % n];
        }
        if(n >= 3){
          left = names[((index+2) % n + n) % n];
        }
        return (
            <div id = 'game'>
                <div class='row'>
                  <div class='column'>
                    {top ? <OtherPlayers location = 'top' number = {gameData.otherHands[top]} name = {top} turn = {gameData.whosTurn === top}> </OtherPlayers> : <></>}
                  </div>
                </div> 
                <div class='row row-middle'>
                  <div class='column column-left'>
                    {left ? <OtherPlayers location = 'left' number = {gameData.otherHands[left]} name = {left} turn = {gameData.whosTurn === left}> </OtherPlayers>  : <></>}         
                  </div>
                  <div class='column column-center'>
                    <InPlay cards = {gameData.inPlay}></InPlay>
                  </div>
                  <div class='column column-right'>
                    {right ? <OtherPlayers location = 'right' number = {gameData.otherHands[right]} name = {right} turn = {gameData.whosTurn === right}> </OtherPlayers> : <></>}      
                  </div>                  
                </div>                  
                <div class='row'>
                  <div class='column'>
                    <PlayerHand number = {gameData.playerHand.length} cards = {gameData.playerHand} name = {gameData.playerName} turn = {gameData.whosTurn === gameData.playerName}></PlayerHand>
                  </div>
                </div> 
                
                
            </div>
        );
    }
    //bottom,right,top,left

    function indexOfPlayer(names){
        let index = names.indexOf(gameData.playerName);
        return index;
    }

    return (
        cards()
    );
}

export default GameSession