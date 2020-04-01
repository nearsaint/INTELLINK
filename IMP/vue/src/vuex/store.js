import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {
      name: 'Administrator',
      tokenKey: 'USER_TOKEN',
    },
    axios: {},
    progress: {
      percentage: 0,
      status: undefined, //success;warning;exception
      show: false,
    },
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {}
})
export default store