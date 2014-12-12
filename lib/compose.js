var pipe = require('./pipe');

/**
 * Returns a function that is equivalent to all the given
 * functions composed together.
 *
 * Each function will receive as argument the result of each
 * following function, except for the last one that will receive
 * all the arguments from the invocation. It is the opposite of
 * {@link pipe}.
 *
 *     compose(a, b, c)(1, 2, 3);
 *     // -> a(b(c(1, 2, 3)));
 *
 * @example
 *     var absolute = function(n) { return Math.abs(n) };
 *     var bounded = function(n) { return Math.max(0, Math.min(n, 1)) };
 *     var numerator = function(pair) { return pair[0] };
 *     pipe(squared, bounded, numerator)([ 2, 3 ]);
 *
 * @param {...function} funcs
 *     Any number of functions to compose together.
 *
 * @returns {function}
 *     A composition of all the functions.
 *
 * @memberOf lazyfunk
 */
function compose(/*funcs*/) {
	// Reverse copy arguments.
	var funcs = new Array(arguments.length);
	for (var i=0, l=funcs.length; i<l; i++) {
		funcs[i] = arguments[l-i-1];
	}
	// Delegate to pipe.
	return pipe.apply(null, funcs);
}

module.exports = compose;