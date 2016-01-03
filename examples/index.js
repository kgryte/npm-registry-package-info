'use strict';

var ls = require( 'npm-list-author-packages' );
var pkginfo = require( './../lib' );

var opts = {
	'username': 'kgryte'
};

ls( opts, onList );

function onList( error, list ) {
	var opts;
	if ( error ) {
		throw error;
	}
	if ( !list.length ) {
		return {};
	}
	opts = {
		'packages': list
	};
	pkginfo( opts, onInfo );
}

function onInfo( error, data ) {
	if ( error ) {
		throw error;
	}
	console.dir( data );
}
