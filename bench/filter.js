var Suite = require('./suite');
var iterate = require('../lib/iterate');
var consume = require('../lib/consume');
var filter = require('../lib/filter');

var sequence = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
var isEven = function(n){ return n % 2 === 0 };
var onlyEven = filter(isEven);
var iterable;

Suite({

	'name': 'Filter',

	'setup': function() {
		iterable = iterate(sequence);
	},

	'filter(iterable)': function() {
		consume(filter(isEven, iterable));
	},
	'filter(predicate, iterable)': function() {
		consume(onlyEven(iterable));
	},

	'filter(array)': function() {
		consume(filter(isEven, sequence));
	},
	'filter(predicate, array)': function() {
		consume(onlyEven(sequence));
	},

});