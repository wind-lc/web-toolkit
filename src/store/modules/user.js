import { SAVE_UI } from '../mutation-types'
const ElectronStore = window.require('electron-store')
const store = new ElectronStore()
const ui = () => {
  const val = store.get('ui')
  if (val) {
    return val
  } else {
    store.set('ui', {
      skin: 'night-theme'
    })
    return store.get('ui')
  }
}
// 初始数据
const state = {
  ui: ui()
}
// 监听state数据变化(最新状态)
const getters = {
  getUi (state) {
    return state.ui
  }
}
// 修改state数据
const mutations = {
  [SAVE_UI] (state, value) {
    state.ui = value
  }
}
// 触发mutations里的方法
const actions = {
  saveUi (context, value) {
    context.commit(SAVE_UI, value)
    store.set('ui', value)
  }
}
export default { state, getters, mutations, actions }
