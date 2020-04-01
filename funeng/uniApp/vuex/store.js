import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		user:{
			name:'未知姓名',
			nickName: '匿名用户',
			avatarUrl: '',
			userid: '未知ID'
		},
		
		sys:{
			windowHeigth: null,
			windowWidth: null,
		},
		company:{
			active: 0,
			mill: [],
			millarray: [],
			location: [],
			dtu: [],
			iconPath: '/static/image/icon/location.png'
		},
		IOT:{
			state: false,
			data: [],
		},
		map: {
			state: false,
			data: [],
			info: {},
		}
	},
    mutations: {
	
	},
    actions: {
		
	}
})

export default store
