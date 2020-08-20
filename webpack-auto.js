
const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('./webpack-shell-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin')
var BLOCKCHAIN_INFO = require("./env")
const fetch = require("node-fetch");
var fs = require('fs');
var sass = require('node-sass');
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

var getConfig = env => {
    var buildFolder = env
    var chain 
    switch(env){
        case "staging_limit_order":
            chain = "production"
            break
        case "production":
            chain = "production"
            break
        case "staging":
            chain = "staging"
            break
        case "semi_production":
            chain = "semi_production"
            break
        case "ropsten":
            chain = "ropsten"
            break
        case "dev":
            chain = "dev"
            break
        default:
            chain = "ropsten"
            break
    }
    const outputPath = `public/${buildFolder}`

    const timestamp = Date.now();

    let entry = {
        app: ['babel-polyfill', path.resolve(__dirname, 'src/js/client.js'), path.resolve(__dirname, 'src/assets/css/app.scss')]
    };
    let plugins = [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            title: 'Wallet - kyber.network',
            filename: 'index.html',
            template: './app.html',
            favicon: './assets/img/favicon.png',
            inject: 'body'
        }),
        new FriendlyErrorsWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),   
        new CleanPlugin([outputPath + '/app*', outputPath + '/libary*']),
        new webpack.DefinePlugin({
            'env': JSON.stringify(env),
            'process.env': {
                'logger': chain === 'production'?'false': 'true',
                'env': JSON.stringify(env),
                'integrate': true
            }
        }),
        new WebpackShellPlugin(
            {
                // hash: hash,
               // onBuildStart:['node webpack.beforebuild.js'],
                // onBuildEnd:[`BUNDLE_NAME=[hash] chain=${chain} folder=${buildFolder} node webpack.afterbuild.js`]
            }
        ),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/
        })
    ];
    return {
        context: path.join(__dirname, 'src'),
        devtool: false,
        mode: 'production',
        entry: entry,
        optimization: {
            // splitChunks: {
            //     chunks: 'all'
            // },
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            warnings: false
                        }
                    }
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        },
        output: {
            path: path.join(__dirname, outputPath),
            filename: `[name].min.js?v=${timestamp}`,
            publicPath: ''
        },
        module: {
            rules: [
                {
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
                                sourceMap: false
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: false
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
                                limit: 10000
                            }
                        }
                    ]
                }
            ]
        },
        plugins: plugins
    }
};

async function getTokenApi(network, backupServer = false) {
    var BLOCKCHAIN_INFO = require('./env/config-env/' + (network) + ".json");
    const url = backupServer ? `${BLOCKCHAIN_INFO.tracker}/internal/currencies` : `${BLOCKCHAIN_INFO.kyberswap_api}/currencies`;
    return new Promise((resolve, result) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            return response.json()
        }).then((result) => {
            let tokens = BLOCKCHAIN_INFO.tokens;
            if (result.success) {
                tokens = {};
                result.data.map(val => {
                    tokens[val.symbol] = val
                })
            }
            resolve(tokens)
        }).catch(async (err) => {
            console.log(err)
            let tokens = BLOCKCHAIN_INFO.tokens;
            if (!backupServer) {
              tokens = await getTokenApi(network, true);
            }
            resolve(tokens)
        })
    })
}

var webpack = require('webpack');


async function saveBackupTokens(chain) {
    var file = "./env/config-env/" + chain + ".json"
    var obj = JSON.parse(fs.readFileSync(file, 'utf8'));

    var tokens = await getTokenApi(chain)
    obj.tokens = tokens

    fs.writeFileSync(file, JSON.stringify(obj, null, 4));
}

async function main() {
    //render language
    //await renderLanguage()

    var enviroment = process.env.NODE_ENV
    await saveBackupTokens(enviroment)

    var webpackConfig = await getConfig(enviroment)  

    var compiler = await webpack(webpackConfig)
    compiler.run(function (err, stats) {
        if (!err) {
            console.log("success")
        } else {
            console.log("fail")
            console.log(err)
        }
    })
}

main()
