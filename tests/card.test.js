import Card from '../dist/card.js';
import { expect } from 'chai'; 
describe('new Card()', function() {

  // add a test hook
  beforeEach(function() {
    
  })

  // test a functionality
  it('return back inputted arguments', function() {
    // add an assertion
    let card = new Card({rank:"A", suit:"C"});
    expect(card.rank).to.equal("A");
    expect(card.suit).to.equal("C");
    expect(card.fileName).to.equal("AC");
  })

  // ...some more tests

})
