import Vue from 'vue'
import Router from 'vue-router'
import $ from 'jquery'
import {
  setCookie,
  getCookie
} from 'src/assets/scripts/Cookie.js'
import sign from 'src/views/sign.vue'
import home from 'src/views/home.vue'
import log from 'src/views/logs/log.vue'
import myLog from 'src/views/logs/myLog.vue'
import manage from 'src/views/manages/manage.vue'
import prisons from 'src/views/manages/prisons.vue'
import cards from 'src/views/manages/cards.vue'


Vue.use(Router)

const routes = [{
    path: '/sign',
    name: 'sign',
    component: sign
  }, {
    path: '/',
    redirect: 'home',
  }, {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/log',
    name: 'log',
    component: log,
    children: [{
      path: 'myLog',
      name: 'myLog',
      component: myLog,
    }, {
      path: 'warningLog',
      name: 'warningLog',
      component: () =>
        import ('src/views/logs/warningLog.vue')
    }, {
      path: 'roomLog',
      name: 'roomLog',
      component: () =>
        import ('src/views/logs/roomLog.vue')
    }, {
      path: 'exchangeLog',
      name: 'exchangeLog',
      component: () =>
        import ('src/views/logs/exchangeLog.vue')
    }],
    redirect: '/log/roomLog'
  },
  {
    path: '/manage',
    name: 'manage',
    component: manage,
    children: [{
      path: 'prisons',
      name: 'prisons',
      component: prisons,
      children: [{
        path: 'building',
        name: 'building',
        component: () =>
          import ('src/views/manages/prisons_building.vue')
      }, {
        path: 'room',
        name: 'room',
        component: () =>
          import ('src/views/manages/prisons_room.vue')
      }, {
        path: 'camera',
        name: 'camera',
        component: () =>
          import ('src/views/manages/prisons_camera.vue')
      }],
      redirect: '/manage/prisons/building'
    }, {
      path: 'roles',
      name: 'roles',
      component: () =>
        import ('src/views/manages/roles.vue')
    }, {
      path: 'polices',
      name: 'polices',
      component: () =>
        import ('src/views/manages/polices.vue')
    }, {
      path: 'cards',
      name: 'cards',
      component: cards,
      children: [{
        path: 'card',
        name: 'card',
        component: () =>
          import ('src/views/manages/cards_card.vue')
      }, {
        path: 'device',
        name: 'device',
        component: () =>
          import ('src/views/manages/cards_device.vue')
      }],
      redirect: '/manage/cards/card'
    }, {
      path: 'scheduling',
      name: 'scheduling',
      component: () =>
        import ('src/views/manages/scheduling.vue')
    }, ],
    redirect: '/manage/prisons'
  },
]

const router = new Router({
  routes: routes,
  // mode: 'history',
  base: process.env.BASE_URL,
})

export default router

router.beforeEach((to, from, next) => {
  if ($('body').hasClass('hasCamera')) {
    $('body').removeClass('hasCamera');
  }
  let token = getCookie('username');
  if ((!token || token === null) && to.path != '/sign') {
    next({
      name: "sign",
      query: {
        to: to.fullPath,
      },
    })
  } else {
    next()
  }
})