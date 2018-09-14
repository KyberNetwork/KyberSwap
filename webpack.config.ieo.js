var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var CompressionPlugin = require('compression-webpack-plugin')
const WebpackShellPlugin = require('./webpack-shell-plugin');

// const HOST = process.env.HOST || "127.0.0.1";
// const PORT = process.env.PORT || "8889";

var scriptConfig = function (env) {
  //var dist = env.chain ? '/dist/' + env.chain : '/src'
  var dist = '../public/swap'
  var chain = env.chain

  return {
    context: path.join(__dirname, "src"),
    devtool: (env && env.build !== "true") ? "inline-sourcemap" : false,
    entry: ['babel-polyfill', "./js/client.js", "./assets/css/app.scss"],
    watchOptions: {
      ignored: [ /node_modules/, /lang/ ]
    },
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ],
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
      },
      {
        test: /\.(jpe?g|png|gif|svg|ttf)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2000000
            }
          }
        ]
      }
      ]
    },
    output: {
      // path: __dirname + dist,
      // filename: "client.min.js"
      publicPath: '/',
      path: path.join(__dirname, '../public/swap/', chain),
      filename: `client.min.js`
    },
    plugins: (env && env.build !== "true") ? [
      new ExtractTextPlugin({ // define where to save the file
        filename: 'app.bundle.css',
        allChunks: true,
      }),
      new webpack.DefinePlugin({
        'env': JSON.stringify(env.chain),
        'process.env': {
          'logger': 'true'
        }
      })
    ] : [
        new UglifyJsPlugin({
          uglifyOptions: {
            comments: false,
            compress: {
              drop_console: true,
              warnings: false
            }
          }
        }),
        new ExtractTextPlugin({ // define where to save the file
          filename: 'app.bundle.css',
          allChunks: true,
        }),
        new webpack.DefinePlugin({
          'env': JSON.stringify(env.chain),
          'process.env': {
            'NODE_ENV': JSON.stringify("production")
          }
        }),
        new CompressionPlugin({ 
          asset: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0.8
        }),
        new WebpackShellPlugin(
            {
                // hash: hash,
               // onBuildStart:['node webpack.beforebuild.js'],
                onBuildEnd:[`BUNDLE_NAME=[hash] chain=${chain} node webpack.afterbuild.js`]
            }
        )
      ],
    devServer: {
      contentBase: "../public/swap/production",
      // do not print bundle build stats
      noInfo: true,
      // enable HMR
      hot: true,
      // embed the webpack-dev-server runtime into the bundle
      inline: true,
      // serve index.html in place of 404 responses to allow HTML5 history
      historyApiFallback: true,
      // port: PORT,
      // host: HOST

      // compress: true,
      // disableHostCheck: true,
      // contentBase: "../public/swap/production"
    }
  }
};


var indexConfig = function (env) {
  var HtmlWebpackPlugin = require('html-webpack-plugin')
  var dist = env.chain ? '/dist/' + env.chain : '/src'
  return {
    entry: ['./src/client.min.js'],
    output: {
      path: __dirname + dist,
      filename: 'client.min.js?v=' + Date.now()
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Wallet - kyber.network",
        template: './src/app.html',
        favicon: './src/assets/img/favicon.png',
        inject: 'body',
        styleFile: 'app.bundle.css?v=' + Date.now()
      })
    ]
  }
}

module.exports = [scriptConfig, indexConfig]