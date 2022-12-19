import Card from "../card.js";
import Deck from "../deck.js";
import Game from "../game.js";
import { createPlayer } from "../player.js";
import { expect } from "chai";
describe("new Game()", function () {
  let game = null;
  // add a test hook
  beforeEach(function () {
    game = new Game();
    let player1 = createPlayer("player 1", 1);
    let player2 = createPlayer("player 2", 2);
    let player3 = createPlayer("player 3", 3);
    let player4 = createPlayer("player 4", 4);
    game.players[player1.name] = player1;
    game.players[player2.name] = player2;
    game.players[player3.name] = player3;
    game.players[player4.name] = player4;
    game.playerSocketIds[player1.name] = "100";
    game.playerSocketIds[player2.name] = "101";
    game.playerSocketIds[player3.name] = "102";
    game.playerSocketIds[player4.name] = "103";
    game.numOfPlayers = 4;
    game.whosTurn = "player 1";
    let card = new Card("A", "C");
    game.currentSuit = "C";
    game.currentlyInPlay = [card];
  });

  // test a functionality
  it("play queen", function () {
    // add an assertion
    let card = new Card("Q", "C");
    let valid = game.isValidPlay([card]);
    expect(valid).to.equal(true);
    game.discardCards([card]);
    expect(game.whosTurn).to.equal("player 3");
    expect(game.discardPile[0]).to.equal(card);
  });

  it("play two", function () {
    let card = new Card("2", "C");
    let valid = game.isValidPlay([card]);
    expect(valid).to.equal(true);
    game.discardCards([card]);
    expect(game.twoStack).to.equal(1);
    expect(game.whosTurn).to.equal("player 2");
    expect(game.discardPile[0]).to.equal(card);
  });

  it("play ace", function () {
    let card = new Card("A", "C");
    let valid = game.isValidPlay([card]);
    expect(valid).to.equal(true);
    game.discardCards([card]);
    expect(game.whosTurn).to.equal("player 4");
    expect(game.discardPile[0]).to.equal(card);
  });

  it("play eight", function () {
    let card = new Card("8", "H");
    let valid = game.isValidPlay([card]);
    expect(valid).to.equal(true);

    game.discardCards([card]);
    game.changeSuit("C");
    expect(game.currentSuit).to.equal("C");
    expect(game.whosTurn).to.equal("player 2");
    expect(game.discardPile[0]).to.equal(card);
  });

  it("play same rank", function (){
    let card = new Card("A", "H");
    let valid = game.isValidPlay([card]);
    expect(valid).to.equal(true);
  });

  it("play same suit", function (){
    let card = new Card("10", "C");
    let valid = game.isValidPlay([card]);
    expect(valid).to.equal(true);
  });

  it("more invalid plays", function (){
    let card1 = new Card("10", "C");
    let card2 = new Card("9", "C");
    let valid = game.isValidPlay([card1, card2]);
    expect(valid).to.equal(false);


    let card3 = new Card("8", "C");
    valid = game.isValidPlay([card1, card3]);
    expect(valid).to.equal(false);
  });

  it("play two with two stack", function () {
    //set up
    let twoCard = new Card("2", "C");
    game.discardCards([twoCard]);
    expect(game.twoStack).to.equal(1);
    expect(game.whosTurn).to.equal("player 2");

    let card1 = new Card("2", "H");
    let valid = game.isValidPlay([card1]);
    expect(valid).to.equal(true);
    let card2 = new Card("2", "S");
    valid = game.isValidPlay([card1, card2]);
    game.discardCards([card1, card2]);

    expect(game.twoStack).to.equal(3);
    expect(game.whosTurn).to.equal("player 3");
    expect(game.discardPile[1]).to.equal(card1);
    expect(game.discardPile[2]).to.equal(card2);
  });

  it("check invalid play", function () {
    let card1 = new Card("2", "H");
    let valid = game.isValidPlay([card1]);
    expect(valid).to.equal(false);
    let card2 = new Card("3", "H");
    valid = game.isValidPlay([card1, card2]);
    expect(valid).to.equal(false);
  });

  it("check valid play for 2+ cards", function () {
    let card1 = new Card("3", "C");
    let card2 = new Card("3", "H");
    let valid = game.isValidPlay([card1, card2]);
    expect(valid).to.equal(true);
    valid = game.isValidPlay([card2, card1]);
    expect(valid).to.equal(true);
  });

  it("play 2 eights with different suit than what is in play", function () {
    let card1 = new Card("8", "S");
    let card2 = new Card("8", "H");
    let valid = game.isValidPlay([card1, card2]);
    expect(valid).to.equal(true);
    valid = game.isValidPlay([card2, card1]);
    expect(valid).to.equal(true);
  });

  // ...some more tests
});
