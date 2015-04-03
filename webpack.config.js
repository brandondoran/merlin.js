module.exports = {
  module: {
    loaders: [
      { test: /\.6\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  }
};