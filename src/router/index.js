import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/index',
    name: 'index',
    component: () => import("../views/index.vue")
  },
  {
    path: '/',
    name: 'test',
    component: () => import("../views/test.vue")
  },
]

const router = new VueRouter({
  routes
})

export default router
