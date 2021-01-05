import { SAVE_RGB } from '../mutation-types'
const rgb = JSON.parse(localStorage.getItem('colorStraw'))

// 初始数据
const state = {
  rgb: rgb || ''
}
// 监听state数据变化(最新状态)
const getters = {
  getRgb (state) {
    return state.rgb
  }
}
// 修改state数据
const mutations = {
  [SAVE_RGB] (state, value) {
    state.rgb = value
  }
}
// 触发mutations里的方法
const actions = {
  saveRgb (context, value) {
    context.commit(SAVE_RGB, value)
    localStorage.setItem('colorStraw', JSON.stringify(value))
  }
}
export default { state, getters, mutations, actions }
