var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var scriptConfig = function (env) {
  return {
    context: path.join(__dirname, "src"),
    devtool: (env && env.build !== "true") ? "inline-sourcemap" : false,
    entry: ['babel-polyfill', "./js/client.js", "./assets/css/app.scss"],
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
      path: __dirname + "/src/",
      filename: "client.min.js"
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
        new UglifyJsPlugin(),
        new ExtractTextPlugin({ // define where to save the file
          filename: 'app.bundle.css',
          allChunks: true,
        }),
        new webpack.DefinePlugin({
          'env': JSON.stringify(env.chain),
          'process.env': {
            'NODE_ENV': JSON.stringify("production")
          }
        })
      ],
    devServer: {
      compress: true,
      disableHostCheck: true,
    }
  }
};


var indexConfig = function (env) {
  var HtmlWebpackPlugin = require('html-webpack-plugin')
  return {
    entry: ['./src/client.min.js'],
    output: {
      path: __dirname + '/src',
      filename: 'client.min.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        hash: true,
        title: "Wallet - kyber.network",
        template: './src/app.html.template',
        inject: 'body',
        styleFile: 'app.bundle.css?v=' + Date.now()
      }),

    ]
  }
}

module.exports = [scriptConfig, indexConfig]