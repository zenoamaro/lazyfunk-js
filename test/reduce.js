var reduce = require('../lib/reduce');

describe('reduce', function(){

	var seq = [ 1, 2, 3, 4 ];
	var add = function(a, b){ return a + b };
	var cat = function(arr, item){ return arr.concat(item) };

	it('should return a reducing function', function(){
		var sum = reduce(add, 0);
		sum.should.be.a.Function;
	});

	it('should reduce a sequence', function(){
		var sum = reduce(add, 0);
		sum(seq).should.eql(10);
	});

	it('should respect the starting accumulator', function(){
		var sumFromTen = reduce(add, 10);
		sumFromTen(seq).should.eql(20);
	});

	it('should use a new accumulator each time', function(){
		var shove = reduce(cat, []);
		shove(seq).should.eql(seq);
		shove(seq).should.eql(seq);
	});

});
