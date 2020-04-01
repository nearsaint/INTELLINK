import Vue from 'vue'
import Router from 'vue-router'
import Home from 'views/Home.vue'
import Login from 'views/login.vue'

Vue.use(Router)
const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: '/home', //设置默认指向的路径
    }, {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/machine',
      name: 'machine',
      component: () =>
        import ('views/Machine.vue'),
      children: [{
        path: 'machineAll',
        name: 'machineAll',
        component: () =>
          import ('views/Machine_all.vue')
      }, {
        path: 'propertys/:id',
        name: 'propertys',
        component: () =>
          import ('views/Propertys.vue'),
        children: [{
          path: 'list',
          name: 'list',
          component: () =>
            import ('views/List.vue')
        }, {
          path: 'property/:id',
          name: 'property',
          component: () =>
            import ('views/Property.vue')
        }, {
          path: 'log/:id',
          name: 'log',
          component: () =>
            import ('views/log.vue')
        }, {
          path: 'statistic/:id',
          name: 'statistic',
          component: () =>
            import ('views/Statistic.vue')
        }],
        redirect: '/machine/propertys/:id/list'
      }],
      redirect: '/machine/machineAll'
    },
    {
      path: '/form',
      name: 'form',
      component: () =>
        import ('views/Form.vue')
    },
  ]
})

export default router
router.beforeEach((to, from, next) => {
  let logined;
  if (localStorage.logined) {
    logined = JSON.parse(localStorage.logined);
  } else {
    logined = false
  }
  if (!logined && to.path != '/login') {
    next({
      name: "login",
    })
  } else {
    next()
  }
})