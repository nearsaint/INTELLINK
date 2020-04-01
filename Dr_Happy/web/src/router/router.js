import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Cookies from 'js-cookie'
import Storage from '../api/Storage'

import Home from '../views/Home.vue'
const routes = [{
    path: '/',
    redirect: 'treat'
  },
  {
    path: '/treat',
    name: 'treat',
    component: () =>
      import ('../views/Treat.vue')
  },
  {
    path: '/treatment/:codeID',
    name: 'treatment',
    component: () =>
      import ('../views/Treatment.vue')
  },
  {
    path: '/questionnaire',
    name: 'questionnaire',
    component: () =>
      import ('../views/Questionnaire.vue')
  },
  {
    path: '/questionEdit/:codeID',
    name: 'questionEdit',
    component: () =>
      import ('../views/QuestionEdit.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () =>
      import ('../views/User.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import ('../views/sign.vue')
  },
]

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: routes,
})
export default router

// 跳路由判断token
router.beforeEach((to, from, next) => {
  let token = Cookies.get('lelefitToken');
  // console.log('获取token: ' + token);
  if ((!token || token === null || token == undefined) && to.path != '/login') {
    next({
      path: "login",
      query: {
        to: to.fullPath,
      },
    })
  } else {
    next()
  }
})