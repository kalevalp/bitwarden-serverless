// const path = require('path');
// // eslint-disable-next-line import/no-unresolved
// const slsw = require('serverless-webpack');
// const nodeExternals = require('webpack-node-externals');

// slsw.lib.entries['src/folders-original'] = './src/folders-original.js'

// module.exports = {   
//     module: {
//       rules: [{
//         test: /\.js$/,
//         loaders: ['babel-loader'],
//         include: __dirname,
//         exclude: /node_modules/,
//       }],
//     },
//     entry: slsw.lib.entries,
//     target: 'node',
//     externals: ['aws-sdk'],
//     output: {
// 	libraryTarget: 'commonjs',
// 	path: path.join(__dirname, '.webpack'),
// 	filename: '[name].js',
//     },
// };

const path = require('path');
// eslint-disable-next-line import/no-unresolved
const slsw = require('serverless-webpack');

slsw.lib.entries['src/folders-original'] = './src/folders-original.js'

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  module: {
    rules: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: __dirname,
      exclude: /node_modules/,
    }],
  },
  externals: ['aws-sdk', 'watchtower-recorder'],
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  optimization:{
    minimize: false, // <---- disables uglify.
    // minimizer: [new UglifyJsPlugin()] if you want to customize it.
  }
  // includeModules: true,
};
