import { SAVE_SKIN } from '../mutation-types'
const ui = JSON.parse(localStorage.getItem('ui'))

// 初始数据
const state = {
  ui: ui || {
    skin: 'night-theme'
  }
}
// 监听state数据变化(最新状态)
const getters = {
  getUi (state) {
    return state.ui
  }
}
// 修改state数据
const mutations = {
  [SAVE_SKIN] (state, value) {
    state.ui.skin = value
  }
}
// 触发mutations里的方法
const actions = {
  saveSkin (context, value) {
    context.commit(SAVE_SKIN, value)
    localStorage.setItem('ui', JSON.stringify(state.ui))
  }
}
export default { state, getters, mutations, actions }
