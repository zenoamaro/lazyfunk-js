var consume = require('../lib/consume');
var iterate = require('../lib/iterate');

describe('iterate', function(){

	var seq = [ 1, 2, 3, 4, 5, 6 ];

	it('should convert an array to an iterator', function(){
		var coll = iterate(seq);
		coll.next.should.be.a.Function;
	});

	it('should yield every element of the original array', function(){
		var coll = iterate(seq);
		consume(coll).should.eql(seq);
	});

	it('should yield slices when stepping', function(){
		var coll = iterate(seq, 4);
		consume(coll).should.eql([ [1, 2, 3, 4], [5, 6] ]);
	});

});