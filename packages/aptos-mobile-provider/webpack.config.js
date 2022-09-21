/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, 'dist', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].umd.js',
    libraryTarget: 'umd',
    library: 'DeFiConnectAptosProvider',
    umdNamedDefine: true,
    globalObject: 'this',
  },
}
