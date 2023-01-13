import Card from '../dist/card.js';
import Game from "../dist/game-new.js";
import { expect } from "chai";
describe("new Game", function () {
  let game = null;
  let player1 = { id: 1, name: "player 1"};
  let player2 = { id: 2, name: "player 2"};
  let player3 = { id: 3, name: "player 3"};
  let player4 = { id: 4, name: "player 4"};
  function addCardsToHand(player, cards){
    let hand = game.playerHand.get(player.name);
    hand = [...hand, ...cards];
    game.playerHand.set(player.name, hand);
  }
  // add a test hook
  beforeEach(function () {
    game = new Game(1, player1);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.addPlayer(player4);
    game.ready(player1);
    game.ready(player2);
    game.ready(player3);
    game.ready(player4);
    game.gameStart(player1);

    game.currentRank = "A";
    game.currentSuit = "C";

  });

  // test a functionality
  it("play queen", function () {
    // add an assertion
    let card = new Card({rank:"Q", suit:"C"});
    addCardsToHand(player1,[card]);
    let results = game.discardCards(player1, [card]);
    expect(results).to.equal(true);
    expect(game.currentTurn).to.equal("player 3");
    expect(game.currentCard).to.include(card);
  });

  it("play two", function () {
    let card = new Card({rank:"2", suit:"C"});
    addCardsToHand(player1,[card]);
    let results = game.discardCards(player1, [card]);
    expect(results).to.equal(true);
    expect(game.twoStack).to.equal(1);
    expect(game.currentTurn).to.equal("player 2");
    expect(game.currentCard).to.include(card);
    
  });

  it("play ace", function () {
    let card = new Card({rank:"A", suit:"C"});
    addCardsToHand(player1,[card]);
    let results = game.discardCards(player1, [card]);
    expect(results).to.equal(true);

    expect(game.currentTurn).to.equal("player 4");
    expect(game.currentCard).to.include(card);
  });

  it("play eight", function () {
    let card = new Card({rank:"8", suit:"H"});
    addCardsToHand(player1,[card]);
    let results = game.discardCards(player1, [card]);
    expect(results).to.equal(true);

    game.changeSuit("D");
    expect(game.currentSuit).to.equal("D");
    expect(game.currentTurn).to.equal("player 2");
    expect(game.currentCard).to.include(card);
  });

  it("play same rank", function (){
    let card = new Card({rank:"A", suit:"H"});
    addCardsToHand(player1,[card]);
    let results = game.discardCards(player1, [card]);
    expect(results).to.equal(true);
  });

  it("more invalid plays", function (){
    let card = new Card({rank:"10", suit:"H"});
    let card2 = new Card({rank:"8", suit:"H"});
    let card3 = new Card("8", "C");
    addCardsToHand(player1,[card,card2,card3]);
    let results = game.discardCards(player1, [card, card2]);
    expect(results).to.equal(false);

    results = game.discardCards(player1, [card, card2]);
    expect(results).to.equal(false);
  });

  it("play two with two stack", function () {
    //player1
    let card1 = new Card({rank:"2", suit:"C"});
    addCardsToHand(player1,[card1]);
    let results = game.discardCards(player1, [card1]);
    expect(results).to.equal(true);
    expect(game.twoStack).to.equal(1);
    expect(game.currentTurn).to.equal("player 2");
    expect(game.currentCard).to.include(card1);

    //player2
    let card2 = new Card({rank:"2", suit:"H"});
    let card3 = new Card({rank:"2", suit:"S"});
    addCardsToHand(player2,[card2,card3]);
    results = game.discardCards(player2, [card2,card3]);
    expect(results).to.equal(true);
    expect(game.twoStack).to.equal(3);
    expect(game.currentTurn).to.equal("player 3");
    expect(game.currentCard).to.include.members([card2,card3]);
    expect(game.discardPile).to.include(card1);
  });

  it("check invalid play", function () {
    let card1 = new Card({rank:"2", suit:"H"});
    let card2 = new Card({rank:"3", suit:"H"});
    addCardsToHand(player1,[card1,card2]);
    let results = game.discardCards(player1, [card1]);
    expect(results).to.equal(false);

    results = game.discardCards(player1, [card2]);
    expect(results).to.equal(false); 

    results = game.discardCards(player1, [card1,card2]);
    expect(results).to.equal(false);

    results = game.discardCards(player1, [card2,card1]);
    expect(results).to.equal(false);
  });

  it("check valid play for 2+ cards", function () {
    let card1 = new Card({rank:"3", suit:"C"});
    let card2 = new Card({rank:"3", suit:"H"});
    addCardsToHand(player1,[card1,card2]);
    console.log(game.currentSuit);
    let results = game.isValidPlay([card1,card2]);
    expect(results).to.equal(true);
    results = game.isValidPlay([card2, card1]);
    expect(results).to.equal(true);
  });

  it("play 2 eights with different suit than what is in play", function () {
    let card1 = new Card({rank:"8", suit:"S"});
    let card2 = new Card({rank:"8", suit:"H"});
    let results = game.isValidPlay([card1, card2]);
    expect(results).to.equal(false);
    results = game.isValidPlay([card2, card1]);
    expect(results).to.equal(false);
  });

  // ...some more tests
});
