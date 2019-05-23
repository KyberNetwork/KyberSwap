const path = require('path');
const webpack = require('webpack');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = env => {

    const outputPath = env.chain ? 'dist/' + env.chain : '/src';

    const timestamp = Date.now();

    let entry = {
        app: ['babel-polyfill', path.resolve(__dirname, 'src/js/client.js'), path.resolve(__dirname, 'src/assets/css/app.scss')]
    };
    let plugins = [
        new webpack.ProgressPlugin(),        
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new CleanPlugin([outputPath + '/app.*', outputPath + '/libary.*']),
        new HtmlWebpackPlugin({
            title: 'Wallet - kyber.network',
            template: './app.html',
            favicon: './assets/img/favicon.png',
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            'env': JSON.stringify(env.chain),
            'process.env': {
                'logger': 'true',
                'env': JSON.stringify(env.chain)
            }
        })
    ];
return {
    context: path.join(__dirname, 'src'),
    mode: env && env.build === 'true' ? "production" : "development",
    devtool: env && env.build === 'true' ? false : 'inline-sourcemap',
    entry: entry,
    output: {
        path: path.join(__dirname, outputPath),
        filename: `[name].min.${timestamp}.js`,
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015', 'stage-0'],
                plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
            }
        },
        {
            test: /\.(css|sass|scss)$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                        sourceMap: true
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ]
        },
        {
            test: /\.(jpe?g|png|gif|svg|ttf)$/i,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 15000
                    }
                }
            ]
        }
        ]
    },
    plugins: plugins
}
};


