import Vue from 'vue'
import VueRouter from 'vue-router'
import login from './../components/login.vue'
import home from './../components/home.vue'
import welcome from './../components/welcome.vue'
import users from './../components/user/users.vue'
import rights from './../components/rights/rights.vue'
import roles from './../components/rights/roles.vue'
import goods from './../components/goods/goods.vue'
import cate from './../components/goods/cate.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users },
      { path: '/rights', component: rights },
      { path: '/roles', component: roles },
      { path: '/goods', component: goods },
      { path: '/categories', component: cate }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
