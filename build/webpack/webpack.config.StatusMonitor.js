/*
 * Webpack Requires
 */
var webpack = require('webpack');
var fs = require('fs');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;
var SharedSettings = require('./../shared');

/*
 * Webpack Variables
 */
/**
 * The library name
 * @type {string}
 */
var libraryName = SharedSettings.libraryName;
var libraryFullName = SharedSettings.libraryFullName;
var versionNumber = SharedSettings.versionNumber;
var versionName = SharedSettings.versionName;
var buildNumber = SharedSettings.buildNumber;
var binName = 'compiled';

/*
 * Webpack Plugin config
 */
var plugins = [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        __LIB_NAME__: JSON.stringify(libraryName),
        __LIB_FULL_NAME__: JSON.stringify(libraryFullName),
        __VERSION__: JSON.stringify(versionNumber),
        __VERSION_ID__: JSON.stringify(buildNumber),
        __VERSION_NAME__: JSON.stringify(versionName),
        __VERSION_STRING__: JSON.stringify(versionNumber + ' Build: ' + buildNumber + ' - ' + versionName)
    })
], outputFile;

/*
 * Set the project output filename for the build
 */
if (env === 'build') plugins.push(new UglifyJsPlugin({ minimize: true }));
outputFile = binName + '.js';

/*
 * Imports the node modules for compiling server side
 */
var nodeModules = {

};

var StatusServiceConfig = {
    stats: {
        colors: true
    },
    entry: {
        StatusService: './src/service/status/src/modules/init.js'
    },
    debug: false,
    cache: false,
    target: 'web',
    output: {
        path: './src/service/status/public/js',
        filename: binName + '.js',
        publicPath: '/js',
        libraryTarget: 'var'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
            }
        ]
    },
    resolve: {
        root: path.resolve('./src/service/status/src/modules'),
        extensions: ['', '.js']
    },
    plugins: plugins,
    externals: nodeModules,
    devtool: 'source-map',
};

/*
 * Export webpack configs
 */
module.exports = [
    StatusServiceConfig
];

