import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      logined: false,
	  hasFocus: false,
      userinfo: {},
	  info: {
		  name:'',
		  sex: 0,
		  birthday: '',
		  nation: '',
		  phone: '',
	  },
	  openid: '',
	  my:{
			allTreatmentLength:0,
			endTreatment: 0,
			ingTreatment: 0,
			waitTreatment: 0,
	  },
    },
	uitl:{
		hospitals: [],
		treatments: [],
	}
  },
  getters: {//computed

  }, 
  mutations: {},
  actions: {//mothods
  }, 
})