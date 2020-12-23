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
      },
      {
        path: '/jsonFormat',
        name: 'jsonFormat',
        component: _import('pages/jsonFormat/index'),
        meta: {
          title: 'JSON格式化'
        }
      },
      {
        path: '/colorStraw',
        name: 'colorStraw',
        component: _import('pages/colorStraw/index'),
        meta: {
          title: '屏幕取色器'
        }
      },
      {
        path: '/svgCompress',
        name: 'svgCompress',
        component: _import('pages/svgCompress/index'),
        meta: {
          title: 'SVG压缩'
        }
      }
    ]
  },
  {
    path: '/colorStrawWin',
    name: 'colorStrawWin',
    component: _import('pages/colorStraw/colorStrawWin/index'),
    meta: {
      title: '屏幕取色器窗口'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
