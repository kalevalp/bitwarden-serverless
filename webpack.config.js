const path = require('path');
// eslint-disable-next-line import/no-unresolved
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

slsw.lib.entries['src/folders-original'] = './src/folders-original.js'

module.exports = {   
    
    entry: slsw.lib.entries,
    
    target: 'node',
    // module: {
    //   loaders: [{
    //     test: /\.js$/,
    //     loaders: ['babel-loader'],
    //     include: __dirname,
    //     exclude: /node_modules/,
    //   }],
    // },
    externals: [nodeExternals()],
    output: {
	libraryTarget: 'commonjs',
	path: path.join(__dirname, '.webpack'),
	filename: '[name].js',
    },
};
