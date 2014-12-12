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
		filename: './dist/lazyfunk.min.js',
		library: 'lazyfunk',
		libraryTarget: 'umd'
	},

	externals: {},

	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	]

};