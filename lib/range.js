/**
 * Produces a generator that yields numbers between `start` and
 * `end` exclusive. Optionally, pass a step.
 *
 * @example
 *     var evens = range(0, 100, 2);
 *
 * @param {number} start
 *     Starting value of the range.
 *
 * @param {number} end
 *     Ending value, exclusive.
 *
 * @param {number} [step=1]
 *     The interval between each step.
 *
 * @returns {Iterator}
 *     An iterator over the range.
 *
 * @memberOf lazyfunk
 */
function* range(start, end, step) {
	if (step == null) { step = 1 }
	for (var i=start; i<end; i+=step) {
		yield i;
	}
}

module.exports = range;