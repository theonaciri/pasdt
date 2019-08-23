const path = require('path');

module.exports = {
  entry: './public/javascripts/index.js',
  mode: 'development',
  watch: true,
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  node: { crypto: true, stream: true, fs: 'empty', net: 'empty' }
};