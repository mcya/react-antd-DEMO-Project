const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = (webpackConfig) => {
  webpackConfig.entry = Object.assign({
    'doc/index': './doc/index.js'
  }, webpackConfig.entry)

  //如果使用了dlls的话，这个entry会有问题解决办法是用template主动引用vendor，但是目前
  //不想这么做
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      title: '帮助文档',
      filename: 'doc/index.html',
      template: 'doc/index.ejs',
      inject: 'body',
      chunks: ['common', 'doc/index']
    })
  )
}
