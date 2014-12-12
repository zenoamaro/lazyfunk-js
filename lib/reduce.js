var copy = require('./copy');
var curry = require('./curry');
var iterate = require('./iterate');

/**
 * Reduces a sequence to a single value, produced by invoking
 * the `reducer` function on each value, along with the accumulated
 * value, and collecting the result as the new accumulator.
 *
 * Curried, so each invocation will return a partial application
 * until all the arguments have been provided. See {@link curry}.
 *
 * @example
 *     // Partial application
 *     var add = function(a, b) { return a + b };
 *     var sum = reduce(add);
 *     sum(0, [1, 2, 3, 4]);
 *
 * @example
 *     // Full invokation
 *     reduce(add, 0, [1, 2, 3, 4]);
 *
 * @param {reducer} reducer
 *     A function that receives the accumulated value and
 *     a value, and should return
 *
 * @param {any} initial
 *     The initial value for the accumulator.
 *
 * @param {Iterator|Array-like} iterable
 *     An `Iterator` (or array-like) to filter.
 *
 * @returns {any}
 *     An iterator over the results, or a partial application until
 *     all arguments have been provided.
 *
 * @memberOf lazyfunk
 */
function reduce(reducer, initial, iterable) {
    // Clone if not primitive
    var acc = copy(initial);
    // Make iterable if not.
    if (!iterable.next) {
        iterable = iterate(iterable);
    }
    // Manual iteration.
    var step;
    while ( (step = iterable.next()) && !step.done ) {
        acc = reducer(acc, step.value);
    }
    return acc;
}

module.exports = curry(reduce);