import Game from './game-new'
import Player from './player-new';
import roomController from './roomController';

abstract class Action {
  constructor(){

  }
  abstract execute(player: Player, roomController: roomController) : void;
}

class discardAction extends Action {
  constructor(){
    super();
  }
  execute(player: Player, roomController: roomController): void {
      
  }
}

class drawAction extends Action {
  constructor(){
    super();
  }
  execute(player: Player, roomController: roomController): void {
      
  }
}

class selectSuitAction extends Action {
  constructor(){
    super();
  }
  execute(player: Player, roomController: roomController): void {
      
  }
}



class ActionHandler{
  roomController : roomController;
  actions: Map<string, Action>;
  constructor(){
    this.actions.set("discard", new discardAction());
    this.actions.set("draw", new drawAction());
    this.actions.set("selectSuit", new selectSuitAction());
  }

  executeAction(command: string, player: Player){
    let action = this.actions.get(command);
    action?.execute(player, this.controller)
    
  }
}
export default ActionHandler;