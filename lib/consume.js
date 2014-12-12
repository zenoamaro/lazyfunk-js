/**
 * Completely consumes an iterator, producing an array of
 * results. Pass a `limit` to stop after having consumed a
 * certain amount of values, especially useful when feeding on
 * infinite generators which would otherwise loop.
 *
 * @example
 *     var seq = consume(range(0, 100));
 *     // -> [0, 1, 2, ..., 97, 98, 99]
 *
 * @param {Iterator} iterable
 *     An iterator to consume.
 *
 * @param {number} [limit=Infinity]
 *     Consume up to this number of values.
 *
 * @returns {Array}
 *     An array of the values.
 *
 * @memberOf lazyfunk
 */
function consume(iterable, limit) {
	// No limit by default.
	if (limit == null) { limit = Infinity }
	// Manual iteration.
	var step;
	var i = 0;
	var results = [];
	while ( i<limit && (step=iterable.next()) && !step.done ) {
		// Push onto results.
		results.push(step.value);
		i++;
	}
	return results;
}

module.exports = consume;