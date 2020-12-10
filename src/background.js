'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let win = null
// 主进程控制台输出
function mainConsole (arg) {
  win.webContents.send('main-console', arg)
}
async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    frame: false, // 无边框窗口
    // transparent: true, // 透明窗口
    show: false,
    width: 800,
    height: 600,
    iocn: 'public/favicon.ico',
    maximizable: true,
    minimizable: true,
    resizable: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true
    }
  })
  // 渲染完成显示窗口
  win.once('ready-to-show', () => {
    win.show()
  })
  // 主动向渲染器发送信息
  win.webContents.on('did-finish-load', () => {
    mainConsole('渲染完成！')
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
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
  createWindow()
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
// 和渲染器进程通信
// 控制台输出通信
ipcMain.on('asynchronous-message', (event, arg) => {
  event.reply('asynchronous-reply', '你好')
})
// 开启开发者工具
ipcMain.on('show-dev-tools', (event, arg) => {
  win.webContents.openDevTools()
  event.reply('show-dev-tools-console', '已经打开')
})
// 窗口控制
ipcMain.on('control-window', (event, arg) => {
  switch (arg) {
    case 'minimize':
      win.minimize()
      break
    case 'maximize':
      win.maximize()
      // 判断窗口是否最大化
      event.reply('control-window-return', win.isMaximized())
      break
    case 'unmaximize':
      win.unmaximize()
      // 判断窗口是否最大化
      event.reply('control-window-return', win.isMaximized())
      break
    case 'close':
      win.close()
      break
  }
})
// 判断窗口是否最大化
ipcMain.on('is-maximized', (event, arg) => {
  event.reply('control-window-return', win.isMaximized())
})
// 文件选择
ipcMain.on('open-file', (event, arg) => {
  dialog.showOpenDialog(win, {
    title: '选择svg文件',
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
        data: res
      })
    }
  }).catch(error => {
    event.reply('file-return', {
      status: 'error',
      data: error
    })
  })
})
