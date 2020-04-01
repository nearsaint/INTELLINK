import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    user: {
      logined: true,
      username: '',
    },
    qusetions: {
      total: 0,
    },
    qusetionnaires: {
      total: 0,
      kind: 0,
    },
    util: {
      hospitals: [],
      treatments: [],
    }
  },
  getters: {

  }, //computed
  mutations: {},
  actions: {}, //mothods
})