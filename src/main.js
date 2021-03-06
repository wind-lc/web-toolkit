import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/reset.css'
import './assets/css/common.scss'
import './assets/css/night-theme.scss'
import './assets/css/dawn-theme.scss'
import './assets/css/dusk-theme.scss'
import './icons'
const ElectronStore = window.require('electron-store')
const eStore = new ElectronStore()
Vue.config.productionTip = false
if (navigator.onLine) {
  console.log('%c ', "padding:112px 150px;background:url('https://images.cnblogs.com/cnblogs_com/enumx/1647344/o_200214113324console.gif') no-repeat;")
}
// 加载electron模块
if (window.require) {
  // 通信
  const ipcRenderer = window.require('electron').ipcRenderer
  Vue.prototype.$ipcRenderer = ipcRenderer
  ipcRenderer.on('main-console', (event, arg) => {
    console.log('%c' + arg, 'color: #24a9f4;font-size: 20px;font-weight: bold;')
  })
  // 文件
  const shell = window.require('electron').shell
  const path = window.require('path')
  const fs = window.require('fs')
  Vue.prototype.$shell = shell
  Vue.prototype.$path = path
  Vue.prototype.$fs = fs
  Vue.prototype.$eStore = eStore
}
// 全局变量
new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
