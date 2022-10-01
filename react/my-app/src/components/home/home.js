/*
    File name: home.js
    Description: home page of crazy eights
*/

import React from 'react'
import {Link} from "react-router-dom";
import Card from 'components/cards/card'


function Home(props){


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
              <Link to="/rules" ><button>How to Play</button></Link>
              </div>
              <div>
                
                <Link to="/game" ><button>Play</button></Link>
              </div>
            </div>
          </div>
        </div>
        
    )   
}

export default Home;