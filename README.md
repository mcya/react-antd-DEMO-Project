#### nodejs环境需求
nodejs v4.5.0版本
设置国内镜像
`npm config set registry https://registry.npm.taobao.org `
npm3(安装完毕nodejs后升级npm3: `npm -g install npm@3`)

#### chrome安装如下插件辅助开发:
- React Developer Tools
- Redux DevTools
- livereload

#### 先执行一次包更新
`npm install`

#### 开发执行(常驻后台即可)
`npm start`

#### 开发+说明文档
`npm run dev`

#### 访问地址
http://localhost:8989

#### 构建提速
先执行`npm run build:dll`,之后执行`npm start`可以大大减少构建数量,
然后将src/entris/index.html里的`<script src="./dlls/vendor.dll.js"></script>`打开。

### 增加node服务器内存限制，解决构建频繁报内存溢出，运行一次即可
先全量更新包`npm install`或者单个新增依赖包`npm install --save-dev increase-memory-limit`
然后执行`npm run fix-memory-limit`



### 变更
> apps 目录 - src/entries index.html - src/reducers - src/routes - alias.js - proxy.config.js
