/*
 * Webpack requires
 */
var webpack = require('webpack');
var fs = require('fs');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;
var childProcess = require('child_process');

/**
 * The library name
 * @type {string}
 */
var libraryName = 'gorgon';
var libraryFullName = 'Gorgon Server';
var versionNumber = '0.0.2';
var versionName = 'Pre-Alpha';
var buildNumber = childProcess.execSync('git rev-list HEAD --count').toString().replace(/(\r\n|\n|\r)/gm,"");
var motd = 'This is the message of the day.';

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
        __VERSION_STRING__: JSON.stringify(versionNumber + ' Build: ' + buildNumber + ' - ' + versionName),
        __MOTD__: JSON.stringify(motd)
    })
], outputFile;

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
 * Imports the node modules for compiling server side
 */
var nodeModules = {};

fs.readdirSync('node_modules')
.filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
})
.forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
});

/*
 * The webpack server build config
 */
var config = {
    entry: __dirname + '/src/gorgon.js',
    debug: true,
    target: 'node',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
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
    devtool: '#inline-source-map'
};

/*
 * Export webpack config
 */
module.exports = config;