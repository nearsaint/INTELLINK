import Vue from 'vue'
import App from './App'

//import css
import "./common/style/public.css"
import "./common/style/animate.css"
import './common/iconfont/iconfont.css'
import "./graceUI/graceIcons.css";
import "./graceUI/graceUI.css";

// import vuex
import store from './vuex/store'
Vue.prototype.$store = store
Vue.config.productionTip = false


App.mpType = 'app'

const app = new Vue({
    store,...App
})
app.$mount()
