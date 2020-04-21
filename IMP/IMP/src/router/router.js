import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
//import Cookies & Storages
import Cookies from 'js-cookie'
import Storages from '../api/Storage'
//import default page
import Home from '../views/Home.vue'


const routes = [{
    path: '/',
    name: 'home',
    component: Home
  },
  //设备台账
  {
    path: '/device_index',
    name: 'device_index',
    component: function() {
      return import('../views/device/index.vue')
    }
  },
  //备件管理
  {
    path: '/device_parts',
    name: 'device_parts',
    component: function() {
      return import('../views/device/parts.vue')
    }
  },
  //能源统计
  {
    path: '/power_statistics',
    name: 'power_statistics',
    component: function() {
      return import('../views/power/statistics.vue')
    }
  },
  //能源分析
  {
    path: '/power_analysis',
    name: 'power_analysis',
    component: function() {
      return import('../views/power/analysis.vue')
    }
  },
  //能源预测
  {
    path: '/power_prediction',
    name: 'power_prediction',
    component: function() {
      return import('../views/power/prediction.vue')
    }
  },
  //dashboard 驾驶舱
  {
    path: '/dashboard',
    name: 'dashboard',
    component: function() {
      return import('../views/dashboard/index.vue')
    },
  },
  {
    path: '/dashboard_setting',
    name: 'dashboard_setting',
    component: function() {
      return import('../views/dashboard/setting.vue')
    },
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes: routes,
})
// 跳路由判断token
// router.beforeEach((to, from, next) => {
//   let token = Cookies.get('token');
//   if ((!token || token === null || token == undefined) && to.path != '/login') {
//     next({
//       path: "login",
//       query: {
//         to: to.fullPath,
//       },
//     })
//   } else {
//     next()
//   }
// })

export default router
