import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/globalcss.css'
import axion from 'axios'

axion.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

axion.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

Vue.prototype.$http = axion

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
