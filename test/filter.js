var consume = require('../lib/consume');
var filter = require('../lib/filter');

describe('filter', function(){

	var seq = [ 0, 1, 2, 3, 4, 5, 6, 7 ];
	var all = filter(function(item){ return true });
	var none = filter(function(item){ return false });
	var evens = filter(function(item){ return item % 2 === 0 });

	it('should return an filter function', function(){
		all.should.be.a.Function;
		all(seq).next.should.be.a.Function;
	});

	it('should filter a sequence', function(){
		consume(all(seq)).should.eql(seq);
		consume(none(seq)).should.eql([]);
		consume(evens(seq)).should.eql([ 0, 2, 4, 6 ]);
	});

});