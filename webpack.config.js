var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (env) {
  // //get entry path
  // var entryChain = "src/env/kovan.js"
  // if (env && env.chain) {
  //   switch (env.chain) {
  //     case "KOVAN":
  //       entryChain = "src/env/kovan.js"
  //       break
  //     default:
  //       entryChain = "src/env/kovan.js"
  //       break;
  //   }
  // }
  return {
    context: path.join(__dirname, "src"),
    devtool: debug ? "inline-sourcemap" : false,
    entry: ['babel-polyfill', "./js/client.js", "./assets/css/app.scss"],
    // resolve: {
    //   modules: [path.resolve(__dirname, "src"), "node_modules"],
    //   alias: {
    //     ETHEREUM_CONSTANT: path.resolve(__dirname, entryChain)
    //   },
    //   extensions: ['.js']
    // },
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
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            query: {
              name: '[name].[ext]'
            }
          }
        },
        {
          loader: 'image-webpack-loader',
          options: {
            query: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: true,
              },
              optipng: {
                optimizationLevel: 7,
              }
            }
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
    plugins: debug ? [
      new ExtractTextPlugin({ // define where to save the file
        filename: 'app.bundle.css',
        allChunks: true,
      }),
      new webpack.DefinePlugin({
        '__PROCESS__': {
          'ENV': env && env.chain ? '"' + env.chain + '"' : '"kovan"'
        }
      })
    ] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
        new ExtractTextPlugin({ // define where to save the file
          filename: 'app.bundle.css',
          allChunks: true,
        }),
        new webpack.DefinePlugin({
          '__PROCESS__': {
            'ENV': '"production"',
          }
        })
      ],
    devServer: {
      compress: true,
      disableHostCheck: true,
    }
  }
};