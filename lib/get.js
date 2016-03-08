'use strict';

// MODULES //

var debug = require( 'debug' )( 'npm-registry-package-info:get' );
var request = require( './request.js' );


// VARIABLES //

var NUM_CONCURRENT_REQUESTS = 20; // FIXME: heuristic


// GET //

/**
* FUNCTION: get( opts, clbk )
*	Get package info.
*
* @param {Object} opts - options
* @param {Function} clbk - callback to invoke after getting package info
* @returns {Void}
*/
function get( opts, clbk ) {
	var scount;
	var fcount;
	var count;
	var pkgs;
	var eFLG;
	var out;
	var idx;
	var len;
	var i;

	// Output data store:
	out = {};
	out.meta = {};
	out.data = {};
	out.failures = {};

	// Number of completed requests:
	count = 0;
	scount = 0; // success
	fcount = 0; // failures

	// Request id:
	idx = 0;

	pkgs = opts.packages;
	len = pkgs.length;

	debug( 'Number of packages: %d.', len );
	out.meta.total = len;

	debug( 'Beginning queries...' );
	for ( i = 0; i < NUM_CONCURRENT_REQUESTS; i++ ) {
		next();
	}
	/**
	* FUNCTION: next()
	*	Requests package data for the next package in the queue. Once requests for all desired packages have completed, invokes the provided callback.
	*
	* @private
	* @returns {Void}
	*/
	function next() {
		if ( count === len ) {
			debug( 'Finished all queries.' );
			out.meta.success = scount;
			out.meta.failure = fcount;
			return clbk( null, out );
		}
		if ( idx < len ) {
			debug( 'Querying for package: `%s` (%d)...', pkgs[idx], idx );
			request( pkgs[idx], opts, onResponse( pkgs[idx], idx ) );
			idx += 1;
		}
	} // end FUNCTION next()

	/**
	* FUNCTION: onResponse( pkg, idx )
	*	Returns a response callback.
	*
	* @private
	* @param {String} pkg - package name
	* @param {Number} idx - request index
	* @returns {Function} response callback
	*/
	function onResponse( pkg, idx ) {
		/**
		* FUNCTION: onResponse( error, data )
		*	Callback invoked upon receiving a request response.
		*
		* @private
		* @param {Error|Null} error - error object
		* @param {Object} data - response data
		* @returns {Void}
		*/
		return function onResponse( error, data ) {
			if ( eFLG ) {
				return;
			}
			debug( 'Response received for package: `%s` (%d).', pkg, idx );
			if ( error ) {
				if ( error instanceof Error ) {
					eFLG = true;
					return clbk( error );
				}
				debug( 'Failed to resolve package `%s` (%d): %s', pkg, idx, error.message );
				out.failures[ pkg ] = error.message;
				fcount += 1;
			} else {
				debug( 'Successfully resolved package `%s` (%d).', pkg, idx );
				out.data[ pkg ] = data;
				scount += 1;
			}
			count += 1;
			debug( 'Request %d of %d complete.', count, len );
			next();
		}; // end FUNCTION onResponse()
	} // end FUNCTION onResponse()
} // end FUNCTION get()


// EXPORTS //

module.exports = get;
