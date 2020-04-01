import Vue from 'vue'
import Vuex from 'vuex'
// import * as types from 'src/vuex/types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login: false,
    user: {
      loginedState: true,
      userName: '',
      trueName: '',
      userId: '',
      userAuthor: '',
      token: null,
      title: '',
      jurisdiction: {
        //门日志
        QueryDoorHty: false, //查询
        //报警日志
        QueryAlarmHty: false, //查询
        //交接班日志
        QueryShiftHty: false, //查询
        //监区管理
        QueryArt: false, //查询
        AddArt: false, //增加
        EditArt: false, //修改
        DeleteArt: false, //删除
        //监舍管理
        QueryDoor: false, //查询
        AddDoor: false, //增加
        EditDoor: false, //修改
        DeleteDoor: false, //删除
        //摄像头管理
        QueryWebcam: false, //查询
        //卡片管理
        QueryCard: false, //查询
        AddCard: false, //增加
        EditCard: false, //修改
        DeleteCard: false, //删除
        AuthorizeCard: false, //授权
        //控制器管理
        QueryControl: false, //查询
        AddControl: false, //增加
        EditControl: false, //修改
        DeleteControl: false, //删除
        //排班管理
        QueryScheduling: false, //查询
        ImportScheduling: false, //导入
        EditScheduling: false, //修改
        DeleteScheduling: false, //删除
        //角色管理
        QueryRole: false, //查询
        AddRole: false, //增加
        UpdateRole: false, //修改
        DeleteRole: false, //删除
        AuthorizeRole: false, //授权
        //用户管理
        QueryUser: false, //查询
        AddUser: false, //增加
        UpdateUser: false, //修改
        DeleteUser: false, //删除
        AuthorizeUser: false, //角色设置
        ResetPwdUser: false, //重置密码
      },
    },
    loading: {
      mark: false,
    },

    prison: {
      list: '',
    },
  },
  mutations: {
    // [types.LOGIN]: (state, data) => {
    //   localStorage.token = data;
    //   state.user.token = data;
    // },
    // [types.LOGOUT]: (state) => {
    //   localStorage.removeItem('token');
    //   state.user.token = null
    // },
    // [types.TITLE]: (state, data) => {
    //   state.user.title = data;
    // }
  },
  actions: {

  }
})