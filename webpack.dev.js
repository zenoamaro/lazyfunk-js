'use strict';
var webpack = require('webpack');

module.exports = {

	entry: './lib/index.js',

	resolve: {
		extensions: ['', '.js']
	},

	module: {
		loaders: [
			{ test:/\.js$/, loader:'regenerator-loader' }
		]
	},

	output: {
		pathinfo: true,
		filename: './dist/lazyfunk.js',
		library: 'lazyfunk',
		libraryTarget: 'umd'
	},

	externals: {},

	debug: true,
	devtool: 'inline-source-map'

};