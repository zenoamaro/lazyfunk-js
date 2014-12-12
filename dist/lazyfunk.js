(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["lazyfunk"] = factory();
	else
		root["lazyfunk"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @namespace lazyfunk
	 */
	module.exports = {
		compose: __webpack_require__(/*! ./compose */ 1),
		consume: __webpack_require__(/*! ./consume */ 2),
		curry:   __webpack_require__(/*! ./curry */ 3),
		filter:  __webpack_require__(/*! ./filter */ 4),
		iterate: __webpack_require__(/*! ./iterate */ 5),
		map:     __webpack_require__(/*! ./map */ 6),
		pipe:    __webpack_require__(/*! ./pipe */ 7),
		range:   __webpack_require__(/*! ./range */ 8),
		reduce:  __webpack_require__(/*! ./reduce */ 9),
	};

/***/ },
/* 1 */
/*!************************!*\
  !*** ./lib/compose.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	var pipe = __webpack_require__(/*! ./pipe */ 7);
	
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

/***/ },
/* 2 */
/*!************************!*\
  !*** ./lib/consume.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 3 */
/*!**********************!*\
  !*** ./lib/curry.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 4 */
/*!***********************!*\
  !*** ./lib/filter.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	var regneratorRuntime = __webpack_require__(/*! regenerator/runtime */ 11);
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
	var filter = regeneratorRuntime.mark(/**
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
	function filter(predicate, iterable) {
	    var step;
	
	    return regeneratorRuntime.wrap(function filter$(context$1$0) {
	        while (1) switch (context$1$0.prev = context$1$0.next) {
	        case 0:
	            // Convert to `Iterator`.
	            if (!iterable.next) {
	                iterable = iterate(iterable);
	            }
	        case 1:
	            if (!((step = iterable.next()) && !step.done)) {
	                context$1$0.next = 7;
	                break;
	            }
	
	            if (!predicate(step.value)) {
	                context$1$0.next = 5;
	                break;
	            }
	
	            context$1$0.next = 5;
	            return step.value;
	        case 5:
	            context$1$0.next = 1;
	            break;
	        case 7:
	        case "end":
	            return context$1$0.stop();
	        }
	    }, filter, this);
	});
	
	var iterate = __webpack_require__(/*! ./iterate */ 5);
	var curry = __webpack_require__(/*! ./curry */ 3);
	
	// Export the curried function.
	module.exports = curry(filter);

/***/ },
/* 5 */
/*!************************!*\
  !*** ./lib/iterate.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	var regneratorRuntime = __webpack_require__(/*! regenerator/runtime */ 11);
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
	var iterate = regeneratorRuntime.mark(/**
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
	function iterate(sequence, step) {
	    var i, l;
	
	    return regeneratorRuntime.wrap(function iterate$(context$1$0) {
	        while (1) switch (context$1$0.prev = context$1$0.next) {
	        case 0:
	            if (step == null) { step = 1 }
	            i = 0, l = sequence.length;
	        case 2:
	            if (!(i < l)) {
	                context$1$0.next = 13;
	                break;
	            }
	
	            if (!(step === 1)) {
	                context$1$0.next = 8;
	                break;
	            }
	
	            context$1$0.next = 6;
	            return sequence[i];
	        case 6:
	            context$1$0.next = 10;
	            break;
	        case 8:
	            context$1$0.next = 10;
	            return slice.call(sequence, i, i+step);
	        case 10:
	            i+=step;
	            context$1$0.next = 2;
	            break;
	        case 13:
	        case "end":
	            return context$1$0.stop();
	        }
	    }, iterate, this);
	});
	
	var slice = Array.prototype.slice;
	
	module.exports = iterate;

/***/ },
/* 6 */
/*!********************!*\
  !*** ./lib/map.js ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	var regneratorRuntime = __webpack_require__(/*! regenerator/runtime */ 11);
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
	var map = regeneratorRuntime.mark(/**
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
	function map(transform, iterable) {
	    var step;
	
	    return regeneratorRuntime.wrap(function map$(context$1$0) {
	        while (1) switch (context$1$0.prev = context$1$0.next) {
	        case 0:
	            // Convert to `Iterator`.
	            if (!iterable.next) {
	                iterable = iterate(iterable);
	            }
	        case 1:
	            if (!((step = iterable.next()) && !step.done)) {
	                context$1$0.next = 6;
	                break;
	            }
	
	            context$1$0.next = 4;
	            return transform(step.value);
	        case 4:
	            context$1$0.next = 1;
	            break;
	        case 6:
	        case "end":
	            return context$1$0.stop();
	        }
	    }, map, this);
	});
	
	var iterate = __webpack_require__(/*! ./iterate */ 5);
	var curry = __webpack_require__(/*! ./curry */ 3);
	
	module.exports = curry(map);

/***/ },
/* 7 */
/*!*********************!*\
  !*** ./lib/pipe.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	var reduce = __webpack_require__(/*! ./reduce */ 9);
	
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

/***/ },
/* 8 */
/*!**********************!*\
  !*** ./lib/range.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	var regneratorRuntime = __webpack_require__(/*! regenerator/runtime */ 11);
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
	var range = regeneratorRuntime.mark(/**
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
	function range(start, end, step) {
	    var i;
	
	    return regeneratorRuntime.wrap(function range$(context$1$0) {
	        while (1) switch (context$1$0.prev = context$1$0.next) {
	        case 0:
	            if (step == null) { step = 1 }
	            i = start;
	        case 2:
	            if (!(i < end)) {
	                context$1$0.next = 8;
	                break;
	            }
	
	            context$1$0.next = 5;
	            return i;
	        case 5:
	            i+=step;
	            context$1$0.next = 2;
	            break;
	        case 8:
	        case "end":
	            return context$1$0.stop();
	        }
	    }, range, this);
	});
	
	module.exports = range;

/***/ },
/* 9 */
/*!***********************!*\
  !*** ./lib/reduce.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	var copy = __webpack_require__(/*! ./copy */ 10);
	var curry = __webpack_require__(/*! ./curry */ 3);
	var iterate = __webpack_require__(/*! ./iterate */ 5);
	
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

/***/ },
/* 10 */
/*!*********************!*\
  !*** ./lib/copy.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Makes a shallow copy of an object or array-like.
	 * Primitives are returned as-is.
	 *
	 * @param  {any} obj
	 * @return {any}
	 *
	 * @private
	 * @memberOf lazyfunk
	 */
	function copy(obj) {
		// Primitive
		if (typeof(obj) !== 'object') {
			return obj;
		}
		// Array-like
		if ('length' in obj) {
			return copyArray(obj);
		}
		// Object
		return copyObject(obj);
	}
	
	function copyArray(arr) {
		return Array.prototype.slice.call(arr);
	}
	
	function copyObject(obj) {
		var result = {};
		for (var k in obj) {
			result[k] = obj[k];
		}
		return result;
	}
	
	module.exports = copy;

