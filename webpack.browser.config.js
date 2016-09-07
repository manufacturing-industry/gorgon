/*
 * Webpack requires
 */
var webpack = require('webpack');
var fs = require('fs');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;

/*
 * Controls the naming of the files created during the build
 */
if (env === 'build') {
    plugins.push(new UglifyJsPlugin({ minimize: true }));
    outputFile = libraryName + '.min.js';
} else {
    outputFile = libraryName + '.js';
}

/*
 * The webpack browser client build config
 */
var config = {

};

/*
 * Export webpack config
 */
module.exports = config;