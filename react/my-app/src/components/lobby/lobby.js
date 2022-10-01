/*
    File name: lobby.js
    Description: Join a room or create a room
*/

import React,{useCallback, useContext, useEffect, useState, useReducer} from 'react'
import {SocketContext} from 'context/socket';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Link} from "react-router-dom";
const initialState = {
  input: null,
  gameList: [],
};

function reducer(state, action) {
  let payload = action.payload;

  switch (action.type) {
    case 'gameList':
      return {
        ...state,
        gameList:payload.gameList,
      }
    default:
      throw new Error();
  }

  
}

function Lobby(props){

    const socket = useContext(SocketContext);
    const [input, setInput] = useState(null);
    const [state, dispatch] = useReducer(reducer, initialState);

    function join(){
      socket.volatile.emit("join game", input);
    }
    
    function create(){
      socket.volatile.emit("create game", 'create');
    }

    function keyPress(e){
        if(e.keyCode === 13){
            join();
        }
    }

    function getGames(){
      socket.emit('game list');
    }

    function generateRow(gameId, gamemaster, capacity){
      return (<>
        <tr onClick={() => {
          socket.emit("join game", gameId);}}>
          <td>{gameId}</td>
          <td>{gamemaster}</td>
          <td>{capacity}</td>
        </tr>
      </>)
    }

    function handleSocket(payload, type){
      return dispatch({type: type, payload: payload});
    }

    useEffect(() =>{
      getGames();
      socket.on('game list', (payload) =>  handleSocket(payload, 'gameList'));
      return () => {
        socket.removeAllListeners('game list');
      }
    },[]);

    return (
        <div id='home'>
          <div class='back-home'>
            <Link to="/" ><ArrowBackIcon></ArrowBackIcon></Link>
          </div>
          <div class='home-content'>
            <h1>Lobby</h1>
            <div class='user-input'>
              <button class="game-button-input" onClick={create}>Create New Game</button>
              <p>Enter in Game ID or select from below</p>
              <input class="game-button-input" type="text" placeholder="Enter Game ID" onChange={event => setInput(event.target.value) } onKeyDown={keyPress}></input>
              <button class="game-button-input" onClick={join}>Submit</button>
            </div>
            <div id="lobby">
              <div class="game-rooms">
                <table>
                  <thead>
                    <tr>
                      <th>Game ID</th>
                      <th>Gamemaster</th>
                      <th>Capacity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.gameList.map((game) => generateRow(game[0], game[1], game[2]))}
                  </tbody>
                </table>
              </div>
              <div class="game-join">
                <button class="game-button-input" onClick={getGames}>Refresh</button>
              </div>
            </div>
          </div>
        </div>
        
    )   
}

export default Lobby;