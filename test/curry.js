var curry = require('../lib/curry');

describe('curry', function(){

	function sum3(a, b, c) {
		return a + b + c;
	}

	it('should return a function', function(){
		var curried = curry(function(){ /*...*/ });
		curried.should.be.a.Function;
	});

	it('should curry arguments until satisfied', function(){
		var probe = curry(sum3);
		var result = probe(1)(2)(3);
		result.should.be.exactly(6);
	});

	it('should curry multiple arguments at once', function(){
		var probe = curry(sum3);
		probe(1, 2)(3).should.be.exactly(6);
		probe(1)(2, 3).should.be.exactly(6);
	});

	it('should curry overflowing arguments', function(){
		var probe = curry(sum3);
		probe(1)(2, 3, 4).should.be.exactly(6);
		probe(1, 2)(3, 4).should.be.exactly(6);
		probe(1, 2, 3, 4).should.be.exactly(6);
	});

});