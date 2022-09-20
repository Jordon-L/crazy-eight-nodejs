/*
    File name: joinRoom.js
    Description: Display how to join a room and how to play game
*/

import React,{useCallback, useContext, useEffect, useState} from 'react'
import {SocketContext} from 'context/socket';
import { AssessmentRounded } from '@mui/icons-material';

function Lobby(props){

    const socket = useContext(SocketContext);
    const [input, setInput] = useState(null);
    const [gameList, setGameList] = useState([]);
    function join(){
        socket.emit("join game", input);
    }
    
    function create(){
        socket.emit("create game", 'create');
    }

    function keyPress(e){
        if(e.keyCode === 13){
            join();
        }
     }
    function getGames(){
      socket.emit('game list');
    }
    function generateRow(gameId, name, gamemaster){
      return (<>
        <tr onClick={() => {
          setInput(gameId)
          join()}}>
          <td>{gameId}</td>
          <td>{name}</td>
          <td>{gamemaster}</td>
        </tr>
      </>)
    }
    const handleGamesList = useCallback((list) => {
      let newGameList = [];
      for(let i = 0; i < list.length; i++){
        let game = list[i];
        newGameList.push(game);
      }
      setGameList(newGameList);
    }, []);


    useEffect(() =>{
      getGames();
      console.log('asd');
      socket.on('game list', handleGamesList);
      return () => {
          socket.off('game list', handleGamesList);

      }
  },[]);

    return (
        <div id='home'>
          <div class='home-content'>
            <h1>Lobby</h1>
            <div class='user-input'>
              <button class="gameID-input" onClick={create}>Create New Game</button>
              <p>Enter in Game ID or select from below</p>
              <input class="gameID-input" type="text" placeholder="Enter Game ID" onChange={event => setInput(event.target.value) } onKeyDown={keyPress}></input>
              <button class="gameID-input" onClick={join}>Submit</button>
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
                  <tbody>
                    {gameList.map((game) => generateRow(game[0], game[1], game[2]))}
                  </tbody>
                </table>
              </div>
              <div class="game-join">
                <button class="gameID-input">Refresh</button>

                <button class="gameID-input">Join</button>
              </div>
            </div>
          </div>
        </div>
        
    )   
}

export default Lobby;