'use strict';

// MODULES //

var test = require( 'tape' );
var assert = require( 'chai' ).assert;
var proxyquire = require( 'proxyquire' );
var pkginfo = require( './../lib/pkginfo.js' );


// FIXTURES //

var getOpts = require( './fixtures/opts.js' );
var data = {
	'meta': {
		'total': 1,
		'success': 1,
		'failure': 0
	},
	'data': {
		'dstructs-matrix': require( './fixtures/data.json' )
	},
	'failures': {}
};


// TESTS //

test( 'file exports a function', function test( t ) {
	t.ok( typeof pkginfo === 'function', 'export is a function' );
	t.end();
});

test( 'function returns an error to a provided callback if an error is encountered when fetching package info', function test( t ) {
	var pkginfo;
	var opts;

	pkginfo = proxyquire( './../lib/pkginfo.js', {
		'./factory.js': factory
	});

	opts = getOpts();
	pkginfo( opts, done );

	function factory( opts, clbk ) {
		return function pkginfo() {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				clbk( new Error( 'beep' ) );
			}
		};
	}

	function done( error ) {
		t.ok( error instanceof Error, 'error instance' );
		t.equal( error.message, 'beep' );
		t.end();
	}
});

test( 'function returns a package hash containing package info to a provided callback', function test( t ) {
	var expected;
	var pkginfo;
	var opts;

	pkginfo = proxyquire( './../lib/pkginfo.js', {
		'./factory.js': factory
	});

	expected = data;

	opts = getOpts();
	pkginfo( opts, done );

	function factory( opts, clbk ) {
		return function pkginfo() {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				clbk( null, data );
			}
		};
	}

	function done( error, data ) {
		assert.deepEqual( data, expected );
		t.ok( true, 'deep equal' );
		t.end();
	}
});
