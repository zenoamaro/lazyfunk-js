var consume = require('../lib/consume');
var map = require('../lib/map');

describe('map', function(){

	var seq = [ 0, 1, 2, 3 ];
	var pass = map(function(item){ return item });
	var triple = map(function(item){ return item * 3 });

	it('should return an mapping function', function(){
		pass.should.be.a.Function;
		pass(seq).next.should.be.a.Function;
	});

	it('should map a sequence to another', function(){
		consume(pass(seq)).should.eql(seq);
		consume(triple(seq)).should.eql([ 0, 3, 6, 9 ]);
	});

});