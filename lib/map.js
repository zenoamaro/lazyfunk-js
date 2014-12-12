var iterate = require('./iterate');
var curry = require('./curry');

/**
 * Maps a sequence to another sequence composed of all the elements
 * from the original sequence passed through a `transform` function.
 *
 * Curried, so each invocation will return a partial application
 * until all the arguments have been provided. See {@link curry}.
 *
 * @example
 *     // Partial application
 *     var toLowerCase = function(s){ return s.toLowerCase() };
 *     var lowerCase = map(toLowerCase);
 *     lower([ 'DOG', 'Cat', 'cow', ]);
 *
 * @example
 *     // Full invokation
 *     map(lowerCase, [ 'DOG', 'Cat', 'cow', ]);
 *
 * @param {transform} transform
 *     A function to be invoked on each element of the sequence,
 *     and whose results will compose the resulting sequence.
 *
 * @param {Iterator|Array-like} iterable
 *     An `Iterator` (or array-like) to map.
 *
 * @returns {Iterator|Function}
 *     An iterator over the results, or a partial application until
 *     all arguments have been provided.
 *
 * @memberOf lazyfunk
 */
function* map(transform, iterable) {
	// Convert to `Iterator`.
	if (!iterable.next) {
		iterable = iterate(iterable);
	}
	// Iterate until exhausted.
	var step;
	while ( (step = iterable.next()) && !step.done ) {
		// Yield transformed values.
		yield transform(step.value);
	}
}

module.exports = curry(map);