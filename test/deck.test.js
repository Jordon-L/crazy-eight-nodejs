import Card from '../card.js';
import Deck from '../deck.js';
import { expect } from 'chai'; 
describe('new Deck()', function() {
  let deck = null;
  // add a test hook
  beforeEach(function() {
    deck = new Deck();
    deck.createDeck()    
  });

  // test a functionality
  it('create a deck of 52 cards', function() {
    // add an assertion
    expect(deck.getLength()).to.equal(52);
  });

  it('draw cards using drawNCards', function() {
    let cards = deck.drawNCards(1);
    expect(cards.length).to.equal(1);
    expect(deck.getLength()).to.equal(51);
    cards = deck.drawNCards(2);
    expect(cards.length).to.equal(2);
    expect(deck.getLength()).to.equal(49);
  });

  it('draw 1 card using drawCard', function() {
    let card = deck.drawCard();
    expect(deck.getLength()).to.equal(51);
  });


});
