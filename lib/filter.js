var iterate = require('./iterate');
var curry = require('./curry');

/**
 * Filters a sequence, returning only elements for which the
 * predicate function returns truthy.
 *
 * Curried, so each invocation will return a partial application
 * until all the arguments have been provided. See {@link curry}.
 *
 * @example
 *     // Partial application
 *     var isEven = function(n){ return n % 2 === 0 };
 *     var even = filter(isEven);
 *     even([1, 2, 3, 4]);
 *
 * @example
 *     // Full invokation
 *     filter(isEven, [1, 2, 3, 4]);
 *
 * @param {predicate} predicate
 *     A function that should return truthy for values that are to
 *     be included in the resulting sequence.
 *
 * @param {Iterator|Array-like} iterable
 *     An `Iterator` (or array-like) to filter.
 *
 * @returns {Iterator|Function}
 *     An iterator over the results, or a partial application until
 *     all arguments have been provided.
 *
 * @memberOf lazyfunk
 */
function* filter(predicate, iterable) {
	// Convert to `Iterator`.
	if (!iterable.next) {
		iterable = iterate(iterable);
	}
	// Iterate until exhausted.
	var step;
	while ( (step = iterable.next()) && !step.done ) {
		// Only yield truthy values.
		if (predicate(step.value)) {
			yield step.value;
		}
	}
}

// Export the curried function.
module.exports = curry(filter);