var path = require('path')
var webpack = require('webpack')
var TerserPlugin = require('terser-webpack-plugin')
var { VueLoaderPlugin }= require('vue-loader')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist/',
    filename: 'vue-jstree.js',
    library: {
        name: 'vue-jstree',
        type: 'umd',
        umdNamedDefine: true
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'vue-style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.less$/,
        use: [{
          loader: "vue-style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "less-loader" // compiles Less to CSS
        }]
      }
    ]
  },
  resolve: {
    alias: {
       vue:'vue/dist/vue.esm-bundler.js'
    }
  },
  devServer: {
    historyApiFallback: true,
        'static': [
            { directory: path.join(__dirname,'dist'),
                publicPath: '/'
            },
        ],
  },
  performance: {
    hints: false
  },
  devtool: 'eval-cheap-source-map',
  plugins: [
     new VueLoaderPlugin(),
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = 'source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      },
      __VUE_PROD_DEVTOOLS__: 'true',
      __VUE_OPTIONS_API__: 'true'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
  module.exports.optimization = {
    minimizer: [
        new TerserPlugin({ terserOptions: {
            mangle: {
                keep_fnames: true
            }
        }})
    ],
    minimize: true
  }
    module.exports.externals = {
        vue: 'vue'
    }
} else {
  module.exports.entry = './main.js';
  module.exports.output = {  
      filename: 'vue-jstree.js'
  };
  module.exports.plugins = (module.exports.plugins || []).concat([
        new HtmlWebpackPlugin({
            templateContent: ({htmlWebpackPlugin}) => `
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <meta content="ie=edge" http-equiv="x-ua-compatible">
                <title>vue-jstree</title>
                <link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
              </head>
              <body>
                <div id="app"></div>
                ${htmlWebpackPlugin.tags.bodyTags}
              </body>
            </html>
        `
        })
  ])
}
