<template>
<div id="app">
  <div class="allMark">
    <a></a>
  </div>
  <header v-show="$store.state.user.loginedState">
    <componentTopNav></componentTopNav>
  </header>
  <main>
    <router-view></router-view>
  </main>
  <!-- <footer>
  </footer> -->
  <audio controls class="AudioPlayer" id="warningAudio" src="../Vue/audio/jingcha.mp3" type="audio/mpeg">
  </audio>
  <audio controls class="AudioPlayer" id="fireAudio" src="../Vue/audio/hujing.mp3" type="audio/mpeg">
  </audio>
</div>
</template>


<script>
import componentTopNav from 'components/component_topNav.vue'
// vue
export default {
  name: 'app',
  provide: function() {
    // hasUser: this.hasUser()
  },
  beforeCreate: function() {},
  created: function() {
    // this.getMac();
    this.getUsername();
    this.initWebSocket();
  },
  mounted: function() {
    let that = this;
    that.getUserPermissions();
    // let nowTimestamp = (new Date()).getTime();
    // if (nowTimestamp > 1559318400000) {
    //   that.$alert('系统使用请联系软件服务商', '通知', {
    //     confirmButtonText: '确定',
    //     callback: action => {
    //       that.SetTime();
    //     }
    //   });
    // }
  },
  beforeDestroy: function() {
    this.websock.close();
  },
  destroyed: function() {
    this.websock.close();
  },
  methods: {
    SetTime: function() {
      let that = this;
      let nowTimestamp = (new Date()).getTime();
      let time;
      console.log(nowTimestamp);
      if (nowTimestamp >= 1559318400000) {
        if (nowTimestamp > 1559923200000) { //6.8
          time = 21600000 //6小时
        } else if (nowTimestamp > 1560528000000) { //6.15
          time = 7200000 //2小时
        } else {
          time = 43200000 //12小时
        }
        setTimeout(function() {
          that.$alert('系统使用请联系软件服务商', '通知', {
            confirmButtonText: '确定',
            callback: action => {
              that.SetTime();
            }
          });
        }, time);
      } else {
        setTimeout(function() {
          that.$alert('请校验系统时间', '通知', {
            confirmButtonText: '确定',
            callback: action => {
              that.SetTime();
            }
          });
        }, 1000);
      }
    },
    playWarningAudio: function() {
      console.log(document.getElementById("warningAudio"));
      document.getElementById("warningAudio").play();
    },
    playFireAudio: function() {
      document.getElementById("fireAudio").play();
    },
    stopAudio: function() {
      document.getElementById("warningAudio").pause();
      document.getElementById("fireAudio").pause();
      document.getElementById("warningAudio").load();
      document.getElementById("fireAudio").load();
    },
    hasUser: function() {
      let that = this;
      setTimeout(function() {
        console.log('setTimeout');
        console.log(that.$store.state.user.userName);
        console.log(localStorage.userName_gaomin);
        if (that.$store.state.user.userName != '' || localStorage.userName_gaomin != undefined) {
          that.initWebSocket();
        } else {
          that.hasUser();
        }
      }, 1000)
    },
    //WebSocket
    initWebSocket: function() {
      const link = 'ws://10.43.63.55:5001/Extension/GSocket/WSHandler.ashx?user=""';
      // const link = 'ws://192.168.0.22:6001/Extension/GSocket/WSHandler.ashx?user=""';
      // const link = 'ws://192.168.0.13:3150/Extension/GSocket/WSHandler.ashx?user=""';　　
      // console.log(link)　　　　　　
      this.websock = new WebSocket(link);
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen: function(data) {
      console.log("全局WebSocket连接成功");
    },
    websocketonerror: function(e) {
      console.log("全局WebSocket连接发生错误" + e);
    },
    websocketonmessage: function(e) {
      let that = this;
      let jsonData = JSON.parse(e.data);
      // console.log(jsonData);
      let key = jsonData.Key;
      let data = jsonData.Data;
      // console.log(data);
      // console.log(key);
      if (key == 3) {
        // this.$notify.error({
        //   title: '火警警报',
        //   message: data,
        //   duration: 0,
        // });
        if (that.$store.state.user.loginedState === true) {
          that.playFireAudio();
          that.$alert(data, '火警警报', {
            confirmButtonText: '确定',
            type: 'warning',
            center: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            callback: action => {
              that.stopAudio();
              // that.$message({
              //   type: 'info',
              //   message: `action: ${ action }`
              // });
            }
          });
        }
      } else if (key == 1) {
        // this.$notify({
        //   title: '监舍报警',
        //   message: data,
        //   duration: 0,
        //   type: 'warning',
        // });
        if (that.$store.state.user.loginedState === true) {
          that.playWarningAudio();
          console.log(data);
          that.$confirm(data.Mesg, '监舍报警', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
          }).then(() => {
            that.stopAudio();
            that.cheInfo(data);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '隐藏窗口'
            });
          });
        }
      } else if (key == 6) {
        this.$message({
          message: '登陆信息过时,请您重新登陆!',
          type: 'warning'
        });
        localStorage.removeItem("jurisdiction_gaomin");
        localStorage.removeItem("userName_gaomin");
        this.$store.state.user.loginedState = false;
        this.$store.state.user.userName = '';
        this.$store.state.user.jurisdiction = {
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
        };
        this.$router.push('/sign');
      } else if (key == 7) {
        that.axios.get('/api/user/GetUserPermissions?username=' + that.$store.state.user.userName).then(function(rel) {
          if (rel.status == 200) {
            console.log(rel.data);
            let e = JSON.stringify(rel.data);
            that.getRolesCallback(e, function() {
              that.getJurisdiction();
            })
          }
        }).catch(rel => {
          console.log(rel);
        });
      }
    },
    websocketclose(e) {
      console.log("全局 socket 关闭");
    },
    setRolesLocalStorage: function(e) {},
    getRolesCallback: function(e, callback) {
      console.log(e);
      localStorage.jurisdiction_gaomin = e;
      callback();
    },
    cheInfo: function(item) {
      let that = this;
      that.axios.post('/api/alarmHty/ConfirmAlarmRT', {
        "AlarmCode": item.AlarmCode,
        "DoorId": item.DoorId,
        "CreationTime": item.CreationTime,
      }).then(function(rel) {
        console.log(rel);
        if (rel.status == 200) {
          that.$message({
            message: '该报警已被确认',
            type: 'success'
          });
        } else {
          that.$message({
            message: '该报警确认时有误',
            type: 'warning'
          });
        }
      }).catch(rel => {
        console.log(rel);
      });
    },
    getJurisdiction: function() {
      let that = this;
      let jv = JSON.parse(localStorage.jurisdiction_gaomin);
      if (localStorage.jurisdiction_gaomin) {
        let ju = localStorage.jurisdiction_gaomin;
        for (let i in jv) {
          if (jv[i].Code == "QueryDoorHty") {
            this.$store.state.user.jurisdiction.QueryDoorHty = jv[i].Enabled;
          } else if (jv[i].Code == "QueryAlarmHty") {
            this.$store.state.user.jurisdiction.QueryAlarmHty = jv[i].Enabled;
          } else if (jv[i].Code == "QueryShiftHty") {
            this.$store.state.user.jurisdiction.QueryShiftHty = jv[i].Enabled;
          } else if (jv[i].Code == "QueryArt") {
            this.$store.state.user.jurisdiction.QueryArt = jv[i].Enabled;
          } else if (jv[i].Code == "AddArt") {
            this.$store.state.user.jurisdiction.AddArt = jv[i].Enabled;
          } else if (jv[i].Code == "EditArt") {
            this.$store.state.user.jurisdiction.EditArt = jv[i].Enabled;
          } else if (jv[i].Code == "DeleteArt") {
            this.$store.state.user.jurisdiction.DeleteArt = jv[i].Enabled;
          } else if (jv[i].Code == "QueryDoor") {
            this.$store.state.user.jurisdiction.QueryDoor = jv[i].Enabled;
          } else if (jv[i].Code == "AddDoor") {
            this.$store.state.user.jurisdiction.AddDoor = jv[i].Enabled;
          } else if (jv[i].Code == "EditDoor") {
            this.$store.state.user.jurisdiction.EditDoor = jv[i].Enabled;
          } else if (jv[i].Code == "DeleteDoor") {
            this.$store.state.user.jurisdiction.DeleteDoor = jv[i].Enabled;
          } else if (jv[i].Code == "QueryWebcam") {
            this.$store.state.user.jurisdiction.QueryWebcam = jv[i].Enabled;
          } else if (jv[i].Code == "QueryCard") {
            this.$store.state.user.jurisdiction.QueryCard = jv[i].Enabled;
          } else if (jv[i].Code == "AddCard") {
            this.$store.state.user.jurisdiction.AddCard = jv[i].Enabled;
          } else if (jv[i].Code == "EditCard") {
            this.$store.state.user.jurisdiction.EditCard = jv[i].Enabled;
          } else if (jv[i].Code == "DeleteCard") {
            this.$store.state.user.jurisdiction.DeleteCard = jv[i].Enabled;
          } else if (jv[i].Code == "AuthorizeCard") {
            this.$store.state.user.jurisdiction.AuthorizeCard = jv[i].Enabled;
          } else if (jv[i].Code == "QueryControl") {
            this.$store.state.user.jurisdiction.QueryControl = jv[i].Enabled;
          } else if (jv[i].Code == "AddControl") {
            this.$store.state.user.jurisdiction.AddControl = jv[i].Enabled;
          } else if (jv[i].Code == "EditControl") {
            this.$store.state.user.jurisdiction.EditControl = jv[i].Enabled;
          } else if (jv[i].Code == "DeleteControl") {
            this.$store.state.user.jurisdiction.DeleteControl = jv[i].Enabled;
          } else if (jv[i].Code == "QueryScheduling") {
            this.$store.state.user.jurisdiction.QueryScheduling = jv[i].Enabled;
          } else if (jv[i].Code == "ImportScheduling") {
            this.$store.state.user.jurisdiction.ImportScheduling = jv[i].Enabled;
          } else if (jv[i].Code == "EditScheduling") {
            this.$store.state.user.jurisdiction.EditScheduling = jv[i].Enabled;
          } else if (jv[i].Code == "DeleteScheduling") {
            this.$store.state.user.jurisdiction.DeleteScheduling = jv[i].Enabled;
          } else if (jv[i].Code == "QueryRole") {
            this.$store.state.user.jurisdiction.QueryRole = jv[i].Enabled;
          } else if (jv[i].Code == "AddRole") {
            this.$store.state.user.jurisdiction.AddRole = jv[i].Enabled;
          } else if (jv[i].Code == "UpdateRole") {
            this.$store.state.user.jurisdiction.UpdateRole = jv[i].Enabled;
          } else if (jv[i].Code == "DeleteRole") {
            this.$store.state.user.jurisdiction.DeleteRole = jv[i].Enabled;
          } else if (jv[i].Code == "AuthorizeRole") {
            this.$store.state.user.jurisdiction.AuthorizeRole = jv[i].Enabled;
          } else if (jv[i].Code == "QueryUser") {
            this.$store.state.user.jurisdiction.QueryUser = jv[i].Enabled;
          } else if (jv[i].Code == "AddUser") {
            this.$store.state.user.jurisdiction.AddUser = jv[i].Enabled;
          } else if (jv[i].Code == "UpdateUser") {
            this.$store.state.user.jurisdiction.UpdateUser = jv[i].Enabled;
          } else if (jv[i].Code == "DeleteUser") {
            this.$store.state.user.jurisdiction.DeleteUser = jv[i].Enabled;
          } else if (jv[i].Code == "AuthorizeUser") {
            this.$store.state.user.jurisdiction.AuthorizeUser = jv[i].Enabled;
          } else if (jv[i].Code == "ResetPwdUser") {
            this.$store.state.user.jurisdiction.ResetPwdUser = jv[i].Enabled;
          }
        }
        console.log(this.$store.state.user.jurisdiction);
      } else {
        this.getUserPermissions();
      }

    },
    getUserPermissions: function() {
      let that = this;
      that.axios.get('/api/user/GetUserPermissions?username=' + that.$store.state.user.userName).then(function(rel) {
        if (rel.status == 200) {
          let e = JSON.stringify(rel.data);
          console.log(e);
          that.getRolesCallback(e, function() {
            that.getJurisdiction();
          })
        }
      }).catch(rel => {
        console.log(rel);
      });
    },
    getUsername: function() {
      if (localStorage.userName_gaomin) {
        // that.$store.state.user.loginedState = true;
        this.$store.state.user.userName = localStorage.userName_gaomin;
        this.$store.state.user.trueName = localStorage.truename_gaomin;
      }
    }
  },
  components: {
    componentTopNav
  },
  watch: {}
}
</script>