/***/ },
/* 11 */
/*!**********************************!*\
  !*** ./~/regenerator/runtime.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */
	
	!(function() {
	  var hasOwn = Object.prototype.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var iteratorSymbol =
	    typeof Symbol === "function" && Symbol.iterator || "@@iterator";
	
	  if (typeof regeneratorRuntime === "object") {
	    return;
	  }
	
	  var runtime = regeneratorRuntime =
	    false ? {} : exports;
	
	  function wrap(innerFn, outerFn, self, tryList) {
	    return new Generator(innerFn, outerFn, self || null, tryList || []);
	  }
	  runtime.wrap = wrap;
	
	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";
	
	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};
	
	  // Dummy constructor that we use as the .constructor property for
	  // functions that return Generator objects.
	  var GF = function GeneratorFunction() {};
	  var GFp = function GeneratorFunctionPrototype() {};
	  var Gp = GFp.prototype = Generator.prototype;
	  (GFp.constructor = GF).prototype =
	    Gp.constructor = GFp;
	
	  // Ensure isGeneratorFunction works when Function#name not supported.
	  var GFName = "GeneratorFunction";
	  if (GF.name !== GFName) GF.name = GFName;
	  if (GF.name !== GFName) throw new Error(GFName + " renamed?");
	
	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = genFun && genFun.constructor;
	    return ctor ? GF.name === ctor.name : false;
	  };
	
	  runtime.mark = function(genFun) {
	    genFun.__proto__ = GFp;
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };
	
	  runtime.async = function(innerFn, outerFn, self, tryList) {
	    return new Promise(function(resolve, reject) {
	      var generator = wrap(innerFn, outerFn, self, tryList);
	      var callNext = step.bind(generator.next);
	      var callThrow = step.bind(generator["throw"]);
	
	      function step(arg) {
	        try {
	          var info = this(arg);
	          var value = info.value;
	        } catch (error) {
	          return reject(error);
	        }
	
	        if (info.done) {
	          resolve(value);
	        } else {
	          Promise.resolve(value).then(callNext, callThrow);
	        }
	      }
	
	      callNext();
	    });
	  };
	
	  function Generator(innerFn, outerFn, self, tryList) {
	    var generator = outerFn ? Object.create(outerFn.prototype) : this;
	    var context = new Context(tryList);
	    var state = GenStateSuspendedStart;
	
	    function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }
	
	      if (state === GenStateCompleted) {
	        throw new Error("Generator has already finished");
	      }
	
	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          try {
	            var info = delegate.iterator[method](arg);
	
	            // Delegate generator ran and handled its own exceptions so
	            // regardless of what the method was, we continue as if it is
	            // "next" with an undefined arg.
	            method = "next";
	            arg = undefined;
	
	          } catch (uncaught) {
	            context.delegate = null;
	
	            // Like returning generator.throw(uncaught), but without the
	            // overhead of an extra function call.
	            method = "throw";
	            arg = uncaught;
	
	            continue;
	          }
	
	          if (info.done) {
	            context[delegate.resultName] = info.value;
	            context.next = delegate.nextLoc;
	          } else {
	            state = GenStateSuspendedYield;
	            return info;
	          }
	
	          context.delegate = null;
	        }
	
	        if (method === "next") {
	          if (state === GenStateSuspendedStart &&
	              typeof arg !== "undefined") {
	            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	            throw new TypeError(
	              "attempt to send " + JSON.stringify(arg) + " to newborn generator"
	            );
	          }
	
	          if (state === GenStateSuspendedYield) {
	            context.sent = arg;
	          } else {
	            delete context.sent;
	          }
	
	        } else if (method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw arg;
	          }
	
	          if (context.dispatchException(arg)) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            method = "next";
	            arg = undefined;
	          }
	
	        } else if (method === "return") {
	          context.abrupt("return", arg);
	        }
	
	        state = GenStateExecuting;
	
	        try {
	          var value = innerFn.call(self, context);
	
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;
	
	          var info = {
	            value: value,
	            done: context.done
	          };
	
	          if (value === ContinueSentinel) {
	            if (context.delegate && method === "next") {
	              // Deliberately forget the last sent value so that we don't
	              // accidentally pass it on to the delegate.
	              arg = undefined;
	            }
	          } else {
	            return info;
	          }
	
	        } catch (thrown) {
	          state = GenStateCompleted;
	
	          if (method === "next") {
	            context.dispatchException(thrown);
	          } else {
	            arg = thrown;
	          }
	        }
	      }
	    }
	
	    generator.next = invoke.bind(generator, "next");
	    generator["throw"] = invoke.bind(generator, "throw");
	    generator["return"] = invoke.bind(generator, "return");
	
	    return generator;
	  }
	
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };
	
	  Gp.toString = function() {
	    return "[object Generator]";
	  };
	
	  function pushTryEntry(triple) {
	    var entry = { tryLoc: triple[0] };
	
	    if (1 in triple) {
	      entry.catchLoc = triple[1];
	    }
	
	    if (2 in triple) {
	      entry.finallyLoc = triple[2];
	    }
	
	    this.tryEntries.push(entry);
	  }
	
	  function resetTryEntry(entry, i) {
	    var record = entry.completion || {};
	    record.type = i === 0 ? "normal" : "return";
	    delete record.arg;
	    entry.completion = record;
	  }
	
	  function Context(tryList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryList.forEach(pushTryEntry, this);
	    this.reset();
	  }
	
	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();
	
	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }
	
	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };
	
	  function values(iterable) {
	    var iterator = iterable;
	    if (iteratorSymbol in iterable) {
	      iterator = iterable[iteratorSymbol]();
	    } else if (!isNaN(iterable.length)) {
	      var i = -1;
	      iterator = function next() {
	        while (++i < iterable.length) {
	          if (i in iterable) {
	            next.value = iterable[i];
	            next.done = false;
	            return next;
	          }
	        }
	        next.value = undefined;
	        next.done = true;
	        return next;
	      };
	      iterator.next = iterator;
	    }
	    return iterator;
	  }
	  runtime.values = values;
	
	  Context.prototype = {
	    constructor: Context,
	
	    reset: function() {
	      this.prev = 0;
	      this.next = 0;
	      this.sent = undefined;
	      this.done = false;
	      this.delegate = null;
	
	      this.tryEntries.forEach(resetTryEntry);
	
	      // Pre-initialize at least 20 temporary variables to enable hidden
	      // class optimizations for simple generators.
	      for (var tempIndex = 0, tempName;
	           hasOwn.call(this, tempName = "t" + tempIndex) || tempIndex < 20;
	           ++tempIndex) {
	        this[tempName] = null;
	      }
	    },
	
	    stop: function() {
	      this.done = true;
	
	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }
	
	      return this.rval;
	    },
	
	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }
	
	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	        return !!caught;
	      }
	
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;
	
	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }
	
	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");
	
	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }
	
	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },
	
	    _findFinallyEntry: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") && (
	              entry.finallyLoc === finallyLoc ||
	              this.prev < entry.finallyLoc)) {
	          return entry;
	        }
	      }
	    },
	
	    abrupt: function(type, arg) {
	      var entry = this._findFinallyEntry();
	      var record = entry ? entry.completion : {};
	
	      record.type = type;
	      record.arg = arg;
	
	      if (entry) {
	        this.next = entry.finallyLoc;
	      } else {
	        this.complete(record);
	      }
	
	      return ContinueSentinel;
	    },
	
	    complete: function(record) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }
	
	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = record.arg;
	        this.next = "end";
	      }
	
	      return ContinueSentinel;
	    },
	
	    finish: function(finallyLoc) {
	      var entry = this._findFinallyEntry(finallyLoc);
	      return this.complete(entry.completion);
	    },
	
	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry, i);
	          }
	          return thrown;
	        }
	      }
	
	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },
	
	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };
	
	      return ContinueSentinel;
	    }
	  };
	})();


