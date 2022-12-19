import Game from "./game-new";
import Player from "./player-new";

class roomController {
  gameList: Map<Number,Game>;
  playerList: Map<string,Number>;
  idCounter : number;
  constructor(){
    this.idCounter = 0;
  }
  getIdCounter(){
    this.idCounter++;
    return this.idCounter;
  }
  createGame(socket: any){
    let player = new Player(socket.name, socket.id);
    
    let game = new Game(this.getIdCounter(), player);
    this.playerList.set(socket.id, game.getID());

  }
  joinGame(socket: any, id: number){
    let targetGame = this.gameList.get(id);
    let player = new Player(socket.name, socket.id);
    if(targetGame != undefined){
      targetGame?.addPlayer(player);
    }
  }
  leaveGame(socket: any, id: number){
  }
  toggleReady(){

  }
  discardCard(){

  }
  drawCard(){

  }
  selectSuit(){

  }
}

export default roomController;