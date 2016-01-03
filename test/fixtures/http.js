'use strict';

// MODULES //

var request = require( './request.js' );


// HTTP //

/**
* FUNCTION: http( err[, statusCode[, body] ] )
*	Returns a mock `http` module.
*
* @param {Error|Null} err - error object
* @param {Number} [statusCode=200] - status code
* @param {String|Boolean} [body] - response body or boolean indicating to only return the "latest" data
* @returns {Object} mock `http` module
*/
function http( err, statusCode, body ) {
	var obj = {};
	obj.request = request( obj, err, statusCode, body );
	return obj;
} // end FUNCTION http()


// EXPORTS //

module.exports = http;
