import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/login.vue'
import Home from '../components/home'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/home', component: Home },
  { path: '/login', component: Login }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  let item = window.sessionStorage.getItem('token')
  if (!item) return next('/login')
  next()
})

export default router
