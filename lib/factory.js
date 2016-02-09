'use strict';

// MODULES //

var isFunction = require( 'validate.io-function' );
var merge = require( 'utils-merge2' )();
var validate = require( './validate.js' );
var defaults = require( './defaults.json' );
var get = require( './get.js' );


// VARIABLES //

var DEFAULT_HTTP_PORT = 80;
var DEFAULT_HTTPS_PORT = 443;


// FACTORY //

/**
* FUNCTION: factory( options, clbk )
*	Returns a function for getting package info from a registry.
*
* @param {Object} options - function options
* @param {String[]} options.packages - package names
* @param {String} [options.registry="registry.npmjs.org"] - registry
* @param {Number} [options.port=443] - registry port
* @param {String} [options.protocol="https"] - registry protocol
* @param {Boolean} [options.latest=false] - boolean indicating whether to return only the latest package info from a registry
* @param {Function} clbk - callback to invoke upon query completion
* @returns {Function} function for getting package info
*/
function factory( options, clbk ) {
	var opts;
	var err;
	opts = merge( {}, defaults );
	err = validate( opts, options );
	if ( err ) {
		throw err;
	}
	if ( opts.port === null ) {
		if ( opts.protocol === 'https' ) {
			opts.port = DEFAULT_HTTPS_PORT;
		} else {
			opts.port = DEFAULT_HTTP_PORT;
		}
	}
	if ( !isFunction( clbk ) ) {
		throw new TypeError( 'invalid input argument. Callback argument must be a function. Value: `' + clbk + '`.' );
	}
	/**
	* FUNCTION: pkginfo()
	*	Gets package info for one or more packages.
	*
	* @returns {Void}
	*/
	return function pkginfo() {
		get( opts, done );
		/**
		* FUNCTION: done( error, data )
		*	Callback invoked after query completion.
		*
		* @private
		* @param {Error|Null} error - error object
		* @param {Object} data - query data
		* @returns {Void}
		*/
		function done( error, data ) {
			if ( error ) {
				return clbk( error );
			}
			clbk( null, data );
		} // end FUNCTION done()
	}; // end FUNCTION pkginfo()
} // end FUNCTION factory()


// EXPORTS //

module.exports = factory;
