var path = require('path'),
    webpack = require('webpack'),
    TransferWebpackPlugin = require('transfer-webpack-plugin'),
    minimize = process.argv.indexOf('--no-minimize') === -1 ? true : false,
    plugins = [new TransferWebpackPlugin([
        { from: 'public/', to: 'assets/' }
    ])],
    filename = 'rtmp.js';

if (minimize) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    filename = 'rtmp.min.js';
}

module.exports = {
    entry: path.resolve(__dirname, 'index.js'),
    devtool: minimize ? "source-map" : "",
    externals: {
        clappr: 'Clappr',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    compact: true,
                }
            },
            { test: /\.(png|woff|eot|ttf|swf)/, loader: 'file-loader' }
        ],
    },
    resolve: {
        extensions: ['', '.js'],
    },
    plugins: plugins,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: filename,
        library: 'RTMP',
        libraryTarget: 'umd',
    },
};
