'use strict';

// MODULES //

var test = require( 'tape' );
var assert = require( 'chai' ).assert;
var proxyquire = require( 'proxyquire' );
var get = require( './../lib/get.js' );


// FIXTURES //

var data = require( './fixtures/data.json' );
var getOpts = require( './fixtures/opts.js' );


// TESTS //

test( 'file exports a function', function test( t ) {
	t.ok( typeof get === 'function', 'export is a function' );
	t.end();
});

test( 'function returns an error to a provided callback if an application-level error is encountered when fetching package info', function test( t ) {
	var opts;
	var get;

	get = proxyquire( './../lib/get.js', {
		'./request.js': request
	});

	opts = getOpts();
	get( opts, done );

	function request( name, opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( new Error( 'beep' ) );
		}
	}

	function done( error ) {
		t.ok( error instanceof Error, 'error instance' );
		t.equal( error.message, 'beep' );
		t.end();
	}
});

test( 'the function returns a JSON object upon attempting to resolve all specified packages', function test( t ) {
	var opts;
	var get;

	get = proxyquire( './../lib/get.js', {
		'./request.js': request
	});

	opts = getOpts();
	get( opts, done );

	function request( name, opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, data );
		}
	}

	function done( error, data ) {
		if ( error ) {
			throw error;
		}
		t.equal( typeof data, 'object', 'returns an object' );
		t.end();
	}
});

test( 'the returned JSON object has a `meta` field which contains meta data documenting how many packages were successfully resolved', function test( t ) {
	var expected;
	var opts;
	var get;

	get = proxyquire( './../lib/get.js', {
		'./request.js': request
	});

	expected = {
		'meta': {
			'total': 1,
			'success': 1,
			'failure': 0
		},
		'data': {
			'dstructs-matrix': data
		},
		'failures': {}
	};

	opts = getOpts();
	get( opts, done );

	function request( name, opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, data );
		}
	}

	function done( error, data ) {
		if ( error ) {
			throw error;
		}
		t.equal( data.meta.total, 1, 'returns package total' );
		t.equal( data.meta.success, 1, 'returns number of successes' );
		t.equal( data.meta.failure, 0, 'returns number of failures' );
		t.end();
	}
});

test( 'the returned JSON object has a `data` field which contains a package hash with package info', function test( t ) {
	var expected;
	var opts;
	var get;

	get = proxyquire( './../lib/get.js', {
		'./request.js': request
	});

	expected = {
		'meta': {
			'total': 1,
			'success': 1,
			'failure': 0
		},
		'data': {
			'dstructs-matrix': data
		},
		'failures': {}
	};

	opts = getOpts();
	get( opts, done );

	function request( name, opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, data );
		}
	}

	function done( error, data ) {
		if ( error ) {
			throw error;
		}
		t.equal( data.meta.total, 1, 'returns package total' );
		t.equal( data.meta.success, 1, 'returns number of successes' );
		t.equal( data.meta.failure, 0, 'returns number of failures' );

		assert.deepEqual( data, expected );
		t.ok( true, 'deep equal' );
		t.end();
	}
});

test( 'when unable to resolve package info, the returned JSON object has a `failures` field which contains a package hash with error messages', function test( t ) {
	var expected;
	var opts;
	var get;

	get = proxyquire( './../lib/get.js', {
		'./request.js': request
	});

	expected = {
		'meta': {
			'total': 1,
			'success': 0,
			'failure': 1
		},
		'data': {},
		'failures': {
			'dstructs-matrix': 'Not Found'
		}
	};

	opts = getOpts();
	get( opts, done );

	function request( name, opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk({
				'status': 404,
				'message': 'Not Found'
			});
		}
	}

	function done( error, data ) {
		if ( error ) {
			throw error;
		}
		t.equal( data.meta.total, 1, 'returns package total' );
		t.equal( data.meta.success, 0, 'returns number of successes' );
		t.equal( data.meta.failure, 1, 'returns number of failures' );

		assert.deepEqual( data, expected );
		t.ok( true, 'deep equal' );
		t.end();
	}
});

test( 'the function resolves multiple packages', function test( t ) {
	var expected;
	var count;
	var opts;
	var get;

	get = proxyquire( './../lib/get.js', {
		'./request.js': request
	});

	opts = getOpts();
	opts.packages = [
		'dstructs-matrix',
		'utils-copy',
		'unknown_package_name'
	];
	count = -1;

	expected = {
		'meta': {
			'total': 3,
			'success': 2,
			'failure': 1
		},
		'data': {
			'dstructs-matrix': data,
			'utils-copy': data
		},
		'failures': {
			'unknown_package_name': 'Not Found'
		}
	};

	get( opts, done );

	function request( name, opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			count += 1;
			if ( count < 2 ) {
				return clbk( null, data );
			}
			if ( count === 2 ) {
				return clbk({
					'status': 404,
					'message': 'Not Found'
				});
			}
		}
	}

	function done( error, data ) {
		if ( error ) {
			throw error;
		}
		assert.deepEqual( data, expected );
		t.ok( true, 'deep equal' );
		t.end();
	}
});
