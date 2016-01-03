'use strict';

// MODULES //

var factory = require( './factory.js' );


// PACKAGE INFO //

/**
* FUNCTION: pkginfo( options, clbk )
*	Get package info for one or more packages.
*
* @param {Object} options - function options
* @param {String[]} options.packages - package names
* @param {String} [options.registry="registry.npmjs.org"] - registry
* @param {Number} [options.port=443] - registry port
* @param {String} [options.protocol="https"] - registry protocol
* @param {Boolean} [options.latest=false] - boolean indicating whether to return only the latest package info
* @param {Function} clbk - callback to invoke upon query completion
* @returns {Void}
*/
function pkginfo( options, clbk ) {
	factory( options, clbk )();
} // end FUNCTION pkginfo()


// EXPORTS //

module.exports = pkginfo;
