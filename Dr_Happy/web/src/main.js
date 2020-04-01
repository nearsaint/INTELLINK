import Vue from 'vue'
import App from './App.vue'

// import element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);
// import vue-router
import router from './router/router'
// import vuex
import store from './vuex/store'
// import jQuery
import $ from 'jquery'
// import ApiConfig
import apis from 'api/APIs'
Vue.prototype.$apis = apis;
// import Axios封装
import Ajax from 'api/Axios'
Vue.prototype.$ajax = Ajax;
// import axios
import axios from 'axios'
Vue.prototype.$axios = axios
// import js-cookie
import Cookies from 'js-cookie'
Vue.prototype.$cookies = Cookies;
// import storage
import Storage from 'api/Storage'
Vue.prototype.$storage = Storage;
// import echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// import CSS
import 'plugins/hack/normalize/normalize-8.0.1.css'
import 'plugins/animate/animate.min.css'
import 'plugins/fontAwesome/font-awesome-4.7.0.min.css'
import 'assets/styles/page.scss'
import 'assets/styles/reset.scss'

import './registerServiceWorker'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')