const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'public');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
require('dotenv').config();

const config = {
  entry: [path.join(__dirname, '/client.js')],
  // Render source-map file for final build
  devtool: 'source-map',
  // output config
  output: {
    path: buildPath, // Path of output file
    filename: 'app.js', // Name of output file
  },
  plugins: [
    // Define production build to allow React to strip out unnecessary checks
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production'),
        'HOSTNAME': JSON.stringify(process.env.HOSTNAME),
        'API_BASIC_AUTH': JSON.stringify(process.env.API_BASIC_AUTH),
        'CLOUDINARY_CLOUD_NAME': JSON.stringify(process.env.CLOUDINARY_CLOUD_NAME),
        'CLOUDINARY_UPLOAD_PRESET': JSON.stringify(process.env.CLOUDINARY_UPLOAD_PRESET),
        'CLARIFAI_MODEL_ID': JSON.stringify(process.env.CLARIFAI_MODEL_ID),
        'S3_BUCKET_NAME': JSON.stringify(process.env.S3_BUCKET_NAME),
        'AUTH0_CLIENT_ID': JSON.stringify(process.env.AUTH0_CLIENT_ID),
        'AUTH0_DOMAIN': JSON.stringify(process.env.AUTH0_DOMAIN),
        'AUTH0_REDIRECT_URI': JSON.stringify(process.env.AUTH0_REDIRECT_URI),
        'AUTH0_MANAGEMENT_CLIENT_ID': JSON.stringify(process.env.AUTH0_MANAGEMENT_CLIENT_ID),
        'AUTH0_MANAGEMENT_CLIENT_SECRET': JSON.stringify(process.env.AUTH0_MANAGEMENT_CLIENT_SECRET),
        'GOOGLE_SITE_VERIFICATION': JSON.stringify(process.env.GOOGLE_SITE_VERIFICATION)
      }
    }),
    // Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        // suppresses warnings, usually from module minification
        warnings: false,
      },
    }),
    // Allows error warnings but does not stop compiling.
    new webpack.NoErrorsPlugin(),
    // Transfer Files
    new TransferWebpackPlugin([
      {from: 'www'},
    ], path.resolve(__dirname, 'src')),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/, // All .js files
        loaders: ['babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath],
      },
    ],
  },
};

module.exports = config;
