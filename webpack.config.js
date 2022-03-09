// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const tsConfigPath = (exports.tsConfigPath = path.join(__dirname, 'tsconfig.json'))

module.exports = {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, 'dist', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'umd'),
    filename: '[name].min.js',
    libraryTarget: 'umd',
    library: 'deficonnect',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: tsConfigPath,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [],
    symlinks: false,
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert/'),
      path: require.resolve('path-browserify'),
      util: require.resolve('util/'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      url: require.resolve('url/'),
    },
  },
}
