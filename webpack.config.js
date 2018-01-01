var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './app/driver.js',
    output: {
        path: __dirname + '/static/js',
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
                loader: ExtractTextPlugin.extract("css")
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'underscore',
        }),
        new ExtractTextPlugin('css/app.css')
    ],
    resolve: {
        modules: [__dirname + '/node_modules', __dirname + '/app']
    },
    resolveLoader: {
        modules: [__dirname + '/node_modules']
    }
};