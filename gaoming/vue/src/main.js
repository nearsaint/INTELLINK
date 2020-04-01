import Vue from 'vue'
import App from './App.vue'

// import vue-router
import router from 'src/router/router'

// import vuex
import store from 'src/vuex/store'

// import jQuery
import $ from 'jquery'
// import axios
// import qs from 'qs'
import axios from 'axios'
Vue.prototype.axios = axios
// Vue.prototype.$qs = qs

// import ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// import CSS
import 'styles/hack/normalize-7.0.0.min.css'
import 'styles/plugin/animate-3.6.0.min.css'
import 'styles/plugin/font-awesome-4.7.0.min.css'
import 'styles/page.scss'
import 'styles/reset.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')