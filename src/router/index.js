import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

const routes = [
  {
    path: '/',
    name: 'layout',
    component: _import('layout/index')
  }

]

const router = new VueRouter({
  routes
})

export default router
