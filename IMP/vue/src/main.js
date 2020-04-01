import Vue from 'vue'
import App from './App.vue'

// import vue-router
import router from './router/router'
import goRouter from './router/goto'
Vue.prototype.$goRouter = goRouter

// import vuex
import store from './vuex/store'
Vue.prototype.$store = store

// import axios
import Axios from 'axios'
Vue.prototype.$axios = Axios

// import js-cookie
import Cookies from 'js-cookie'
Vue.prototype.$cookies = Cookies;

// import storage
import Storages from 'api/Storage'
Vue.prototype.$storages = Storages;

// import echart
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// import vchart
import VCharts from 'v-charts'
Vue.use(VCharts)

// import vue-socket.io
import IO from 'vue-socket.io'
import socketIO from 'socket.io-client'
import * as Socket from 'api/apiSocketio'
Vue.use(new IO({
  connection: Socket.SOCKET_URL,
}))
Vue.prototype.$sockets = Socket;


// import jQuery
import $ from 'jquery'

//import elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// import normalize v8.0.1
import 'normalize.css'
// impor reset
import 'assets/styles/reset.scss'
// import flex v1.1.7
import 'flex.css';
// import bootstrap v3.3.7 only Grid & Responsive
import 'assets/plugins/bootstrap/bootstrap.min.css'
//import fontAwesome
import 'assets/plugins/fontAwesome/4/font-awesome-4.7.0.min.css'
//import animate
import 'assets/plugins/animate/animate.min.css'
//import 全局
import 'assets/styles/page.scss'

Vue.config.productionTip = false

const vue = new Vue({
  router,
  store,
  render: function(h) {
    return h(App)
  }
}).$mount('#app')
export default vue