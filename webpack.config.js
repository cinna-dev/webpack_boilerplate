const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const toml = require('toml');
const yaml = require('yamljs');
const json5 = require('json5');
const { log } = require('console');

const PORT = 9000;

const PUBLIC_PATH = './';

const PUBLIC_PATH_STYLE = './';

const PUBLIC_PATH_SCRIPTS = './';

const config = {
  entry : './src/index.js',
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: PUBLIC_PATH
  },
  module: {
    rules: []
  }
};


module.exports = (env, argv) => {

  console.log(env);

  ///////////// Plugins //////////////
  config.plugins = [
    new CleanWebpackPlugin({
      // prevents cleaning of the html file
      cleanStaleWebpackAssets: false
    }),
    new HtmlWebpackPlugin({
      title: env.production ? 'Production' : 'Development' ,
      template: "./src/template.html",
    }),
  ]

  if(env.production){
    config.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    })
    )
  }

  // development == minification
  config.mode = env.development ? 'development' : 'production';

  // source maps do not hit on performance 
  // only loaded when dev tool open
  const sourcemap = env.development ? 'inline-source-map' : 'source-map';

  config.devtool = env.sourcemap ?  sourcemap : false ;
  // config.devtool = false;

  // if (argv.mode === 'development' || env.development) {

  ////////// Dev Server /////////
  config.devServer = {
    contentBase: path.join(__dirname, 'dist'),
    // Hot Module Replacement
    hot: true,
    // gzip compression
    compress: true,
    port: PORT,
  }

  ///// Optimization /////
  config.optimization = {
    moduleIds: 'deterministic',
    // runtimeChunk: 'single',
    splitChunks: {
      chunks:'all' 
      // cacheGroups:{
      //   vendor: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name: 'vendors',
      //     chunks: 'all',
      //   },
        //   styles:{
        //   name: 'styles',
        //   test: /\.css$/,
        //   chunks: 'all',
        //   enforce: true,
        // }
      // }
    },
    minimize: env.production? true: false,
    minimizer: [
      `...`,
      new CssMinimizerPlugin({
        test: /\.css$/i,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              sourceMap: !!env.sourcemap,
            },
          ],
        },
      }),
    ]
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },

  config.resolve =  {
    extensions: ['*', '.js']
  }

  if(env.babel){
    config.module.rules.push( 
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          }
        }
      },
    )
  }

  config.module.rules = [...config.module.rules,
    {
      test: /\.html$/i,
      loader: 'html-loader',
    },
      { 
        test: /\.(sa|sc|c)ss$/,
        use:[
          env.development ? 'style-loader' : 
          {
            loader: MiniCssExtractPlugin.loader,
            options: {  publicPath: (resourcePath, context) => {
              // publicPath is the relative path of the resource to the context
              // e.g. for ./css/admin/main.css the publicPath will be ../../
              // while for ./css/main.css the publicPath will be ../
              return path.relative(path.dirname(resourcePath), context) + '/';
              },
            }
          },
          { loader: 'css-loader', options: { sourceMap: !!env.sourcemap } },
          { loader: 'sass-loader', options: { sourceMap: !!env.sourcemap } },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        // type: '/src/assets',
      
      },
      // Fonds
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // Data JSON loads automatically
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
      // Customize parser of JSON modules
      // loads TOML, YAML, JSON5 as JSON modules
      {
        test: /\.toml$/i,
        type: 'json',
        parser: {
          parse: toml.parse,
        },
      },
      {
        test: /\.yaml$/i,
        type: 'json',
        parser: {
          parse: yaml.parse,
        },
      },
      {
        test: /\.json5$/i,
        type: 'json',
        parser: {
          parse: json5.parse,
        },
      },
    ]
    console.log(config);
  return config
};


