var reduce = require('./reduce');

/**
 * Returns a function that is equivalent to all the given
 * functions piped together.
 *
 * The result from the invocation of each function will be given
 * as argument to the next, except for the first one that will
 * receive all the arguments from the invocation. It is the
 * opposite of {@link compose}.
 *
 *     pipe(a, b, c)(1, 2, 3);
 *     // -> c(b(a(1, 2, 3)));
 *
 * @example
 *     var lower = function(s) { return s.toLowerCase() };
 *     var trim =  function(s) { return s.trim() };
 *     var dash =  function(s) { return s.replace(/[^\w]+/g, '-') };
 *     var slugify = pipe(lower, trim, dash);
 *     slugify(' My new post');
 *
 * @param {...function} funcs
 *     Any number of functions to pipe together.
 *
 * @returns {function}
 *     A pipe of all the functions.
 *
 * @memberOf lazyfunk
 */
function pipe(/*...funcs*/) {
	// Create an array of functions from arguments.
	// Take the first function separately.
	var first = arguments[0];
	var funcs = new Array(arguments.length - 1);
	for (var i=0, l=funcs.length; i<l; i++) {
		funcs[i] = arguments[i+1];
	}
	return function(/*...arguments*/) {
		// Invoke the first function with the arguments.
		var acc = first.apply(null, arguments);
		// Reduce the rest of the functions.
		return reduce(invoke, acc, funcs);
	};
}

/*
Invokes a function with a value.
*/
function invoke(value, fn) {
	return fn(value);
}

module.exports = pipe;