import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'

// 请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// const axiosInstance = axios.create({
//   withCredentials: true
// })

// 请求拦截
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.axios = axios

Vue.component('tree-table', treeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
