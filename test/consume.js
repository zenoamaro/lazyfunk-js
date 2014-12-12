var consume = require('../lib/consume');

describe('consume', function(){

	function* iterator() {
		for (var i=0; i<5; i++) {
			yield i;
		}
	}

	it('should convert an iterator to an array', function(){
		var seq = consume(iterator());
		seq.should.be.an.Array.and.not.be.empty;
	});

	it('should yield every element from the iterator', function(){
		var seq = consume(iterator());
		seq.should.eql([ 0, 1, 2, 3, 4 ]);
	});

	it('should yield every element up to a limit', function(){
		var seq = consume(iterator(), 2);
		seq.should.eql([ 0, 1 ]);
	});

});