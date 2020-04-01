import Vue from 'vue'
import App from './App.vue'
// import vue-router
import router from 'assets/router/router'
// import vuex
import store from 'assets/vuex/store'
// import jQuery
import $ from 'jquery'
// import axios
import axios from 'axios'
Vue.prototype.axios = axios
// import ATui
import AtComponents from 'at-ui'
import 'at-ui-style'
Vue.use(AtComponents)
// import CSS
import 'plugins/hack/normalize/normalize-8.0.1.css'
import 'plugins/animate/animate.min.css'
import 'plugins/fontAwesome/font-awesome-4.7.0.min.css'
import 'plugins/iconfont/iconfont.css'
import 'styles/reset.scss'
import 'styles/page.scss'
//import echart
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

//import elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')