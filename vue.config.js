const proxyUrl = process.env.VUE_APP_API_URL
const path = require('path')


function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  //路径前缀
  publicPath: '/',
  lintOnSave: true,
  productionSourceMap: false,
  configureWebpack: {

  },
  chainWebpack: (config) => {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
    //忽略的打包文件
    const entry = config.entry('app')
    entry.add('babel-polyfill').end()
    entry.add('classlist-polyfill').end()
  },
  css: {
    extract: { ignoreOrder: true },
  },
  //开发模式反向代理配置，生产模式请使用Nginx部署并配置反向代理
  devServer: {
    port: 1888,
    proxy: {
      '/api': {
        //本地服务接口地址
        target: proxyUrl,
        //远程演示服务地址,可用于直接启动项目
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
}
