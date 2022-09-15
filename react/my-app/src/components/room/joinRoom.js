/*
    File name: joinRoom.js
    Description: Display how to join a room and how to play game
*/

import React,{useCallback, useContext, useEffect, useState} from 'react'
import {SocketContext} from 'context/socket';
import MKButton from "components/materialKit/MKButton";
import Card from 'components/cards/card'

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
          <div class='home-content'>
            <h1>Crazy Eights</h1>
            <div class='home-image'>
              <Card cardName = '8S'></Card>
              <Card cardName = '8H'></Card>
              <Card cardName = '8C'></Card>
              <Card cardName = '8D'></Card>
            </div>     
            <h4> Create a new game </h4>
            <MKButton onClick = {create}> create new game</MKButton>

            <h4>Join an existing game</h4>
            <input label="Game Id" onChange={event => setInput(event.target.value) } onKeyDown={keyPress} />
            <MKButton onClick = {join}>submit</MKButton>
          </div>
        </div>
        
    )   
}

export default JoinRoom;