/*
    File name: joinRoom.js
    Description: Display how to join a room and how to play game
*/

import React,{useCallback, useContext, useEffect, useState} from 'react'
import {SocketContext} from 'context/socket';
import MKButton from "components/materialKit/MKButton";
function JoinRoom(props){

    const socket = useContext(SocketContext);
    const [input, setInput] = useState(null);
    
    function join(){
        socket.emit("join game", input);
    }
    function create(){
        socket.emit("create game", 'create');
    }

    function keyPress(e){
        if(e.keyCode == 13){
            join();
        }
     }
    return (
        <div id='home'>
            <h1>Crazy Eights</h1>
            <h4> How to start playing </h4>
            <ol>
                <li>Create a new game or join existing game through a game Id</li>
                <li>Give others the game Id</li>
            </ol>
            <h4>Rules</h4>
            <ol>
                <li>Can only play a card of the same rank or same suit of the card in the middle.</li>
                <li>Multiple cards of the same rank can be played at once as long as the first card played is of the same rank or same suit of the card in the middle.</li>
                <li>Eight can be played regardless of rank or suit and allows the player who played an eight to change the current suit.</li>
                <li>A player must play a card during their turn, they will draw cards from the deck until they can</li>
                <li>A player can only draw cards if they cannot play anything from their hand</li>
                <li>Special cards</li>
                <ol>
                    <li>Ace, reverses the direction of play.</li>
                    <li>Queen, skip next player's turn.</li>
                    <li>Two, next player picks up two cards. If the next player has a two they can play it then the player after them will pick up four cards, then six cards, then eight cards. </li>
                </ol>
            </ol>            
            <h4> Create a new game </h4>
            <MKButton onClick = {create}> create new game</MKButton>

            <h4>Join an existing game</h4>
            <input label="Game Id" onChange={event => setInput(event.target.value) } onKeyDown={keyPress} />
            <MKButton onClick = {join}>submit</MKButton>
        </div>
        
    )   
}

export default JoinRoom;