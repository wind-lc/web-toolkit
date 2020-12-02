import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '../views/layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'layout',
    component: layout
  }

]

const router = new VueRouter({
  routes
})

export default router
