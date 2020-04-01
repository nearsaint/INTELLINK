const path = require('path')
const webpack = require("webpack")
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  publicPath: '', // 根域上下文目录
  outputDir: 'dist', // 构建输出目录
  assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
  lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | 'error'
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('src', resolve('./src'))
      .set('components', resolve('./src/components'))
      .set('views', resolve('./src/views'))
      .set('assets', resolve('./src/assets'))
      .set('plugins', resolve('./src/plugins'))
      .set('styles', resolve('./src/assets/styles'))
      .set('scripts', resolve('./src/assets/scripts'))
      .set('images', resolve('./src/assets/images'))
      .set('api', resolve('./src/api'))

    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
    // .options(genUrlLoaderOptions('img'))

    config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
      .use('url-loader')
      .loader('url-loader')
    // .options(genUrlLoaderOptions('fonts'))

  },

  devServer: {
    open: true,
    host: "localhost",
    // host: "192.168.0.13",
    port: 6060,
    https: false,
    hotOnly: false,
    proxy: {
      // '/~': {
      //   target: 'http://192.168.0.69:5002',
      //   changOrigin: true,
      //   ws: true,
      //   pathRewrite: {
      //     '^/~': '/'
      //   }
      // },
      '/api': {
        // target: 'http://192.168.0.69:5008/api',
        target: 'http://www.lele.fit/api',
        changOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
    before: app => {}
  },
  // 第三方插件配置
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
      })
    ],
  }
}