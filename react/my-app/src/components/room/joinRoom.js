/*
    File name: joinRoom.js
    Description: Display how to join a room and how to play game
*/

import React,{useCallback, useContext, useEffect, useState} from 'react'
import {SocketContext} from '../../context/socket';

function JoinRoom(props){

    const socket = useContext(SocketContext);
    const [input, setInput] = useState(null);
    
    function join(){
        console.log(input)
        socket.emit("join game", input);
    }
    function create(){
        socket.emit("create game", 'create');
    }
    return (
        <div>
            <h1>Crazy Eight</h1>
            <h3> How to play </h3>
            <ol>
                <li>Create a new game</li>
                <li>Give others the game id</li>
                <li>Join game through the game id</li>
            </ol>
            <h4> Create a new Game </h4>
            <button onClick = {create}> create new game</button>

            <h4>Join an existing game</h4>
            <label>
                Room Id:
                <input type="text" onChange={event => setInput(event.target.value)} />
            </label>
            <button onClick = {join}>submit</button>
        </div>
        
    )   
}

export default JoinRoom;