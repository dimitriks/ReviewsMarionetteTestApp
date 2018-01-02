var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './app/driver.js',
    output: {
        path: __dirname + '/dist/js',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'underscore-template-loader'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'underscore',
        }),
        new ExtractTextPlugin({
            filename: "[name].bundle.css",
            allChunks: true,
        })
    ],
    resolve: {
        modules: [__dirname + '/node_modules', __dirname + '/app']
    },
    resolveLoader: {
        modules: [__dirname + '/node_modules']
    },
    devServer: {
        contentBase: __dirname,
        port: 9000
    },
};