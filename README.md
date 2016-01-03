Package Info
===
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url]

> Get package information for one or more packages.


## Installation

``` bash
$ npm install npm-registry-package-info
```


## Usage

``` javascript
var pkginfo = require( 'npm-registry-package-info' );
```

#### pkginfo( opts, clbk )

Get package information for one or more packages.

``` javascript
var opts = {
	'packages': [
		'dstructs-matrix',
		'compute-erf',
		'utils-copy',
		'unknown_package_name'
	]	
};

pkginfo( opts, clbk );

function clbk( error, data ) {
	if ( error ) {
		throw error;
	}
	console.dir( data );
	/*
		{
			"meta": {
				"total": 5,
				"success": 4,
				"failure": 1
			},
			"data": {
				"dstructs-matrix": {...},
				"compute-erf": {...},
				"utils-copy": {...}
			},
			"failures": {
				"unknown_package_name": "Not Found"
			}
	*/
}
```

The `function` accepts the following `options`:

*	__packages__: `array` of package names (*required*).
*	__registry__: registry. Default: `'registry.npmjs.org'`.
*	__port__: registry port. Default: `443` (HTTPS) or `80` (HTTP).
* 	__protocol__: registry protocol. Default: `'https'`.
* 	__latest__: `boolean` indicating whether to return only the __latest__ package information from a registry.

To query an alternative registry, set the relevant options.

``` javascript
var opts = {
	'packages': [
		'dstructs-array',
		'flow-map',
		'utils-merge2'
	],
	'registry': 'my.favorite.npm/registry',
	'port': 80,
	'latest': true,
	'protocol': 'http'
};

pkginfo( opts, clbk );
```


#### pkginfo.factory( opts, clbk )

Creates a reusable `function`.

``` javascript
var pkgs = [
	'dstructs-matrix',
	'compute-stdev',
	'compute-variance'
];

var get = pkginfo.factory( {'packages': pkgs}, clbk );

get();
get();
get();
// ...
```

The factory method accepts the same `options` as `pkginfo()`.


## Notes

*	If the module encounters an application-level `error` (e.g., no network connection, non-existent registry, etc), that `error` is returned immediately to the provided `callback`.
*	If the module encounters a downstream `error` (e.g., timeout, reset connection, etc), that `error` is included in the returned results under the `failures` field.


## Examples

``` javascript
var ls = require( 'npm-list-author-packages' );
var pkginfo = require( 'npm-registry-package-info' );

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
```

To run the example code from the top-level application directory,

``` bash
$ DEBUG=* node ./examples/index.js
```


---
## CLI

### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g npm-registry-package-info
```


### Usage

``` bash
Usage: pkginfo [options] pkg1 pkg2 ...

Options:

  -h,  --help                Print this message.
  -V,  --version             Print the package version.
  -p,  --port port           Registry port. Default: 443 (HTTPS) or 80 (HTTP).
       --registry registry   Registry. Default: 'registry.npmjs.org'.
       --protocol protocol   Registry protocol. Default: 'https'.
       --latest              Only return the latest package entry.
```


### Notes

*	If a package is successfully resolved, the package info is written to `stdout`.
*	If a package cannot be resolved due to a downstream `error` (failure), the package (and its associated `error`) is written to `sterr`.
*	Output order is __not__ guaranteed to match input order.


### Examples

``` bash
$ DEBUG=* pkginfo dstructs-matrix compute-erf utils-copy
# => {...}
```


---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2016. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/npm-registry-package-info.svg
[npm-url]: https://npmjs.org/package/npm-registry-package-info

[build-image]: http://img.shields.io/travis/kgryte/npm-registry-package-info/master.svg
[build-url]: https://travis-ci.org/kgryte/npm-registry-package-info

[coverage-image]: https://img.shields.io/codecov/c/github/kgryte/npm-registry-package-info/master.svg
[coverage-url]: https://codecov.io/github/kgryte/npm-registry-package-info?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/npm-registry-package-info.svg
[dependencies-url]: https://david-dm.org/kgryte/npm-registry-package-info

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/npm-registry-package-info.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/npm-registry-package-info

[github-issues-image]: http://img.shields.io/github/issues/kgryte/npm-registry-package-info.svg
[github-issues-url]: https://github.com/kgryte/npm-registry-package-info/issues

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com
