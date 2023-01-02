import Game from "./game-new.js";

function formatGameList(gameList: Game[]) {
  let games = [];
  let keys = Object.keys(gameList);
  for (let i = 0; i < keys.length; i++) {
    let game = gameList[i];
    if (game?.started == false) {
      let f = {
        id: game.getID().toString(),
        master: game.getRoomMaster(),
        capacity: game.getNumOfPlayers(),
      };
      games.push(f);
    }
  }
  return games;
}

function errorMessage(message: string){
  return {message: message};
}
export { formatGameList, errorMessage};
