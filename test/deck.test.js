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

  it('insert 1 card', function() {
    let card = new Card("ace", "club", "ace club");
    deck.insertCard(card);
    expect(deck.getLength()).to.equal(53);
  });

  it('insert multiple(discard pile) card', function() {
    let card1 = new Card("ace", "club", "ace club");
    let card2 = new Card("ace", "heart", "ace heart");
    let discardPile = [card1,card2];
    deck.insertDiscardPile(discardPile);
    expect(deck.getLength()).to.equal(54);
  });

  it('draw some cards then insert them back in the deck', function() {
    let cards = deck.drawNCards(4);
    expect(cards.length).to.equal(4);
    expect(deck.getLength()).to.equal(48);
    let discardPile = [...cards];
    deck.insertDiscardPile(discardPile);
    expect(deck.getLength()).to.equal(52);
  });

  it('shuffle deck', function(){
    let copyDeck = [...deck.cards]
    deck.shuffle();
    //deck is considered shuffled if atleast 50% of the cards are not in the same order
    let count = 0;
    for(let i = 0; i < deck.getLength(); i++){
      if(deck.cards[i] != copyDeck[i]){
        count++;
      }
    }
    expect(count).to.greaterThanOrEqual(deck.getLength()/2);
  });

});