/***/ }
/******/ ])
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBlMmI4MmZkMmMyZTA1ZGVmMmYzNyIsIndlYnBhY2s6Ly8vLi9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbXBvc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbnN1bWUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2N1cnJ5LmpzIiwid2VicGFjazovLy8uL2xpYi9maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2l0ZXJhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21hcC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcGlwZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcmFuZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3JlZHVjZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29weS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZ2VuZXJhdG9yL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdDOzs7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7Ozs7O0FDYkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJLFdBQVc7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdDOzs7Ozs7Ozs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLElBQUk7QUFDaEIsYUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1Qjs7Ozs7Ozs7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFlBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTs7QUFFQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTs7QUFFQSxVQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0NBQThDLFFBQVE7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUEsWUFBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0EsK0NBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0EsK0NBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wibGF6eWZ1bmtcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wibGF6eWZ1bmtcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb25cbiAqKi8iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBlMmI4MmZkMmMyZTA1ZGVmMmYzN1xuICoqLyIsIi8qKlxuICogQG5hbWVzcGFjZSBsYXp5ZnVua1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y29tcG9zZTogcmVxdWlyZSgnLi9jb21wb3NlJyksXG5cdGNvbnN1bWU6IHJlcXVpcmUoJy4vY29uc3VtZScpLFxuXHRjdXJyeTogICByZXF1aXJlKCcuL2N1cnJ5JyksXG5cdGZpbHRlcjogIHJlcXVpcmUoJy4vZmlsdGVyJyksXG5cdGl0ZXJhdGU6IHJlcXVpcmUoJy4vaXRlcmF0ZScpLFxuXHRtYXA6ICAgICByZXF1aXJlKCcuL21hcCcpLFxuXHRwaXBlOiAgICByZXF1aXJlKCcuL3BpcGUnKSxcblx0cmFuZ2U6ICAgcmVxdWlyZSgnLi9yYW5nZScpLFxuXHRyZWR1Y2U6ICByZXF1aXJlKCcuL3JlZHVjZScpLFxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vbGliL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHBpcGUgPSByZXF1aXJlKCcuL3BpcGUnKTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyBlcXVpdmFsZW50IHRvIGFsbCB0aGUgZ2l2ZW5cbiAqIGZ1bmN0aW9ucyBjb21wb3NlZCB0b2dldGhlci5cbiAqXG4gKiBFYWNoIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSBhcyBhcmd1bWVudCB0aGUgcmVzdWx0IG9mIGVhY2hcbiAqIGZvbGxvd2luZyBmdW5jdGlvbiwgZXhjZXB0IGZvciB0aGUgbGFzdCBvbmUgdGhhdCB3aWxsIHJlY2VpdmVcbiAqIGFsbCB0aGUgYXJndW1lbnRzIGZyb20gdGhlIGludm9jYXRpb24uIEl0IGlzIHRoZSBvcHBvc2l0ZSBvZlxuICoge0BsaW5rIHBpcGV9LlxuICpcbiAqICAgICBjb21wb3NlKGEsIGIsIGMpKDEsIDIsIDMpO1xuICogICAgIC8vIC0+IGEoYihjKDEsIDIsIDMpKSk7XG4gKlxuICogQGV4YW1wbGVcbiAqICAgICB2YXIgYWJzb2x1dGUgPSBmdW5jdGlvbihuKSB7IHJldHVybiBNYXRoLmFicyhuKSB9O1xuICogICAgIHZhciBib3VuZGVkID0gZnVuY3Rpb24obikgeyByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4obiwgMSkpIH07XG4gKiAgICAgdmFyIG51bWVyYXRvciA9IGZ1bmN0aW9uKHBhaXIpIHsgcmV0dXJuIHBhaXJbMF0gfTtcbiAqICAgICBwaXBlKHNxdWFyZWQsIGJvdW5kZWQsIG51bWVyYXRvcikoWyAyLCAzIF0pO1xuICpcbiAqIEBwYXJhbSB7Li4uZnVuY3Rpb259IGZ1bmNzXG4gKiAgICAgQW55IG51bWJlciBvZiBmdW5jdGlvbnMgdG8gY29tcG9zZSB0b2dldGhlci5cbiAqXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gKiAgICAgQSBjb21wb3NpdGlvbiBvZiBhbGwgdGhlIGZ1bmN0aW9ucy5cbiAqXG4gKiBAbWVtYmVyT2YgbGF6eWZ1bmtcbiAqL1xuZnVuY3Rpb24gY29tcG9zZSgvKmZ1bmNzKi8pIHtcblx0Ly8gUmV2ZXJzZSBjb3B5IGFyZ3VtZW50cy5cblx0dmFyIGZ1bmNzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuXHRmb3IgKHZhciBpPTAsIGw9ZnVuY3MubGVuZ3RoOyBpPGw7IGkrKykge1xuXHRcdGZ1bmNzW2ldID0gYXJndW1lbnRzW2wtaS0xXTtcblx0fVxuXHQvLyBEZWxlZ2F0ZSB0byBwaXBlLlxuXHRyZXR1cm4gcGlwZS5hcHBseShudWxsLCBmdW5jcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcG9zZTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vbGliL2NvbXBvc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIENvbXBsZXRlbHkgY29uc3VtZXMgYW4gaXRlcmF0b3IsIHByb2R1Y2luZyBhbiBhcnJheSBvZlxuICogcmVzdWx0cy4gUGFzcyBhIGBsaW1pdGAgdG8gc3RvcCBhZnRlciBoYXZpbmcgY29uc3VtZWQgYVxuICogY2VydGFpbiBhbW91bnQgb2YgdmFsdWVzLCBlc3BlY2lhbGx5IHVzZWZ1bCB3aGVuIGZlZWRpbmcgb25cbiAqIGluZmluaXRlIGdlbmVyYXRvcnMgd2hpY2ggd291bGQgb3RoZXJ3aXNlIGxvb3AuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgICB2YXIgc2VxID0gY29uc3VtZShyYW5nZSgwLCAxMDApKTtcbiAqICAgICAvLyAtPiBbMCwgMSwgMiwgLi4uLCA5NywgOTgsIDk5XVxuICpcbiAqIEBwYXJhbSB7SXRlcmF0b3J9IGl0ZXJhYmxlXG4gKiAgICAgQW4gaXRlcmF0b3IgdG8gY29uc3VtZS5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW2xpbWl0PUluZmluaXR5XVxuICogICAgIENvbnN1bWUgdXAgdG8gdGhpcyBudW1iZXIgb2YgdmFsdWVzLlxuICpcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqICAgICBBbiBhcnJheSBvZiB0aGUgdmFsdWVzLlxuICpcbiAqIEBtZW1iZXJPZiBsYXp5ZnVua1xuICovXG5mdW5jdGlvbiBjb25zdW1lKGl0ZXJhYmxlLCBsaW1pdCkge1xuXHQvLyBObyBsaW1pdCBieSBkZWZhdWx0LlxuXHRpZiAobGltaXQgPT0gbnVsbCkgeyBsaW1pdCA9IEluZmluaXR5IH1cblx0Ly8gTWFudWFsIGl0ZXJhdGlvbi5cblx0dmFyIHN0ZXA7XG5cdHZhciBpID0gMDtcblx0dmFyIHJlc3VsdHMgPSBbXTtcblx0d2hpbGUgKCBpPGxpbWl0ICYmIChzdGVwPWl0ZXJhYmxlLm5leHQoKSkgJiYgIXN0ZXAuZG9uZSApIHtcblx0XHQvLyBQdXNoIG9udG8gcmVzdWx0cy5cblx0XHRyZXN1bHRzLnB1c2goc3RlcC52YWx1ZSk7XG5cdFx0aSsrO1xuXHR9XG5cdHJldHVybiByZXN1bHRzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN1bWU7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2xpYi9jb25zdW1lLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBSZXR1cm5zIGEgcGFydGlhbCBhcHBsaWNhdGlvbnMgb2YgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHNcbiAqIGFyZ3VtZW50cyB1bnRpbCBpdCBoYXMgcmVjZWl2ZWQgYWxsIHRob3NlIGl0IGV4cGVjdHMsIGF0XG4gKiB3aGljaCBwb2ludCBpdCBpcyBpbnZva2VkLlxuICpcbiAqIEVhY2ggYXBwbGljYXRpb24gd2lsbCBhY2NlcHQgbW9yZSBhcmd1bWVudHMgYW5kIHJldHVybiB5ZXRcbiAqIGFub3RoZXIgYXBwbGljYXRpb24sIGFsbG93aW5nIHlvdSB0byBwcm9ncmVzc2l2ZWx5IGFwcGx5IGFuZFxuICogcmV1c2UgZWFjaCBvZiB0aGUgc3RlcHMuXG4gKlxuICogQW55IG51bWJlciBvZiBhcmd1bWVudHMgY2FuIGJlIGdpdmVuIGF0IGEgdGltZS4gQXJndW1lbnRzXG4gKiBpbiBleGNlc3Mgd2lsbCBzdGlsbCBiZSBwYXNzZWQgb24uXG4gKlxuICogQGV4YW1wbGVcbiAqICAgICB2YXIgY3JvcCA9IGN1cnJ5KGZ1bmN0aW9uKHNoYXBlLCBjb29yZHMsIGltYWdlKXsgLi4uIH0pO1xuICogICAgIHZhciByb3VuZENyb3AgPSBjcm9wKGNpcmNsZVNoYXBlKHsgcjowLjI1IH0pKTtcbiAqICAgICB2YXIgYXZhdGFyQ3JvcCA9IHJvdW5kQ3JvcCh7IHg6MC41LCB5OjAuNSB9KTtcbiAqICAgICB2YXIgYXZhdGFyID0gYXZhdGFyQ3JvcChpbWFnZSk7IC8vIEludm9jYXRpb25cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jXG4gKiAgICAgQSBmdW5jdGlvbiB0byBjdXJyeS5cbiAqXG4gKiBAcGFyYW0gey4uLmFueX0gYXJndW1lbnRzXG4gKiAgICAgQW55IG51bWJlciBvZiBhcmd1bWVudHMgdG8gYmUgYXBwbGllZCBpbW1lZGlhdGVseS5cbiAqXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gKiAgICAgQSBwYXJ0aWFsIGFwcGxpY2F0aW9uIG9mIHRoZSBmdW5jdGlvbi5cbiAqXG4gKiBAbWVtYmVyT2YgbGF6eWZ1bmtcbiAqL1xuZnVuY3Rpb24gY3VycnkoZnVuYyAvKi4uLmFyZ3VtZW50cyovKSB7XG5cdC8vIENvcHkgYXJndW1lbnRzLCBleGNlcHQgZmlyc3QuXG5cdHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcblx0Zm9yICh2YXIgaT0wLCBsPWFyZ3MubGVuZ3RoOyBpPGw7IGkrKykge1xuXHRcdGFyZ3NbaV0gPSBhcmd1bWVudHNbaSsxXTtcblx0fVxuXHQvLyBSZWN1cnJ5IGZ1bmN0aW9uLlxuXHRyZXR1cm4gZnVuY3Rpb24gY3VycmllZCgvKi4uLmFyZ3VtZW50cyovKSB7XG5cdFx0Ly8gQ29weSBhcmd1bWVudHMuXG5cdFx0dmFyIG5ld0FyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG5cdFx0Zm9yICh2YXIgaT0wLCBsPW5ld0FyZ3MubGVuZ3RoOyBpPGw7IGkrKykge1xuXHRcdFx0bmV3QXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcblx0XHR9XG5cdFx0Ly8gQ29sbGVjdCBuZXcgYXJncyBhbmQgZGlzcGF0Y2guXG5cdFx0dmFyIGNvbGxlY3RlZEFyZ3MgPSBhcmdzLmNvbmNhdChuZXdBcmdzKTtcblx0XHQvLyBFeGVjdXRlIG9yIGN1cnJ5IGFnYWluIGJhc2VkIHdoYXQgd2UgaGF2ZS5cblx0XHRpZiAoY29sbGVjdGVkQXJncy5sZW5ndGggPj0gZnVuYy5sZW5ndGgpIHtcblx0XHRcdHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGNvbGxlY3RlZEFyZ3MpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb2xsZWN0ZWRBcmdzLnVuc2hpZnQoZnVuYyk7XG5cdFx0XHRyZXR1cm4gY3VycnkuYXBwbHkobnVsbCwgY29sbGVjdGVkQXJncyk7XG5cdFx0fVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGN1cnJ5O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9saWIvY3VycnkuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgcmVnbmVyYXRvclJ1bnRpbWUgPSByZXF1aXJlKCdyZWdlbmVyYXRvci9ydW50aW1lJyk7XG4vKipcbiAqIEZpbHRlcnMgYSBzZXF1ZW5jZSwgcmV0dXJuaW5nIG9ubHkgZWxlbWVudHMgZm9yIHdoaWNoIHRoZVxuICogcHJlZGljYXRlIGZ1bmN0aW9uIHJldHVybnMgdHJ1dGh5LlxuICpcbiAqIEN1cnJpZWQsIHNvIGVhY2ggaW52b2NhdGlvbiB3aWxsIHJldHVybiBhIHBhcnRpYWwgYXBwbGljYXRpb25cbiAqIHVudGlsIGFsbCB0aGUgYXJndW1lbnRzIGhhdmUgYmVlbiBwcm92aWRlZC4gU2VlIHtAbGluayBjdXJyeX0uXG4gKlxuICogQGV4YW1wbGVcbiAqICAgICAvLyBQYXJ0aWFsIGFwcGxpY2F0aW9uXG4gKiAgICAgdmFyIGlzRXZlbiA9IGZ1bmN0aW9uKG4peyByZXR1cm4gbiAlIDIgPT09IDAgfTtcbiAqICAgICB2YXIgZXZlbiA9IGZpbHRlcihpc0V2ZW4pO1xuICogICAgIGV2ZW4oWzEsIDIsIDMsIDRdKTtcbiAqXG4gKiBAZXhhbXBsZVxuICogICAgIC8vIEZ1bGwgaW52b2thdGlvblxuICogICAgIGZpbHRlcihpc0V2ZW4sIFsxLCAyLCAzLCA0XSk7XG4gKlxuICogQHBhcmFtIHtwcmVkaWNhdGV9IHByZWRpY2F0ZVxuICogICAgIEEgZnVuY3Rpb24gdGhhdCBzaG91bGQgcmV0dXJuIHRydXRoeSBmb3IgdmFsdWVzIHRoYXQgYXJlIHRvXG4gKiAgICAgYmUgaW5jbHVkZWQgaW4gdGhlIHJlc3VsdGluZyBzZXF1ZW5jZS5cbiAqXG4gKiBAcGFyYW0ge0l0ZXJhdG9yfEFycmF5LWxpa2V9IGl0ZXJhYmxlXG4gKiAgICAgQW4gYEl0ZXJhdG9yYCAob3IgYXJyYXktbGlrZSkgdG8gZmlsdGVyLlxuICpcbiAqIEByZXR1cm5zIHtJdGVyYXRvcnxGdW5jdGlvbn1cbiAqICAgICBBbiBpdGVyYXRvciBvdmVyIHRoZSByZXN1bHRzLCBvciBhIHBhcnRpYWwgYXBwbGljYXRpb24gdW50aWxcbiAqICAgICBhbGwgYXJndW1lbnRzIGhhdmUgYmVlbiBwcm92aWRlZC5cbiAqXG4gKiBAbWVtYmVyT2YgbGF6eWZ1bmtcbiAqL1xudmFyIGZpbHRlciA9IHJlZ2VuZXJhdG9yUnVudGltZS5tYXJrKC8qKlxuICogRmlsdGVycyBhIHNlcXVlbmNlLCByZXR1cm5pbmcgb25seSBlbGVtZW50cyBmb3Igd2hpY2ggdGhlXG4gKiBwcmVkaWNhdGUgZnVuY3Rpb24gcmV0dXJucyB0cnV0aHkuXG4gKlxuICogQ3VycmllZCwgc28gZWFjaCBpbnZvY2F0aW9uIHdpbGwgcmV0dXJuIGEgcGFydGlhbCBhcHBsaWNhdGlvblxuICogdW50aWwgYWxsIHRoZSBhcmd1bWVudHMgaGF2ZSBiZWVuIHByb3ZpZGVkLiBTZWUge0BsaW5rIGN1cnJ5fS5cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgIC8vIFBhcnRpYWwgYXBwbGljYXRpb25cbiAqICAgICB2YXIgaXNFdmVuID0gZnVuY3Rpb24obil7IHJldHVybiBuICUgMiA9PT0gMCB9O1xuICogICAgIHZhciBldmVuID0gZmlsdGVyKGlzRXZlbik7XG4gKiAgICAgZXZlbihbMSwgMiwgMywgNF0pO1xuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgLy8gRnVsbCBpbnZva2F0aW9uXG4gKiAgICAgZmlsdGVyKGlzRXZlbiwgWzEsIDIsIDMsIDRdKTtcbiAqXG4gKiBAcGFyYW0ge3ByZWRpY2F0ZX0gcHJlZGljYXRlXG4gKiAgICAgQSBmdW5jdGlvbiB0aGF0IHNob3VsZCByZXR1cm4gdHJ1dGh5IGZvciB2YWx1ZXMgdGhhdCBhcmUgdG9cbiAqICAgICBiZSBpbmNsdWRlZCBpbiB0aGUgcmVzdWx0aW5nIHNlcXVlbmNlLlxuICpcbiAqIEBwYXJhbSB7SXRlcmF0b3J8QXJyYXktbGlrZX0gaXRlcmFibGVcbiAqICAgICBBbiBgSXRlcmF0b3JgIChvciBhcnJheS1saWtlKSB0byBmaWx0ZXIuXG4gKlxuICogQHJldHVybnMge0l0ZXJhdG9yfEZ1bmN0aW9ufVxuICogICAgIEFuIGl0ZXJhdG9yIG92ZXIgdGhlIHJlc3VsdHMsIG9yIGEgcGFydGlhbCBhcHBsaWNhdGlvbiB1bnRpbFxuICogICAgIGFsbCBhcmd1bWVudHMgaGF2ZSBiZWVuIHByb3ZpZGVkLlxuICpcbiAqIEBtZW1iZXJPZiBsYXp5ZnVua1xuICovXG5mdW5jdGlvbiBmaWx0ZXIocHJlZGljYXRlLCBpdGVyYWJsZSkge1xuICAgIHZhciBzdGVwO1xuXG4gICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIGZpbHRlciQoY29udGV4dCQxJDApIHtcbiAgICAgICAgd2hpbGUgKDEpIHN3aXRjaCAoY29udGV4dCQxJDAucHJldiA9IGNvbnRleHQkMSQwLm5leHQpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgLy8gQ29udmVydCB0byBgSXRlcmF0b3JgLlxuICAgICAgICAgICAgaWYgKCFpdGVyYWJsZS5uZXh0KSB7XG4gICAgICAgICAgICAgICAgaXRlcmFibGUgPSBpdGVyYXRlKGl0ZXJhYmxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgaWYgKCEoKHN0ZXAgPSBpdGVyYWJsZS5uZXh0KCkpICYmICFzdGVwLmRvbmUpKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dCQxJDAubmV4dCA9IDc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcHJlZGljYXRlKHN0ZXAudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dCQxJDAubmV4dCA9IDU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRleHQkMSQwLm5leHQgPSA1O1xuICAgICAgICAgICAgcmV0dXJuIHN0ZXAudmFsdWU7XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIGNvbnRleHQkMSQwLm5leHQgPSAxO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQkMSQwLnN0b3AoKTtcbiAgICAgICAgfVxuICAgIH0sIGZpbHRlciwgdGhpcyk7XG59KTtcblxudmFyIGl0ZXJhdGUgPSByZXF1aXJlKCcuL2l0ZXJhdGUnKTtcbnZhciBjdXJyeSA9IHJlcXVpcmUoJy4vY3VycnknKTtcblxuLy8gRXhwb3J0IHRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxubW9kdWxlLmV4cG9ydHMgPSBjdXJyeShmaWx0ZXIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9saWIvZmlsdGVyLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHJlZ25lcmF0b3JSdW50aW1lID0gcmVxdWlyZSgncmVnZW5lcmF0b3IvcnVudGltZScpO1xuLyoqXG4gKiBQcm9kdWNlcyBhbiBJdGVyYXRvciBvdmVyIGFuIGFycmF5LWxpa2UuIFlpZWxkcyBldmVyeSB2YWx1ZVxuICogaW4gdGhlIHNlcXVlbmNlLCB1bmxlc3Mgd2hlbiBnaXZlbiBhIHN0ZXAsIGluIHdoaWNoIGNhc2UgaXRcbiAqIHlpZWxkcyBzbGljZXMgb2YgYHN0ZXBgIGVsZW1lbnRzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgdmFyIHNlcSA9IGl0ZXJhdGUoWyAxLCAyLCAzLCA0IF0pO1xuICogICAgIGZpbHRlcihpc0V2ZW4sIHNlcSk7XG4gKlxuICogQHBhcmFtIHthcnJheS1saWtlfSBzZXF1ZW5jZVxuICogICAgIEFuIGFycmF5LWxpa2Ugc2VxdWVuY2UgdG8gaXRlcmF0ZS5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0ZXA9MV1cbiAqICAgICBUaGUgbnVtYmVyIG9mIHZhbHVlcyBmb3IgZWFjaCB5aWVsZC5cbiAqXG4gKiBAcmV0dXJucyB7SXRlcmF0b3J9XG4gKiAgICAgQW4gaXRlcmF0b3Igb3ZlciB0aGUgc2VxdWVuY2UuXG4gKlxuICogQG1lbWJlck9mIGxhenlmdW5rXG4gKi9cbnZhciBpdGVyYXRlID0gcmVnZW5lcmF0b3JSdW50aW1lLm1hcmsoLyoqXG4gKiBQcm9kdWNlcyBhbiBJdGVyYXRvciBvdmVyIGFuIGFycmF5LWxpa2UuIFlpZWxkcyBldmVyeSB2YWx1ZVxuICogaW4gdGhlIHNlcXVlbmNlLCB1bmxlc3Mgd2hlbiBnaXZlbiBhIHN0ZXAsIGluIHdoaWNoIGNhc2UgaXRcbiAqIHlpZWxkcyBzbGljZXMgb2YgYHN0ZXBgIGVsZW1lbnRzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgdmFyIHNlcSA9IGl0ZXJhdGUoWyAxLCAyLCAzLCA0IF0pO1xuICogICAgIGZpbHRlcihpc0V2ZW4sIHNlcSk7XG4gKlxuICogQHBhcmFtIHthcnJheS1saWtlfSBzZXF1ZW5jZVxuICogICAgIEFuIGFycmF5LWxpa2Ugc2VxdWVuY2UgdG8gaXRlcmF0ZS5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0ZXA9MV1cbiAqICAgICBUaGUgbnVtYmVyIG9mIHZhbHVlcyBmb3IgZWFjaCB5aWVsZC5cbiAqXG4gKiBAcmV0dXJucyB7SXRlcmF0b3J9XG4gKiAgICAgQW4gaXRlcmF0b3Igb3ZlciB0aGUgc2VxdWVuY2UuXG4gKlxuICogQG1lbWJlck9mIGxhenlmdW5rXG4gKi9cbmZ1bmN0aW9uIGl0ZXJhdGUoc2VxdWVuY2UsIHN0ZXApIHtcbiAgICB2YXIgaSwgbDtcblxuICAgIHJldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcChmdW5jdGlvbiBpdGVyYXRlJChjb250ZXh0JDEkMCkge1xuICAgICAgICB3aGlsZSAoMSkgc3dpdGNoIChjb250ZXh0JDEkMC5wcmV2ID0gY29udGV4dCQxJDAubmV4dCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBpZiAoc3RlcCA9PSBudWxsKSB7IHN0ZXAgPSAxIH1cbiAgICAgICAgICAgIGkgPSAwLCBsID0gc2VxdWVuY2UubGVuZ3RoO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBpZiAoIShpIDwgbCkpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0JDEkMC5uZXh0ID0gMTM7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghKHN0ZXAgPT09IDEpKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dCQxJDAubmV4dCA9IDg7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRleHQkMSQwLm5leHQgPSA2O1xuICAgICAgICAgICAgcmV0dXJuIHNlcXVlbmNlW2ldO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICBjb250ZXh0JDEkMC5uZXh0ID0gMTA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgY29udGV4dCQxJDAubmV4dCA9IDEwO1xuICAgICAgICAgICAgcmV0dXJuIHNsaWNlLmNhbGwoc2VxdWVuY2UsIGksIGkrc3RlcCk7XG4gICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICBpKz1zdGVwO1xuICAgICAgICAgICAgY29udGV4dCQxJDAubmV4dCA9IDI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQkMSQwLnN0b3AoKTtcbiAgICAgICAgfVxuICAgIH0sIGl0ZXJhdGUsIHRoaXMpO1xufSk7XG5cbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpdGVyYXRlO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9saWIvaXRlcmF0ZS5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciByZWduZXJhdG9yUnVudGltZSA9IHJlcXVpcmUoJ3JlZ2VuZXJhdG9yL3J1bnRpbWUnKTtcbi8qKlxuICogTWFwcyBhIHNlcXVlbmNlIHRvIGFub3RoZXIgc2VxdWVuY2UgY29tcG9zZWQgb2YgYWxsIHRoZSBlbGVtZW50c1xuICogZnJvbSB0aGUgb3JpZ2luYWwgc2VxdWVuY2UgcGFzc2VkIHRocm91Z2ggYSBgdHJhbnNmb3JtYCBmdW5jdGlvbi5cbiAqXG4gKiBDdXJyaWVkLCBzbyBlYWNoIGludm9jYXRpb24gd2lsbCByZXR1cm4gYSBwYXJ0aWFsIGFwcGxpY2F0aW9uXG4gKiB1bnRpbCBhbGwgdGhlIGFyZ3VtZW50cyBoYXZlIGJlZW4gcHJvdmlkZWQuIFNlZSB7QGxpbmsgY3Vycnl9LlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgLy8gUGFydGlhbCBhcHBsaWNhdGlvblxuICogICAgIHZhciB0b0xvd2VyQ2FzZSA9IGZ1bmN0aW9uKHMpeyByZXR1cm4gcy50b0xvd2VyQ2FzZSgpIH07XG4gKiAgICAgdmFyIGxvd2VyQ2FzZSA9IG1hcCh0b0xvd2VyQ2FzZSk7XG4gKiAgICAgbG93ZXIoWyAnRE9HJywgJ0NhdCcsICdjb3cnLCBdKTtcbiAqXG4gKiBAZXhhbXBsZVxuICogICAgIC8vIEZ1bGwgaW52b2thdGlvblxuICogICAgIG1hcChsb3dlckNhc2UsIFsgJ0RPRycsICdDYXQnLCAnY293JywgXSk7XG4gKlxuICogQHBhcmFtIHt0cmFuc2Zvcm19IHRyYW5zZm9ybVxuICogICAgIEEgZnVuY3Rpb24gdG8gYmUgaW52b2tlZCBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIHNlcXVlbmNlLFxuICogICAgIGFuZCB3aG9zZSByZXN1bHRzIHdpbGwgY29tcG9zZSB0aGUgcmVzdWx0aW5nIHNlcXVlbmNlLlxuICpcbiAqIEBwYXJhbSB7SXRlcmF0b3J8QXJyYXktbGlrZX0gaXRlcmFibGVcbiAqICAgICBBbiBgSXRlcmF0b3JgIChvciBhcnJheS1saWtlKSB0byBtYXAuXG4gKlxuICogQHJldHVybnMge0l0ZXJhdG9yfEZ1bmN0aW9ufVxuICogICAgIEFuIGl0ZXJhdG9yIG92ZXIgdGhlIHJlc3VsdHMsIG9yIGEgcGFydGlhbCBhcHBsaWNhdGlvbiB1bnRpbFxuICogICAgIGFsbCBhcmd1bWVudHMgaGF2ZSBiZWVuIHByb3ZpZGVkLlxuICpcbiAqIEBtZW1iZXJPZiBsYXp5ZnVua1xuICovXG52YXIgbWFwID0gcmVnZW5lcmF0b3JSdW50aW1lLm1hcmsoLyoqXG4gKiBNYXBzIGEgc2VxdWVuY2UgdG8gYW5vdGhlciBzZXF1ZW5jZSBjb21wb3NlZCBvZiBhbGwgdGhlIGVsZW1lbnRzXG4gKiBmcm9tIHRoZSBvcmlnaW5hbCBzZXF1ZW5jZSBwYXNzZWQgdGhyb3VnaCBhIGB0cmFuc2Zvcm1gIGZ1bmN0aW9uLlxuICpcbiAqIEN1cnJpZWQsIHNvIGVhY2ggaW52b2NhdGlvbiB3aWxsIHJldHVybiBhIHBhcnRpYWwgYXBwbGljYXRpb25cbiAqIHVudGlsIGFsbCB0aGUgYXJndW1lbnRzIGhhdmUgYmVlbiBwcm92aWRlZC4gU2VlIHtAbGluayBjdXJyeX0uXG4gKlxuICogQGV4YW1wbGVcbiAqICAgICAvLyBQYXJ0aWFsIGFwcGxpY2F0aW9uXG4gKiAgICAgdmFyIHRvTG93ZXJDYXNlID0gZnVuY3Rpb24ocyl7IHJldHVybiBzLnRvTG93ZXJDYXNlKCkgfTtcbiAqICAgICB2YXIgbG93ZXJDYXNlID0gbWFwKHRvTG93ZXJDYXNlKTtcbiAqICAgICBsb3dlcihbICdET0cnLCAnQ2F0JywgJ2NvdycsIF0pO1xuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgLy8gRnVsbCBpbnZva2F0aW9uXG4gKiAgICAgbWFwKGxvd2VyQ2FzZSwgWyAnRE9HJywgJ0NhdCcsICdjb3cnLCBdKTtcbiAqXG4gKiBAcGFyYW0ge3RyYW5zZm9ybX0gdHJhbnNmb3JtXG4gKiAgICAgQSBmdW5jdGlvbiB0byBiZSBpbnZva2VkIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgc2VxdWVuY2UsXG4gKiAgICAgYW5kIHdob3NlIHJlc3VsdHMgd2lsbCBjb21wb3NlIHRoZSByZXN1bHRpbmcgc2VxdWVuY2UuXG4gKlxuICogQHBhcmFtIHtJdGVyYXRvcnxBcnJheS1saWtlfSBpdGVyYWJsZVxuICogICAgIEFuIGBJdGVyYXRvcmAgKG9yIGFycmF5LWxpa2UpIHRvIG1hcC5cbiAqXG4gKiBAcmV0dXJucyB7SXRlcmF0b3J8RnVuY3Rpb259XG4gKiAgICAgQW4gaXRlcmF0b3Igb3ZlciB0aGUgcmVzdWx0cywgb3IgYSBwYXJ0aWFsIGFwcGxpY2F0aW9uIHVudGlsXG4gKiAgICAgYWxsIGFyZ3VtZW50cyBoYXZlIGJlZW4gcHJvdmlkZWQuXG4gKlxuICogQG1lbWJlck9mIGxhenlmdW5rXG4gKi9cbmZ1bmN0aW9uIG1hcCh0cmFuc2Zvcm0sIGl0ZXJhYmxlKSB7XG4gICAgdmFyIHN0ZXA7XG5cbiAgICByZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoZnVuY3Rpb24gbWFwJChjb250ZXh0JDEkMCkge1xuICAgICAgICB3aGlsZSAoMSkgc3dpdGNoIChjb250ZXh0JDEkMC5wcmV2ID0gY29udGV4dCQxJDAubmV4dCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAvLyBDb252ZXJ0IHRvIGBJdGVyYXRvcmAuXG4gICAgICAgICAgICBpZiAoIWl0ZXJhYmxlLm5leHQpIHtcbiAgICAgICAgICAgICAgICBpdGVyYWJsZSA9IGl0ZXJhdGUoaXRlcmFibGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBpZiAoISgoc3RlcCA9IGl0ZXJhYmxlLm5leHQoKSkgJiYgIXN0ZXAuZG9uZSkpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0JDEkMC5uZXh0ID0gNjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29udGV4dCQxJDAubmV4dCA9IDQ7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNmb3JtKHN0ZXAudmFsdWUpO1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBjb250ZXh0JDEkMC5uZXh0ID0gMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0JDEkMC5zdG9wKCk7XG4gICAgICAgIH1cbiAgICB9LCBtYXAsIHRoaXMpO1xufSk7XG5cbnZhciBpdGVyYXRlID0gcmVxdWlyZSgnLi9pdGVyYXRlJyk7XG52YXIgY3VycnkgPSByZXF1aXJlKCcuL2N1cnJ5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY3VycnkobWFwKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vbGliL21hcC5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciByZWR1Y2UgPSByZXF1aXJlKCcuL3JlZHVjZScpO1xuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIGVxdWl2YWxlbnQgdG8gYWxsIHRoZSBnaXZlblxuICogZnVuY3Rpb25zIHBpcGVkIHRvZ2V0aGVyLlxuICpcbiAqIFRoZSByZXN1bHQgZnJvbSB0aGUgaW52b2NhdGlvbiBvZiBlYWNoIGZ1bmN0aW9uIHdpbGwgYmUgZ2l2ZW5cbiAqIGFzIGFyZ3VtZW50IHRvIHRoZSBuZXh0LCBleGNlcHQgZm9yIHRoZSBmaXJzdCBvbmUgdGhhdCB3aWxsXG4gKiByZWNlaXZlIGFsbCB0aGUgYXJndW1lbnRzIGZyb20gdGhlIGludm9jYXRpb24uIEl0IGlzIHRoZVxuICogb3Bwb3NpdGUgb2Yge0BsaW5rIGNvbXBvc2V9LlxuICpcbiAqICAgICBwaXBlKGEsIGIsIGMpKDEsIDIsIDMpO1xuICogICAgIC8vIC0+IGMoYihhKDEsIDIsIDMpKSk7XG4gKlxuICogQGV4YW1wbGVcbiAqICAgICB2YXIgbG93ZXIgPSBmdW5jdGlvbihzKSB7IHJldHVybiBzLnRvTG93ZXJDYXNlKCkgfTtcbiAqICAgICB2YXIgdHJpbSA9ICBmdW5jdGlvbihzKSB7IHJldHVybiBzLnRyaW0oKSB9O1xuICogICAgIHZhciBkYXNoID0gIGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMucmVwbGFjZSgvW15cXHddKy9nLCAnLScpIH07XG4gKiAgICAgdmFyIHNsdWdpZnkgPSBwaXBlKGxvd2VyLCB0cmltLCBkYXNoKTtcbiAqICAgICBzbHVnaWZ5KCcgTXkgbmV3IHBvc3QnKTtcbiAqXG4gKiBAcGFyYW0gey4uLmZ1bmN0aW9ufSBmdW5jc1xuICogICAgIEFueSBudW1iZXIgb2YgZnVuY3Rpb25zIHRvIHBpcGUgdG9nZXRoZXIuXG4gKlxuICogQHJldHVybnMge2Z1bmN0aW9ufVxuICogICAgIEEgcGlwZSBvZiBhbGwgdGhlIGZ1bmN0aW9ucy5cbiAqXG4gKiBAbWVtYmVyT2YgbGF6eWZ1bmtcbiAqL1xuZnVuY3Rpb24gcGlwZSgvKi4uLmZ1bmNzKi8pIHtcblx0Ly8gQ3JlYXRlIGFuIGFycmF5IG9mIGZ1bmN0aW9ucyBmcm9tIGFyZ3VtZW50cy5cblx0Ly8gVGFrZSB0aGUgZmlyc3QgZnVuY3Rpb24gc2VwYXJhdGVseS5cblx0dmFyIGZpcnN0ID0gYXJndW1lbnRzWzBdO1xuXHR2YXIgZnVuY3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuXHRmb3IgKHZhciBpPTAsIGw9ZnVuY3MubGVuZ3RoOyBpPGw7IGkrKykge1xuXHRcdGZ1bmNzW2ldID0gYXJndW1lbnRzW2krMV07XG5cdH1cblx0cmV0dXJuIGZ1bmN0aW9uKC8qLi4uYXJndW1lbnRzKi8pIHtcblx0XHQvLyBJbnZva2UgdGhlIGZpcnN0IGZ1bmN0aW9uIHdpdGggdGhlIGFyZ3VtZW50cy5cblx0XHR2YXIgYWNjID0gZmlyc3QuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcblx0XHQvLyBSZWR1Y2UgdGhlIHJlc3Qgb2YgdGhlIGZ1bmN0aW9ucy5cblx0XHRyZXR1cm4gcmVkdWNlKGludm9rZSwgYWNjLCBmdW5jcyk7XG5cdH07XG59XG5cbi8qXG5JbnZva2VzIGEgZnVuY3Rpb24gd2l0aCBhIHZhbHVlLlxuKi9cbmZ1bmN0aW9uIGludm9rZSh2YWx1ZSwgZm4pIHtcblx0cmV0dXJuIGZuKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwaXBlO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9saWIvcGlwZS5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciByZWduZXJhdG9yUnVudGltZSA9IHJlcXVpcmUoJ3JlZ2VuZXJhdG9yL3J1bnRpbWUnKTtcbi8qKlxuICogUHJvZHVjZXMgYSBnZW5lcmF0b3IgdGhhdCB5aWVsZHMgbnVtYmVycyBiZXR3ZWVuIGBzdGFydGAgYW5kXG4gKiBgZW5kYCBleGNsdXNpdmUuIE9wdGlvbmFsbHksIHBhc3MgYSBzdGVwLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgdmFyIGV2ZW5zID0gcmFuZ2UoMCwgMTAwLCAyKTtcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAqICAgICBTdGFydGluZyB2YWx1ZSBvZiB0aGUgcmFuZ2UuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGVuZFxuICogICAgIEVuZGluZyB2YWx1ZSwgZXhjbHVzaXZlLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RlcD0xXVxuICogICAgIFRoZSBpbnRlcnZhbCBiZXR3ZWVuIGVhY2ggc3RlcC5cbiAqXG4gKiBAcmV0dXJucyB7SXRlcmF0b3J9XG4gKiAgICAgQW4gaXRlcmF0b3Igb3ZlciB0aGUgcmFuZ2UuXG4gKlxuICogQG1lbWJlck9mIGxhenlmdW5rXG4gKi9cbi8qKlxuICogUHJvZHVjZXMgYSBnZW5lcmF0b3IgdGhhdCB5aWVsZHMgbnVtYmVycyBiZXR3ZWVuIGBzdGFydGAgYW5kXG4gKiBgZW5kYCBleGNsdXNpdmUuIE9wdGlvbmFsbHksIHBhc3MgYSBzdGVwLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgdmFyIGV2ZW5zID0gcmFuZ2UoMCwgMTAwLCAyKTtcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAqICAgICBTdGFydGluZyB2YWx1ZSBvZiB0aGUgcmFuZ2UuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGVuZFxuICogICAgIEVuZGluZyB2YWx1ZSwgZXhjbHVzaXZlLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RlcD0xXVxuICogICAgIFRoZSBpbnRlcnZhbCBiZXR3ZWVuIGVhY2ggc3RlcC5cbiAqXG4gKiBAcmV0dXJucyB7SXRlcmF0b3J9XG4gKiAgICAgQW4gaXRlcmF0b3Igb3ZlciB0aGUgcmFuZ2UuXG4gKlxuICogQG1lbWJlck9mIGxhenlmdW5rXG4gKi9cbnZhciByYW5nZSA9IHJlZ2VuZXJhdG9yUnVudGltZS5tYXJrKC8qKlxuICogUHJvZHVjZXMgYSBnZW5lcmF0b3IgdGhhdCB5aWVsZHMgbnVtYmVycyBiZXR3ZWVuIGBzdGFydGAgYW5kXG4gKiBgZW5kYCBleGNsdXNpdmUuIE9wdGlvbmFsbHksIHBhc3MgYSBzdGVwLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgdmFyIGV2ZW5zID0gcmFuZ2UoMCwgMTAwLCAyKTtcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAqICAgICBTdGFydGluZyB2YWx1ZSBvZiB0aGUgcmFuZ2UuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGVuZFxuICogICAgIEVuZGluZyB2YWx1ZSwgZXhjbHVzaXZlLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RlcD0xXVxuICogICAgIFRoZSBpbnRlcnZhbCBiZXR3ZWVuIGVhY2ggc3RlcC5cbiAqXG4gKiBAcmV0dXJucyB7SXRlcmF0b3J9XG4gKiAgICAgQW4gaXRlcmF0b3Igb3ZlciB0aGUgcmFuZ2UuXG4gKlxuICogQG1lbWJlck9mIGxhenlmdW5rXG4gKi9cbmZ1bmN0aW9uIHJhbmdlKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgICB2YXIgaTtcblxuICAgIHJldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcChmdW5jdGlvbiByYW5nZSQoY29udGV4dCQxJDApIHtcbiAgICAgICAgd2hpbGUgKDEpIHN3aXRjaCAoY29udGV4dCQxJDAucHJldiA9IGNvbnRleHQkMSQwLm5leHQpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgaWYgKHN0ZXAgPT0gbnVsbCkgeyBzdGVwID0gMSB9XG4gICAgICAgICAgICBpID0gc3RhcnQ7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGlmICghKGkgPCBlbmQpKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dCQxJDAubmV4dCA9IDg7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRleHQkMSQwLm5leHQgPSA1O1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIGkrPXN0ZXA7XG4gICAgICAgICAgICBjb250ZXh0JDEkMC5uZXh0ID0gMjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0JDEkMC5zdG9wKCk7XG4gICAgICAgIH1cbiAgICB9LCByYW5nZSwgdGhpcyk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSByYW5nZTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vbGliL3JhbmdlLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGNvcHkgPSByZXF1aXJlKCcuL2NvcHknKTtcbnZhciBjdXJyeSA9IHJlcXVpcmUoJy4vY3VycnknKTtcbnZhciBpdGVyYXRlID0gcmVxdWlyZSgnLi9pdGVyYXRlJyk7XG5cbi8qKlxuICogUmVkdWNlcyBhIHNlcXVlbmNlIHRvIGEgc2luZ2xlIHZhbHVlLCBwcm9kdWNlZCBieSBpbnZva2luZ1xuICogdGhlIGByZWR1Y2VyYCBmdW5jdGlvbiBvbiBlYWNoIHZhbHVlLCBhbG9uZyB3aXRoIHRoZSBhY2N1bXVsYXRlZFxuICogdmFsdWUsIGFuZCBjb2xsZWN0aW5nIHRoZSByZXN1bHQgYXMgdGhlIG5ldyBhY2N1bXVsYXRvci5cbiAqXG4gKiBDdXJyaWVkLCBzbyBlYWNoIGludm9jYXRpb24gd2lsbCByZXR1cm4gYSBwYXJ0aWFsIGFwcGxpY2F0aW9uXG4gKiB1bnRpbCBhbGwgdGhlIGFyZ3VtZW50cyBoYXZlIGJlZW4gcHJvdmlkZWQuIFNlZSB7QGxpbmsgY3Vycnl9LlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgLy8gUGFydGlhbCBhcHBsaWNhdGlvblxuICogICAgIHZhciBhZGQgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhICsgYiB9O1xuICogICAgIHZhciBzdW0gPSByZWR1Y2UoYWRkKTtcbiAqICAgICBzdW0oMCwgWzEsIDIsIDMsIDRdKTtcbiAqXG4gKiBAZXhhbXBsZVxuICogICAgIC8vIEZ1bGwgaW52b2thdGlvblxuICogICAgIHJlZHVjZShhZGQsIDAsIFsxLCAyLCAzLCA0XSk7XG4gKlxuICogQHBhcmFtIHtyZWR1Y2VyfSByZWR1Y2VyXG4gKiAgICAgQSBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZSBhbmRcbiAqICAgICBhIHZhbHVlLCBhbmQgc2hvdWxkIHJldHVyblxuICpcbiAqIEBwYXJhbSB7YW55fSBpbml0aWFsXG4gKiAgICAgVGhlIGluaXRpYWwgdmFsdWUgZm9yIHRoZSBhY2N1bXVsYXRvci5cbiAqXG4gKiBAcGFyYW0ge0l0ZXJhdG9yfEFycmF5LWxpa2V9IGl0ZXJhYmxlXG4gKiAgICAgQW4gYEl0ZXJhdG9yYCAob3IgYXJyYXktbGlrZSkgdG8gZmlsdGVyLlxuICpcbiAqIEByZXR1cm5zIHthbnl9XG4gKiAgICAgQW4gaXRlcmF0b3Igb3ZlciB0aGUgcmVzdWx0cywgb3IgYSBwYXJ0aWFsIGFwcGxpY2F0aW9uIHVudGlsXG4gKiAgICAgYWxsIGFyZ3VtZW50cyBoYXZlIGJlZW4gcHJvdmlkZWQuXG4gKlxuICogQG1lbWJlck9mIGxhenlmdW5rXG4gKi9cbmZ1bmN0aW9uIHJlZHVjZShyZWR1Y2VyLCBpbml0aWFsLCBpdGVyYWJsZSkge1xuICAgIC8vIENsb25lIGlmIG5vdCBwcmltaXRpdmVcbiAgICB2YXIgYWNjID0gY29weShpbml0aWFsKTtcbiAgICAvLyBNYWtlIGl0ZXJhYmxlIGlmIG5vdC5cbiAgICBpZiAoIWl0ZXJhYmxlLm5leHQpIHtcbiAgICAgICAgaXRlcmFibGUgPSBpdGVyYXRlKGl0ZXJhYmxlKTtcbiAgICB9XG4gICAgLy8gTWFudWFsIGl0ZXJhdGlvbi5cbiAgICB2YXIgc3RlcDtcbiAgICB3aGlsZSAoIChzdGVwID0gaXRlcmFibGUubmV4dCgpKSAmJiAhc3RlcC5kb25lICkge1xuICAgICAgICBhY2MgPSByZWR1Y2VyKGFjYywgc3RlcC52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3VycnkocmVkdWNlKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vbGliL3JlZHVjZS5qc1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogTWFrZXMgYSBzaGFsbG93IGNvcHkgb2YgYW4gb2JqZWN0IG9yIGFycmF5LWxpa2UuXG4gKiBQcmltaXRpdmVzIGFyZSByZXR1cm5lZCBhcy1pcy5cbiAqXG4gKiBAcGFyYW0gIHthbnl9IG9ialxuICogQHJldHVybiB7YW55fVxuICpcbiAqIEBwcml2YXRlXG4gKiBAbWVtYmVyT2YgbGF6eWZ1bmtcbiAqL1xuZnVuY3Rpb24gY29weShvYmopIHtcblx0Ly8gUHJpbWl0aXZlXG5cdGlmICh0eXBlb2Yob2JqKSAhPT0gJ29iamVjdCcpIHtcblx0XHRyZXR1cm4gb2JqO1xuXHR9XG5cdC8vIEFycmF5LWxpa2Vcblx0aWYgKCdsZW5ndGgnIGluIG9iaikge1xuXHRcdHJldHVybiBjb3B5QXJyYXkob2JqKTtcblx0fVxuXHQvLyBPYmplY3Rcblx0cmV0dXJuIGNvcHlPYmplY3Qob2JqKTtcbn1cblxuZnVuY3Rpb24gY29weUFycmF5KGFycikge1xuXHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcbn1cblxuZnVuY3Rpb24gY29weU9iamVjdChvYmopIHtcblx0dmFyIHJlc3VsdCA9IHt9O1xuXHRmb3IgKHZhciBrIGluIG9iaikge1xuXHRcdHJlc3VsdFtrXSA9IG9ialtrXTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2xpYi9jb3B5LmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvbWFzdGVyL0xJQ0VOU0UgZmlsZS4gQW5cbiAqIGFkZGl0aW9uYWwgZ3JhbnQgb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpblxuICogdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbiEoZnVuY3Rpb24oKSB7XG4gIHZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID1cbiAgICB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuXG4gIGlmICh0eXBlb2YgcmVnZW5lcmF0b3JSdW50aW1lID09PSBcIm9iamVjdFwiKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHJ1bnRpbWUgPSByZWdlbmVyYXRvclJ1bnRpbWUgPVxuICAgIHR5cGVvZiBleHBvcnRzID09PSBcInVuZGVmaW5lZFwiID8ge30gOiBleHBvcnRzO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TGlzdCkge1xuICAgIHJldHVybiBuZXcgR2VuZXJhdG9yKGlubmVyRm4sIG91dGVyRm4sIHNlbGYgfHwgbnVsbCwgdHJ5TGlzdCB8fCBbXSk7XG4gIH1cbiAgcnVudGltZS53cmFwID0gd3JhcDtcblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBwcm9wZXJ0eSBmb3JcbiAgLy8gZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvciBvYmplY3RzLlxuICB2YXIgR0YgPSBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9O1xuICB2YXIgR0ZwID0gZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fTtcbiAgdmFyIEdwID0gR0ZwLnByb3RvdHlwZSA9IEdlbmVyYXRvci5wcm90b3R5cGU7XG4gIChHRnAuY29uc3RydWN0b3IgPSBHRikucHJvdG90eXBlID1cbiAgICBHcC5jb25zdHJ1Y3RvciA9IEdGcDtcblxuICAvLyBFbnN1cmUgaXNHZW5lcmF0b3JGdW5jdGlvbiB3b3JrcyB3aGVuIEZ1bmN0aW9uI25hbWUgbm90IHN1cHBvcnRlZC5cbiAgdmFyIEdGTmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgaWYgKEdGLm5hbWUgIT09IEdGTmFtZSkgR0YubmFtZSA9IEdGTmFtZTtcbiAgaWYgKEdGLm5hbWUgIT09IEdGTmFtZSkgdGhyb3cgbmV3IEVycm9yKEdGTmFtZSArIFwiIHJlbmFtZWQ/XCIpO1xuXG4gIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gZ2VuRnVuICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvciA/IEdGLm5hbWUgPT09IGN0b3IubmFtZSA6IGZhbHNlO1xuICB9O1xuXG4gIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHRnA7XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxpc3QpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgZ2VuZXJhdG9yID0gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMaXN0KTtcbiAgICAgIHZhciBjYWxsTmV4dCA9IHN0ZXAuYmluZChnZW5lcmF0b3IubmV4dCk7XG4gICAgICB2YXIgY2FsbFRocm93ID0gc3RlcC5iaW5kKGdlbmVyYXRvcltcInRocm93XCJdKTtcblxuICAgICAgZnVuY3Rpb24gc3RlcChhcmcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgaW5mbyA9IHRoaXMoYXJnKTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihjYWxsTmV4dCwgY2FsbFRocm93KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjYWxsTmV4dCgpO1xuICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMaXN0KSB7XG4gICAgdmFyIGdlbmVyYXRvciA9IG91dGVyRm4gPyBPYmplY3QuY3JlYXRlKG91dGVyRm4ucHJvdG90eXBlKSA6IHRoaXM7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMaXN0KTtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGhhcyBhbHJlYWR5IGZpbmlzaGVkXCIpO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGluZm8gPSBkZWxlZ2F0ZS5pdGVyYXRvclttZXRob2RdKGFyZyk7XG5cbiAgICAgICAgICAgIC8vIERlbGVnYXRlIGdlbmVyYXRvciByYW4gYW5kIGhhbmRsZWQgaXRzIG93biBleGNlcHRpb25zIHNvXG4gICAgICAgICAgICAvLyByZWdhcmRsZXNzIG9mIHdoYXQgdGhlIG1ldGhvZCB3YXMsIHdlIGNvbnRpbnVlIGFzIGlmIGl0IGlzXG4gICAgICAgICAgICAvLyBcIm5leHRcIiB3aXRoIGFuIHVuZGVmaW5lZCBhcmcuXG4gICAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIH0gY2F0Y2ggKHVuY2F1Z2h0KSB7XG4gICAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gTGlrZSByZXR1cm5pbmcgZ2VuZXJhdG9yLnRocm93KHVuY2F1Z2h0KSwgYnV0IHdpdGhvdXQgdGhlXG4gICAgICAgICAgICAvLyBvdmVyaGVhZCBvZiBhbiBleHRyYSBmdW5jdGlvbiBjYWxsLlxuICAgICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgICAgYXJnID0gdW5jYXVnaHQ7XG5cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgICAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuICAgICAgICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuICAgICAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCAmJlxuICAgICAgICAgICAgICB0eXBlb2YgYXJnICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICBcImF0dGVtcHQgdG8gc2VuZCBcIiArIEpTT04uc3RyaW5naWZ5KGFyZykgKyBcIiB0byBuZXdib3JuIGdlbmVyYXRvclwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCkge1xuICAgICAgICAgICAgY29udGV4dC5zZW50ID0gYXJnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgY29udGV4dC5zZW50O1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGFyZykpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgICAgbWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBpbm5lckZuLmNhbGwoc2VsZiwgY29udGV4dCk7XG5cbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAodmFsdWUgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmRlbGVnYXRlICYmIG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoICh0aHJvd24pIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuXG4gICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24odGhyb3duKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJnID0gdGhyb3duO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRvci5uZXh0ID0gaW52b2tlLmJpbmQoZ2VuZXJhdG9yLCBcIm5leHRcIik7XG4gICAgZ2VuZXJhdG9yW1widGhyb3dcIl0gPSBpbnZva2UuYmluZChnZW5lcmF0b3IsIFwidGhyb3dcIik7XG4gICAgZ2VuZXJhdG9yW1wicmV0dXJuXCJdID0gaW52b2tlLmJpbmQoZ2VuZXJhdG9yLCBcInJldHVyblwiKTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cblxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeSh0cmlwbGUpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogdHJpcGxlWzBdIH07XG5cbiAgICBpZiAoMSBpbiB0cmlwbGUpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gdHJpcGxlWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIHRyaXBsZSkge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IHRyaXBsZVsyXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5LCBpKSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBpID09PSAwID8gXCJub3JtYWxcIiA6IFwicmV0dXJuXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBydW50aW1lLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gaXRlcmFibGU7XG4gICAgaWYgKGl0ZXJhdG9yU3ltYm9sIGluIGl0ZXJhYmxlKSB7XG4gICAgICBpdGVyYXRvciA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXSgpO1xuICAgIH0gZWxzZSBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgIHZhciBpID0gLTE7XG4gICAgICBpdGVyYXRvciA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoaSBpbiBpdGVyYWJsZSkge1xuICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICB9O1xuICAgICAgaXRlcmF0b3IubmV4dCA9IGl0ZXJhdG9yO1xuICAgIH1cbiAgICByZXR1cm4gaXRlcmF0b3I7XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIHRoaXMuc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICAvLyBQcmUtaW5pdGlhbGl6ZSBhdCBsZWFzdCAyMCB0ZW1wb3JhcnkgdmFyaWFibGVzIHRvIGVuYWJsZSBoaWRkZW5cbiAgICAgIC8vIGNsYXNzIG9wdGltaXphdGlvbnMgZm9yIHNpbXBsZSBnZW5lcmF0b3JzLlxuICAgICAgZm9yICh2YXIgdGVtcEluZGV4ID0gMCwgdGVtcE5hbWU7XG4gICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIHRlbXBOYW1lID0gXCJ0XCIgKyB0ZW1wSW5kZXgpIHx8IHRlbXBJbmRleCA8IDIwO1xuICAgICAgICAgICArK3RlbXBJbmRleCkge1xuICAgICAgICB0aGlzW3RlbXBOYW1lXSA9IG51bGw7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcbiAgICAgICAgcmV0dXJuICEhY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfZmluZEZpbmFsbHlFbnRyeTogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmIChcbiAgICAgICAgICAgICAgZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYyB8fFxuICAgICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSkge1xuICAgICAgICAgIHJldHVybiBlbnRyeTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgdmFyIGVudHJ5ID0gdGhpcy5fZmluZEZpbmFsbHlFbnRyeSgpO1xuICAgICAgdmFyIHJlY29yZCA9IGVudHJ5ID8gZW50cnkuY29tcGxldGlvbiA6IHt9O1xuXG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gZW50cnkuZmluYWxseUxvYztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICB2YXIgZW50cnkgPSB0aGlzLl9maW5kRmluYWxseUVudHJ5KGZpbmFsbHlMb2MpO1xuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbik7XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSwgaSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3JlZ2VuZXJhdG9yL3J1bnRpbWUuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIiLCJmaWxlIjoiLi9kaXN0L2xhenlmdW5rLmpzIn0=