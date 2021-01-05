const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  // 基本路径
  publicPath: '/',
  // 输出文件目录
  outputDir: '../dist',
  // 配置js、css等文件夹的二级目录位置，不设置则会在dist下生成4个文件夹
  assetsDir: 'static',
  // webpack-dev-server 相关配置
  devServer: {
    // 修改地址
    host: '0.0.0.0',
    // 修改端口
    port: 9900
  },
  // electron-builder 配置
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'web-toolkit',
        productName: 'WebToolkit', // 项目名，也是生成的安装文件名，即wyDemo.exe
        copyright: 'Copyright © 2020 wind-lc. All rights reserved', // 版权信息
        files: [
          './**/*'
        ],
        extraFiles: [ // 把指定的资源复制到程序根目录，即把server文件夹的内容复制到程序根目录，这里server文件夹下的内容相当于我的后台，我在background.js中有相应的处理。
          './server'
        ],
        directories: {
          output: './dist_app' // 输出文件路径
        },
        win: { // win相关配置
          icon: './public/favicon.ico', // 图标
          target: [{
            target: 'nsis', // 利用nsis制作安装程序
            arch: [
              'x64', // 64位
              'ia32'
            ]
          }]
        },
        nsis: {
          oneClick: false, // 是否一键安装
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          installerIcon: './public/favicon.ico', // 安装图标
          uninstallerIcon: './public/favicon.ico', // 卸载图标
          installerHeaderIcon: './public/favicon.ico', // 安装时头部图标
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: 'electron-demo' // 图标名称(项目名称)
        }
      }
    }
  },
  // svg
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    config.module
      .rule('image')
      .test(/\.cur$/)
      .use('url-loader')
      .loader('url-loader')
  }
}
