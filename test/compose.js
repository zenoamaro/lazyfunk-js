var compose = require('../lib/compose');

describe('compose', function(){

	var a = function(s){ return s + 'a' };
	var b = function(s){ return s + 'b' };
	var c = function(s){ return s + 'c' };

	it('should return a function', function(){
		var p = compose(function(){ /*...*/ });
		p.should.be.a.Function;
	});

	it('should compose the arguments through all functions', function(){
		var str = '';
		var expected = 'cba';
		var p = compose(a, b, c);
		p(str).should.be.exactly(expected);
	});

});