<style lang="scss">
#app {
    min-height: 100%;
    height: 100%;
    width: 100%;
    padding: 100px 20px 0;
    > header {
        padding: 0;
        margin: 0;
        height: 85px;
        position: fixed;
        width: 100%;
        min-width: 1280px;
        top: 0;
        left: 0;
        right: 0;
        z-index: 998;
        transition: padding-right 0.3s;
    }
    > main {
        height: 100%;
        min-height: 100%;
        > div {
            height: 100%;
            min-height: 100%;
        }
    }
    div.allMark {
        display: none;
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
    }
}
.rightContainer {
    display: block;
    position: fixed;
    right: -580px;
    top: 100px;
    bottom: 20px;
    border-radius: 10px 0 0 10px;
    z-index: 1001;
    width: 500px;
    height: auto;
    background-color: rgba(0,0,0,0.4);
    transition: right 0.3s;
    overflow: hidden;
    > div.title {
        display: flex;
        justify-content: space-between;
        // background-color: rgba(0, 0, 0, 0.7);
        > h5 {
            display: flex;
            color: #409EFF;
            line-height: 40px;
            justify-content: flex-start;
            padding: 10px;
            font-size: 16px;
            font-weight: bolder;
            > i {
                display: block;
                height: 40px;
                width: 8px;
                margin-right: 10px;
                border-radius: 10px;
                background-color: #409EFF;
            }
        }
        > a.btn {
            display: block;
            border-radius: 5px;
            margin: 16px;
            line-height: 26px;
            font-size: 12px;
            height: 28px;
            // width: 18px;
            padding: 0 20px;
            text-align: center;
            border: 1px solid #409EFF;
            color: #409EFF;
            &:focus,
            &:hover {
                color: #fff;
                background: #409EFF;
            }
        }
    }

    > .cam {
        width: 100%;
        height: calc(100% - 60px);
        overflow-x: hidden;
        overflow-y: scroll;
        border: none;
        outline: none;
        background: none;
        -ms-overflow-style: none;
        overflow: -moz-scrollbars-none;

        &::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
        }
    }
}
body.hasCamera {
    padding-right: 500px;
    // div#app {
    //     > header {
    //         padding-right: 660px;
    //     }
    // }
    div.model1 {
        padding-right: 500px;
    }
    .rightContainer {
        right: 0;
    }
}
.AudioPlayer {
    height: 0;
    width: 0;
    visibility: hidden;
    opacity: 0;
    display: block;
}
</style>
