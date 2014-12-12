var slice = Array.prototype.slice;

/**
 * Produces an Iterator over an array-like. Yields every value
 * in the sequence, unless when given a step, in which case it
 * yields slices of `step` elements.
 *
 * @example
 *     var seq = iterate([ 1, 2, 3, 4 ]);
 *     filter(isEven, seq);
 *
 * @param {array-like} sequence
 *     An array-like sequence to iterate.
 *
 * @param {number} [step=1]
 *     The number of values for each yield.
 *
 * @returns {Iterator}
 *     An iterator over the sequence.
 *
 * @memberOf lazyfunk
 */
function* iterate(sequence, step) {
	if (step == null) { step = 1 }
	// Manual iteration.
	for (var i=0, l=sequence.length; i<l; i+=step) {
		if (step === 1) {
			// Yield single value.
			yield sequence[i];
		} else {
			// Yield slice of values.
			yield slice.call(sequence, i, i+step);
		}
	}
}

module.exports = iterate;