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