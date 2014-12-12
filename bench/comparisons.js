var Suite = require('./suite');
var lodash = require('lodash');
var range = require('../lib/range');
var consume = require('../lib/consume');
var filter = require('../lib/filter');
var pipe = require('../lib/pipe');

var sequence = consume(range(0, 1000));
var iterable = range(0, 1000);
var isMod2 = function(n){ return n % 2 === 0 };
var isMod3 = function(n){ return n % 3 === 0 };
var isMod5 = function(n){ return n % 5 === 0 };
var onlyMod235 = filter(pipe(isMod2, isMod3, isMod5));

Suite({

	'name': 'Simple comparison',

	'Array#filter': function() {
		sequence
			.filter(isMod2)
			.filter(isMod3)
			.filter(isMod5);
	},
	'lodash#filter': function() {
		lodash.chain()
			.filter(isMod2)
			.filter(isMod3)
			.filter(isMod5)
			.value();
	},
	'LazyFunk#filter': function() {
		consume(onlyMod235(iterable));
	},

});