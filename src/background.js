'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'

import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const gotTheLock = app.requestSingleInstanceLock()
const fs = require('fs')
const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// 主窗口
let main = null
// 屏幕取色查窗口
let colorStrawWin = null
// 主进程控制台输出
function mainConsole (window, arg) {
  window.webContents.send('main-console', arg)
}
async function createMainWindow () {
  // Create the browser window.
  main = new BrowserWindow({
    frame: false, // 无边框窗口
    // transparent: true, // 透明窗口
    show: false,
    width: 720,
    height: 600,
    iocn: 'public/favicon.ico',
    maximizable: true,
    minimizable: true,
    resizable: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      webSecurity: false,
      enableRemoteModule: true
    }
  })
  // 渲染完成显示窗口
  main.once('ready-to-show', () => {
    main.show()
  })
  // 主动向渲染器发送信息
  main.webContents.on('did-finish-load', () => {
    mainConsole(main, '渲染完成！')
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await main.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) main.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    main.loadURL('app://./index.html')
  }
  // 窗口最大化事件
  main.on('maximize', function (e) {
    main.webContents.send('wind-maximize', {
      status: 'success',
      msg: '窗口最大化事件',
      data: {
        max: true
      }
    })
  })
  // 窗口最大化事件
  main.on('unmaximize', function (e) {
    main.webContents.send('wind-maximize', {
      status: 'success',
      msg: '窗口最大化事件',
      data: {
        max: false
      }
    })
  })
}
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    if (main) {
      if (main.isMinimized()) main.restore()
      main.focus()
      main.show()
    }
  })
}
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    main.destroy()
    main = null
    colorStrawWin.destroy()
    colorStrawWin = null
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createMainWindow()
})
app.whenReady().then(() => {
  protocol.registerFileProtocol('atom', (request, callback) => {
    const url = request.url.substr(7)
    // eslint-disable-next-line standard/no-callback-literal
    callback({ path: path.normalize(`${__dirname}/${url}`) })
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
app.commandLine.appendSwitch('wm-window-animations-disabled')
// 和渲染器进程通信
// 开启开发者工具
ipcMain.on('show-dev-tools', (event, arg) => {
  main.webContents.openDevTools()
  event.reply('show-dev-tools-console', '已经打开')
})
// 窗口控制
ipcMain.on('control-window', (event, arg) => {
  switch (arg) {
    case 'minimize':
      main.minimize()
      break
    case 'maximize':
      main.maximize()
      // 判断窗口是否最大化
      event.reply('control-window-return', main.isMaximized())
      break
    case 'unmaximize':
      main.unmaximize()
      // 判断窗口是否最大化
      event.reply('control-window-return', main.isMaximized())
      break
    case 'close':
      main.close()
      break
  }
})
// 判断窗口是否最大化
ipcMain.on('is-maximized', (event, arg) => {
  event.reply('control-window-return', main.isMaximized())
})
// 文件选择
ipcMain.on('open-file', (event, arg) => {
  dialog.showOpenDialog(main, {
    title: '选择SVG文件',
    buttonLabel: '确认',
    // 限制能够选择的文件为某些类型
    filters: [
      { name: 'svg', extensions: ['svg'] }
    ],
    properties: ['openFile', 'multiSelections']
  }).then(res => {
    if (!res.canceled) {
      event.reply('file-return', {
        status: 'success',
        msg: '文件选择成功',
        data: res
      })
    }
  }).catch(error => {
    event.reply('file-return', {
      status: 'error',
      msg: '文件选择失败',
      data: error
    })
  })
})
// 文件保存
ipcMain.on('save-file', (event, arg) => {
  dialog.showSaveDialog(main, {
    title: '保存',
    buttonLabel: '确认',
    // 限制能够选择的文件为某些类型
    filters: [
      { name: 'svg', extensions: ['svg'] }
    ]
  }).then(res => {
    if (!res.canceled) {
      // 写入文件
      fs.writeFile(res.filePath, arg, (err) => {
        if (err) {
          event.reply('file-save-return', {
            status: 'error',
            msg: '文件保存失败',
            data: err
          })
        } else {
          event.reply('file-save-return', {
            status: 'success',
            msg: '文件保存成功',
            data: null
          })
        }
      })
    } else {
      event.reply('file-save-return', {
        status: 'success',
        msg: '文件保存取消',
        data: null
      })
    }
  }).catch(error => {
    console.log(error)
  })
})
// 创建屏幕取色窗口
async function createExtraWindow (arg, url) {
  const win = new BrowserWindow({
    frame: false, // 无边框窗口
    transparent: true, // 透明窗口
    show: false,
    movable: false,
    width: arg.width,
    height: arg.height,
    maximizable: true,
    minimizable: true,
    resizable: false,
    fullscreen: true,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false
    }
  })
  // 主动向渲染器发送信息
  win.webContents.on('did-finish-load', () => {
    mainConsole(win, '渲染完成！')
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}${url}`)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL(`app://./index.html${url}`)
  }
  // 窗口关闭销毁
  win.on('closed', function (e) {
    if (colorStrawWin) {
      colorStrawWin.destroy()
      colorStrawWin = null
    }
  })
  return win
}
// 创建屏幕取色窗口
ipcMain.on('create-color-straw-win', (event, arg) => {
  createExtraWindow(arg, '#/colorStrawWin').then(res => {
    colorStrawWin = res
    event.reply('create-color-straw-win-return', {
      status: 'success',
      msg: '窗口创建成功',
      data: {
        visible: true
      }
    })
  }).catch(error => {
    console.log(error)
  })
})
// 显示屏幕取色窗口
ipcMain.on('color-straw', (event, arg) => {
  if (colorStrawWin) {
    colorStrawWin.show()
    event.reply('color-straw-return', {
      status: 'success',
      msg: '开始取色',
      data: {
        visible: true
      }
    })
  } else {
    createExtraWindow(arg, '#/colorStrawWin').then(res => {
      colorStrawWin = res
      event.reply('color-straw-return', {
        status: 'success',
        msg: '开始取色',
        data: {
          visible: true
        }
      })
    }).catch(error => {
      console.log(error)
    })
  }
  colorStrawWin.webContents.send('color-straw-src', {
    status: 'success',
    msg: '截图数据',
    data: {
      src: arg
    }
  })
})
// 隐藏屏幕取色窗口
ipcMain.on('close-color-straw-win', (event, arg) => {
  colorStrawWin.hide()
  main.webContents.send('close-color-straw-win-return', {
    status: 'success',
    msg: '窗口隐藏成功',
    data: {
      visible: false
    }
  })
  event.reply('close-color-straw-win-return', {
    status: 'success',
    msg: '窗口隐藏成功',
    data: {
      visible: false
    }
  })
})
