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
    function playAsGuest(){
        socket.emit("play as guest");
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
                <Link to="/game" ><button onClick={playAsGuest}>Play as Guest</button></Link>
              </div>
            </div>
          </div>
        </div>
        
    )   
}

export default Home;