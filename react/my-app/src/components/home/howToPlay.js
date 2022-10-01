/*
    File name: howToPlay.js
    Description: page for rules of crazy eights
*/

import React from 'react'
import {Link} from "react-router-dom";

function HowToPlay(props){


    return (
        <div id='home'>
          <div class='home-content'>
            <h1>How To Play</h1>
            <div class='instructions'>
              <h3>Basic Rules</h3>
              <p>A player must discard at least one card per turn.</p>
              <p>The following plays allowed are: same suit or same number of the card on top of the discard pile. Eight is allowed anytime.</p>

              <h3>If you can’t play any card</h3>
              <p>If you don't have any valid plays, then you must draw cards from the deck until you have a valid play.</p>

              <h3>Special Cards</h3>
              <p>Ace: reverse the direction of play.</p>
              <p>Queen: skip the next player's turn.</p>
              <p>Two: next player picks up 2 cards from the deck.</p>
              <p>Eight: wild card, can be played anytime, and ability to select the suit.</p>

              <h3>Additional Rules</h3>
              <p>You can play more than one card if as long first card is a vaSlid play and the second card is the same number as the first card.</p>
              <p>If a Two is played, the next player can play a Two. The first player that can't play a Two is forced to draw cards for each Two in the sequence.</p>

            </div>
            <div class="login">
              <div>
                <Link to="/" ><button>Go Back</button></Link>
              </div>
            </div>
          </div>
        </div>
        
    )   
}

export default HowToPlay;