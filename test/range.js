var consume = require('../lib/consume');
var range = require('../lib/range');

describe('range', function(){

	it('should return an iterator', function(){
		var r = range(0, 5);
		r.next.should.be.a.Function;
	});

	it('should produce a range of numbers', function(){
		var seq = consume(range(0, 5));
		seq.should.not.be.empty;
		seq.forEach(function(n){ n.should.be.a.Number });
	});

	it('should produce a range from start to end exclusive', function(){
		var seq = consume(range(2, 5));
		seq.should.eql([ 2, 3, 4 ]);
	});

	it('should produce a range with given step', function(){
		var seq = consume(range(3, 10, 2));
		seq.should.eql([ 3, 5, 7, 9 ]);
	});

	it('should not produce an empty range', function(){
		var seq = consume(range(2, 2));
		seq.should.be.empty;
	});

});