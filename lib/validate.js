'use strict';

// MODULES //

var isObject = require( 'validate.io-object' );
var isString = require( 'validate.io-string-primitive' );
var isBoolean = require( 'validate.io-boolean-primitive' );
var isStringArray = require( 'validate.io-string-primitive-array' );
var isNonNegativeInteger = require( 'validate.io-nonnegative-integer' );


// VALIDATE //

/**
* FUNCTION: validate( opts, options )
*	Validates function options.
*
* @param {Object} opts - destination object
* @param {Object} options - options to validate
* @param {String[]} options.packages - package names
* @param {String} [options.registry] - registry
* @param {Number} [options.port] - registry port
* @param {String} [options.protocol] - registry protocol
* @param {Boolean} [options.latest] - boolean indicating whether to return only the latest package info
* @returns {Error|Null} error or null
*/
function validate( opts, options ) {
	if ( !isObject( options ) ) {
		return new TypeError( 'invalid input argument. Options argument must be an object. Value: `' + options + '`.' );
	}
	opts.packages = options.packages;
	if ( !isStringArray( opts.packages ) ) {
		return new TypeError( 'invalid option. Packages option must be a string array. Option: `' + opts.packages + '`.' );
	}
	if ( options.hasOwnProperty( 'registry' ) ) {
		opts.registry = options.registry;
		if ( !isString( opts.registry ) ) {
			return new TypeError( 'invalid option. Registry option must be a string. Option: `' + opts.registry + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'port' ) ) {
		opts.port = options.port;
		if ( !isNonNegativeInteger( opts.port ) ) {
			return new TypeError( 'invalid option. Port option must be a nonnegative integer. Option: `' + opts.port + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'protocol' ) ) {
		opts.protocol = options.protocol;
		if ( opts.protocol !== 'http' && opts.protocol !== 'https' ) {
			return new TypeError( 'invalid option. The following protocols are supported: `"http", "https"`. Option: `' + opts.protocol + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'latest' ) ) {
		opts.latest = options.latest;
		if ( !isBoolean( opts.latest ) ) {
			return new TypeError( 'invalid option. Latest option must be a boolean primitive. Option: `' + opts.latest + '`.' );
		}
	}
	return null;
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;
