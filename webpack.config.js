var path = require('path');
var TransferWebpackPlugin = require('transfer-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'index.js'),
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
    plugins: [
        new TransferWebpackPlugin([
            { from: 'public/', to: 'assets/' }
        ])
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'rtmp.js',
        library: 'RTMP',
        libraryTarget: 'umd',
    },
};
