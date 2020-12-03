import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)
const routes = [
  {
    path: '/',
    name: 'layout',
    component: _import('layout/index'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: _import('pages/dashboard/index'),
        meta: {
          title: '仪表盘'
        }
      },
      {
        path: '/colorTransform',
        name: 'colorTransform',
        component: _import('pages/colorTransform/index'),
        meta: {
          title: '颜色转换'
        }
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
