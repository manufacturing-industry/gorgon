/*
 * Webpack requires
 */
var webpack = require('webpack');
var fs = require('fs');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;
var SharedSettings = require('./shared');


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
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false }),
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
    'react': 'React',
    'react-dom': 'ReactDOM'
};

var StatusServiceConfig = {
    entry: {
        StatusService:[
            'webpack-hot-middleware/client',
            './src/service/status/src/index.js'
        ]
    },
    debug: true,
    cache: true,
    target: 'web',
    output: {
        path: './src/service/status/public/js',
        filename: binName + '.js',
        publicPath: '/static/assets/',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: "eslint-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js']
    },
    plugins: plugins,
    externals: nodeModules,
    devtool: '#eval-source-map'
};

/*
 * Export webpack configs
 */
module.exports = [
    StatusServiceConfig
];