
const path = require('path');
//const webpack = require('webpack');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const CompressionPlugin = require('compression-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackShellPlugin = require('./webpack-shell-plugin');
//const ThemesGeneratorPlugin = require('themes-switch/ThemesGeneratorPlugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')

var BLOCKCHAIN_INFO = require("./env")
const fetch = require("node-fetch");
var fs = require('fs');
var sass = require('node-sass');


function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}

//module.exports = env => {
var getConfig = env => {
    const folder = env
    const outputPath = `dist/${folder}`

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
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),   
        new CleanPlugin([outputPath + '/app.*', outputPath + '/libary.*'])
    ];
    return {
        context: path.join(__dirname, 'src'),
        devtool: env !== 'production' ? 'inline-sourcemap' : false,
        mode: env !== 'production' ? 'development' : 'production',
        entry: entry,
        optimization: {
            splitChunks: {
                chunks: 'all'
            },
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        ecma: 6,
                        compress: {
                            drop_console: true,
                            warnings: false
                        }
                    }
                }),

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

async function getTokenApi(network) {
    var BLOCKCHAIN_INFO = require('./env/config-env/' + (network) + ".json");
    return new Promise((resolve, result) => {
        fetch(BLOCKCHAIN_INFO.api_tokens, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            return response.json()
        })
            .then((result) => {
                if (result.success) {
                    var tokens = {}
                    result.data.map(val => {
                        tokens[val.symbol] = val
                    })
                    resolve(tokens)
                }
            }).catch((err) => {
                console.log(err)
                var tokens = BLOCKCHAIN_INFO.tokens
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

async function renderLanguage(){
    var yaml = require('yamljs');
    const railsPath = '../config/locales/views/'
    const langPath = './lang/'

    var processFile = function(fileName, callback){
    try {
        var json = yaml.parse(
        fs.readFileSync(
            railsPath + fileName
        , 'utf8'));
        var rawName = fileName.split('.')[0]
        fs.writeFile(langPath + rawName + '.json', JSON.stringify(json[rawName].kyber_swap, null, 2), 'utf8', callback);
    } catch (e) {
        console.log(e);
    }
    }

    try {
    var list = fs.readdirSync(railsPath)
    list.forEach(file => {
        processFile(file, (err) => {
        if(!err) console.log(`process file ${file} without error`)
        })
    })
    } catch (error) {
    
    }

}
async function main() {
    //render language
    await renderLanguage()

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