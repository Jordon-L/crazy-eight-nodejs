import Game from "./game-new.js";
import Player from "./player-new.js";

function formatGameList(gameList: Game[]) {
  let games = [];
  let keys = Object.keys(gameList);
  for (let i = 0; i < keys.length; i++) {
    let game = gameList[i];
    if (game?.started == false) {
      let master = game.getRoomMaster() as Player;
      let f = {
        id: game.getID().toString(),
        master: master.name,
        capacity: game.getNumOfPlayers(),
      };
      games.push(f);
    }
  }
  return games;
}

function createMessage(message: string){
  return {message: message};
}
export { formatGameList, createMessage};
