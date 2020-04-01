import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logined: false,
    loginName: '',
    user: {
      name: '未知姓名',
      nickName: '匿名用户',
      avatarUrl: '',
    },
    iot: {
      data: [],
    },
  },
  mutations: {

  },
  actions: {

  }
})