import * as React from 'react';


function PlayerInfo(props) {

  function Name(){
    if(props.turn){
      return <p class="playerName highlight"> {props.name} </p>
    }
    return <p class="playerName"> {props.name} </p>
  }

  return (
    <>
      <div>
        <Name></Name>
        <div class='numberCard'>{props.number}</div>
      </div>
    </>
    
  );
}

export default PlayerInfo;