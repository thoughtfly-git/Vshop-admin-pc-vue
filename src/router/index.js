import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/login.vue'
import Home from '../components/home'
import Welcome from '../components/welcome'
import user from '../components/user/user'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: user }
    ] },
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
