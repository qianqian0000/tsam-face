'use strict'
const path = require('path')
const defaultSettings = require('./src/config/index.js')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const resolve = dir => path.join(__dirname, dir)
//压缩代码并去掉console
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
//引入gzip压缩组件
const CompressionWebpackPlugin = require("compression-webpack-plugin")
// page title
const name = defaultSettings.title || '人脸识别'
// 生产环境，测试和正式
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const type = process.env.VUE_APP_ENV

module.exports = {
  publicPath: IS_PROD?' ./':'/', // 部署应用包时的基本 URL。 vue-router hash 模式使用
  // outputDir: `dist-${type}`, //  生产环境构建文件的目录
  outputDir: `dist`, //  生产环境构建文件的目录
  assetsDir: 'static', //  outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: true,
  productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  devServer: {
    port: 8080, // 端口
    open: false, // 启动后打开浏览器
    disableHostCheck: true,
    overlay: {
    //  当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
    warnings: false,
    errors: true,
    },
    /*
    proxy: {
      // 配置跨域
      '/api': {
          target: 'https://tsam-sit.internal.manulife-sinochem.com',
          // ws:true,
          changOrigin:true,
          pathRewrite:{
            '^/api':'/api'
          }
      },
      '/api-pro': {
        target: 'http://127.0.0.1:8888/',
        // ws:true,
        changOrigin:true,
        pathRewrite:{
          '^/api-pro':''
        }
      }
    },
    */
    before: require('./mock/mock-server.js')
  },
  css: {
    extract: IS_PROD, // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
    sourceMap: false,
    loaderOptions: {
      scss: {
        // 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
        prependData: ``
      }
    }
  },
  configureWebpack: config => {
    config.name = name
    const plugins = []
    //启用代码压缩
    /*
    plugins.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: false,
            pure_funcs: ["console.log"] //移除console
          }
        },
        sourceMap: false,
        parallel: true
      })
    ),
    */
    //代码压缩打包
    plugins.push(new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|svg|woff|ttf|json|html)$/,
      threshold: 10240,
      minRatio: 0.8
    }));
    config.plugins = [...config.plugins, ...plugins];
    // 为生产环境修改配置...
    // if (IS_PROD) {
    //   // externals
    //   config.externals = externals
    // }
  },

  chainWebpack: config => {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test
    config.resolve.symlinks(true);

    config.performance.set('hints',false);
    // 别名 alias
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('api', resolve('src/api'))
      .set('views', resolve('src/views'))
      .set('components', resolve('src/components'))

    /**
     * 打包分析
     */
    /*
    if (IS_PROD) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          // analyzerMode: 'static'
          analyzerMode: 'disabled'
        }
      ])
    }
    */
    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(!IS_PROD, config => config.devtool('cheap-source-map'))

    config.when(IS_PROD, config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // 将 runtime 作为内联引入不单独存在
            // inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'),
            minChunks: 3, //  被至少用三次以上打包分离
            priority: 5, // 优先级
            reuseExistingChunk: true // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          },
          node_vendors: {
            name: 'chunk-libs',
            chunks: 'initial', // 只打包初始时依赖的第三方
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          },
          vantUI: {
            name: 'chunk-vantUI', // 单独将 vantUI 拆包
            priority: 20, // 数字大权重到，满足多个 cacheGroups 的条件时候分到权重高的
            test: /[\\/]node_modules[\\/]_?vant(.*)/
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  },
}
