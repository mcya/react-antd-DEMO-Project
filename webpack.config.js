// Learn more on how to config.
// - https://github.com/ant-tool/atool-build#配置扩展

const webpack = require('atool-build/lib/webpack');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function (webpackConfig) {
  webpackConfig.babel.plugins.push('transform-runtime');
  webpackConfig.babel.plugins.push(['import', {
    style: true,
    libraryName: 'antd'
  }]);

  webpackConfig.plugins.unshift(
    new CopyWebpackPlugin([
        {
          from: './favicon.ico'
        },
        {
          from: './static/css',
          to: './css'
        },
        {
            from: './static/js',
            to: './js'
        }, {
          from: './static/img',
          to: './images'
        }, {
          from: './static/iconfont',
          to: './iconfont'
        }, {
          from: './dlls',
          to: './dlls'
        }])
  );

  const widthDoc = process.argv[process.argv.length - 1] === 'doc'

  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
        __PRODUCTION__: JSON.stringify(JSON.parse(process.env.BUILD_PRODUCTION || 'false')),
        __CONTEXT__: JSON.stringify(process.env.CONTEXT_PATH),
        __WidthDoc__: JSON.stringify(JSON.parse(widthDoc || 'false'))
    })
  );

  const hasDlls = fs.existsSync('./dlls/vendor-manifest.json');
  //动态生成入口index.html
  /*webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: 'src/entries/index.ejs',
      inject: false,
      hasDlls: !!hasDlls
    })
  )*/

  /*const manifests = glob.sync('./dlls/*-manifest.json');
  console.dir(manifests);
  manifests.forEach((item) => {
    webpackConfig.plugins.push(
      new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: require(item)
      })
    )
  });*/

  if (hasDlls) {
    webpackConfig.plugins.push(
      new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: require('./dlls/vendor-manifest.json')
      })
    )
  }


  // Enable this if you have to support IE8.
  webpackConfig.module.loaders.unshift({
    test: /\.js[x]?$/,
    loader: 'es3ify-loader'
  });
  //加上markdown的解析
  webpackConfig.module.loaders.push({
    test: /\.md$/,
    loader: 'html!markdown'
  });
  webpackConfig.plugins.find((item) => {
    if (item.chunkNames === 'common') {
      item.filenameTemplate = 'js/common.js';
      return true;
    }
    return false;
  })
  webpackConfig.output.chunkFilename = 'chunks/[name].js';
  //图片发布到单独的文件夹
  /*webpackConfig.module.loaders.push({
    test: /\.(png|jpg|gif)$/,
    loader: 'url-loader?limit=8192&name=images/[name]_[hash:8].[ext]'
  })*/

  // Parse all less files as css module.
  /*webpackConfig.module.loaders.forEach(function(loader, index) {
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
      loader.test = /\.dont\.exist\.file/;
    }
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.test = /\.less$/;
    }
  });*/

  // Support CSS Modules
 // Parse all less files as css module.
 webpackConfig.module.loaders.forEach((loader, index) => {
   if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
     loader.include = /node_modules/;
     loader.test = /\.less$/;
   }
   if (loader.test.toString() === '/\\.module\\.less$/') {
     loader.exclude = /node_modules/;
     loader.test = /\.less$/;
   }
   if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.css$') > -1) {
     loader.include = /node_modules/;
     loader.test = /\.css$/;
   }
   if (loader.test.toString() === '/\\.module\\.css$/') {
     loader.exclude = /node_modules/;
     loader.test = /\.css$/;
   }
   if (loader.test.toString().includes('(png|jpg|jpeg|gif)')) {
      // loader.loader = 'url?limit=8192&name=images/[name]_[hash:8].[ext]';
      loader.loader = 'file?name=images/[name]_[hash:8].[ext]';
      loader.include = [
        path.join(process.cwd(), './src')
      ]
   }
   if (loader.test.toString().includes('js')) {
     loader.exclude = /node_modules/;
   }
   /*if (loader.loader === 'babel'){
     loader.include = [
       path.join(process.cwd(), './src'),
       path.join(process.cwd(), './test')
     ]
   }*/
 });

  // Load src/entries/*.js as entry automatically.
  const files = glob.sync('./src/entries/*.js');
  const newEntries = files.reduce((memo, file) => {
    const name = path.basename(file, '.js');
    memo[name] = file;
    return memo;
  }, {});
  webpackConfig.entry = Object.assign({}, webpackConfig.entry, newEntries);

  if (widthDoc) {
    require('./webpack.doc.config.js')(webpackConfig);
  } else {
    const chalk = require('chalk');
    console.log(chalk.yellow('*****************************************************************************'));
    console.log(chalk.yellow('************* 使用 npm run dev 或者 npm start -- doc 启用帮助文档 *************'));
    console.log(chalk.yellow('*************  (若报错需要先执行 npm install 自动安装缺少的依赖包) *************'));
    console.log(chalk.yellow('*****************************************************************************'));
  }

  /*fs.writeFile(
    path.join(__dirname, '_defaultWebpackConfig.json'),
    JSON.stringify(webpackConfig), function (err) {
       if (err) throw err;
       console.log("Export WebpackConfig Success!");
   });*/

  webpackConfig.resolve.alias = webpackConfig.resolve.alias || require('./alias')
  // console.dir(webpackConfig.resolve);

  return webpackConfig;
};
