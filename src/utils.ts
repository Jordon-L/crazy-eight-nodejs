import Game from "./game-new";

function formatGameList(gameList: Map<Number, Game>) {
  let games = [];
  let keys = Object.keys(gameList);
  for (let i = 0; i < keys.length; i++) {
    let game = gameList.get(parseInt(keys[i]));
    if (game?.started == false) {
      let f = {
        id: keys[i],
        master: game.getRoomMaster().name,
        capacity: game.getNumOfPlayers(),
      };
      games.push(f);
    }
  }
  return games;
}

export { formatGameList };
