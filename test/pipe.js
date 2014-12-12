var pipe = require('../lib/pipe');

describe('pipe', function(){

	var a = function(s){ return s + 'a' };
	var b = function(s){ return s + 'b' };
	var c = function(s){ return s + 'c' };

	it('should return a function', function(){
		var p = pipe(function(){});
		p.should.be.a.Function;
	});

	it('should pipe the arguments through all functions', function(){
		var str = '';
		var expected = 'abc';
		var p = pipe(a, b, c);
		p(str).should.be.exactly(expected);
	});

});