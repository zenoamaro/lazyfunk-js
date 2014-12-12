/**
 * Returns a partial applications of a function that accepts
 * arguments until it has received all those it expects, at
 * which point it is invoked.
 *
 * Each application will accept more arguments and return yet
 * another application, allowing you to progressively apply and
 * reuse each of the steps.
 *
 * Any number of arguments can be given at a time. Arguments
 * in excess will still be passed on.
 *
 * @example
 *     var crop = curry(function(shape, coords, image){ ... });
 *     var roundCrop = crop(circleShape({ r:0.25 }));
 *     var avatarCrop = roundCrop({ x:0.5, y:0.5 });
 *     var avatar = avatarCrop(image); // Invocation
 *
 * @param {function} func
 *     A function to curry.
 *
 * @param {...any} arguments
 *     Any number of arguments to be applied immediately.
 *
 * @returns {function}
 *     A partial application of the function.
 *
 * @memberOf lazyfunk
 */
function curry(func /*...arguments*/) {
	// Copy arguments, except first.
	var args = new Array(arguments.length - 1);
	for (var i=0, l=args.length; i<l; i++) {
		args[i] = arguments[i+1];
	}
	// Recurry function.
	return function curried(/*...arguments*/) {
		// Copy arguments.
		var newArgs = new Array(arguments.length);
		for (var i=0, l=newArgs.length; i<l; i++) {
			newArgs[i] = arguments[i];
		}
		// Collect new args and dispatch.
		var collectedArgs = args.concat(newArgs);
		// Execute or curry again based what we have.
		if (collectedArgs.length >= func.length) {
			return func.apply(null, collectedArgs);
		} else {
			collectedArgs.unshift(func);
			return curry.apply(null, collectedArgs);
		}
	};
}

module.exports = curry;