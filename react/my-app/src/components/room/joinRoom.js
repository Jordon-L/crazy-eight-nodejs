/*
    File name: joinRoom.js
    Description: Display how to join a room and how to play game
*/

import React,{useCallback, useContext, useEffect, useState} from 'react'
import {SocketContext} from 'context/socket';
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
            <h1>Lobby</h1>
            <div class='user-input'>
              <button class="gameID-input">Create New Game</button>
              <p>Enter in Game ID or select from below</p>
              <input class="gameID-input" type="text" placeholder="Enter Game ID"></input>
              <input type="submit"></input>
            </div>
            <div id="lobby">
              <div class="game-rooms">
                <table>
                    <thead>
                      <tr>
                        <th>Game ID</th>
                        <th>Room name</th>
                        <th>Gamemaster</th>
                      </tr>
                    </thead>
                  </table>
                  <div class="inner-table">
                    <tr>
                      <td>Alfreds Futterkiste</td>
                      <td>Maria Anders</td>
                      <td>Maria Anders</td>
                    </tr>
                    <tr>
                      <td>Centro comercial Moctezuma</td>
                      <td>Francisco Chang</td>
                      <td>Maria AndersMaria AnderMaria AnderMaria AnderMaria AnderMaria AnderMaria Ander</td>
                    </tr>
                    <tr>
                      <td>Alfreds Futterkiste</td>
                      <td>Maria Anders</td>
                      <td>Maria Anders</td>
                    </tr>
                    <tr>
                      <td>Centro comercial Moctezuma</td>
                      <td>Francisco Chang</td>
                      <td>Maria AndersMaria AnderMaria AnderMaria AnderMaria AnderMaria AnderMaria Ander</td>
                    </tr>
                    <tr>
                      <td>Alfreds Futterkiste</td>
                      <td>Maria Anders</td>
                      <td>Maria Anders</td>
                    </tr>
                    <tr>
                      <td>Centro comercial Moctezuma</td>
                      <td>Francisco Chang</td>
                      <td>Maria AndersMaria AnderMaria AnderMaria AnderMaria AnderMaria AnderMaria Ander</td>
                    </tr>
                    <tr>
                      <td>Alfreds Futterkiste</td>
                      <td>Maria Anders</td>
                      <td>Maria Anders</td>
                    </tr>
                    <tr>
                      <td>Centro comercial Moctezuma</td>
                      <td>Francisco Chang</td>
                      <td>Maria AndersMaria AnderMaria AnderMaria AnderMaria AnderMaria AnderMaria Ander</td>
                    </tr>
                    <tr>
                      <td>Alfreds Futterkiste</td>
                      <td>Maria Anders</td>
                      <td>Maria Anders</td>
                    </tr>
                    <tr>
                      <td>Centro comercial Moctezuma</td>
                      <td>Francisco Chang</td>
                      <td>Maria AndersMaria AnderMaria AnderMaria AnderMaria AnderMaria AnderMaria Ander</td>
                    </tr>
                  </div>           
              </div>
              <div class="game-join">

              </div>
            </div>
          </div>
        </div>
        
    )   
}

export default JoinRoom;