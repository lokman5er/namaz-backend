const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/frontend/src/app.ts',
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'src/frontend/dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'src/frontend/tsconfig.json')
            }
          }
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
