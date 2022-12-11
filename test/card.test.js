import Card from '../card.js';
import { expect } from 'chai'; 
describe('new Card()', function() {

  // add a test hook
  beforeEach(function() {
    
  })

  // test a functionality
  it('return back inputted arguments', function() {
    // add an assertion
    let card = new Card("ace", "club", "ace club");
    expect(card.rank).to.equal("ace");
    expect(card.suit).to.equal("club");
    expect(card.fileName).to.equal("ace club");
  })

  // ...some more tests

})
