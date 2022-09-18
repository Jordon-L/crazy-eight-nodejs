/*
    File name: home.js
    Description: home page of crazy eights, can login or play as guest
*/

import React,{useCallback, useContext, useEffect, useState} from 'react'
import {SocketContext} from 'context/socket';
import {Link} from "react-router-dom";
import Card from 'components/cards/card'

function Home(props){

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
            <div class="login">
              <div>
                <button>Login</button>
              </div>
              <div>
                <Link to="/game" ><button>Play as Guest</button></Link>
              </div>
            </div>
          </div>
        </div>
        
    )   
}

export default Home;