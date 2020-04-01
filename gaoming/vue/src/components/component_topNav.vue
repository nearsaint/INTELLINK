<template>
<div class="topNav">
  <div class="logo">
    <a>
      <h3>高明监狱电动门管理系统</h3>
      <h6>Foshan GaoMing Prison Entrance Guard System</h6>
    </a>
  </div>
  <div class="menu">
    <router-link class="bt" to="/home">
      <h4>实时工作台</h4>
      <h5>DashBoard</h5>
    </router-link>
    <router-link class="bt" to="/log" v-if="$store.state.user.jurisdiction.QueryDoorHty||$store.state.user.jurisdiction.QueryShiftHty||$store.state.user.jurisdiction.QueryAlarmHty">
      <h4>日志</h4>
      <h5>Log</h5>
    </router-link>
    <router-link class="bt" to="/manage"
      v-if="$store.state.user.jurisdiction.QueryArt||$store.state.user.jurisdiction.QueryDoor||$store.state.user.jurisdiction.QueryWebcam&&$store.state.user.jurisdiction.QueryRole&&$store.state.user.jurisdiction.QueryUser&&$store.state.user.jurisdiction.QueryCard&&$store.state.user.jurisdiction.QueryControl&&$store.state.user.jurisdiction.QueryScheduling">
      <h4>管理</h4>
      <h5>Manage</h5>
    </router-link>
  </div>
  <div class="user">
    <el-button style="margin-right:10px" size="small" type="primary" @click="fullContainer()">
      <template v-if="!fullcontainer"><i class="fa fa-expand" aria-hidden="true"></i></template>
      <template v-if="fullcontainer"><i class="fa fa-compress" aria-hidden="true"></i></template>
    </el-button>
    <el-dropdown split-button size="small" type="primary" @command="handleCommand" @click="changeUser">
      {{$store.state.user.trueName}}
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="user">账号</el-dropdown-item>
        <el-dropdown-item command="loginOut">注销</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- <el-button type="danger" size="small" circle><i class="fa fa-power-off" aria-hidden="true"></i></el-button> -->
  </div>

  <div class="model" v-show="modalShow">
    <a class="bg" @click="closeDialog"></a>
    <a class="btn" @click="closeDialog"><i class="fa fa-times" aria-hidden="true"></i></a>

    <!-- end .bg -->
    <div class="modelBox  animated fadeInDown">
      <div class="title">
        <i></i>
        <h5>账号设置</h5>
      </div>
      <div class="content">
        <div class="object">
          <div class="title">
            <hr>
            <span>角色信息</span>
          </div>
          <ul class="input">
            <li><span>账号:</span>
              <div class="input">
                <el-input size="medium" :value="$store.state.user.userName" disabled>
                </el-input>
              </div>
            </li>
            <li><span>姓名:</span>
              <div class="input">
                <el-input size="medium" :value="$store.state.user.trueName" disabled>
                </el-input>
              </div>
            </li>
            <li><span>头像:</span>
              <div class="input">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <img v-show="!imageUrl" src="../assets/images/avarat.png" class="avatar">
                <el-upload class="avatar-uploader" action="api/user/UploadImg" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                  <el-button size="small" type="primary" :loading="btnLoad_img">上传头像</el-button>
                </el-upload>
              </div>
            </li>
          </ul>
        </div>
        <div class="object">
          <div class="title">
            <hr>
            <span>修改密码</span>
          </div>
          <ul class="input">
            <li><span>原密码</span>
              <div class="input">
                <el-input size="medium" type="password" v-model="psw">
                </el-input>
              </div>
            </li>
            <li><span>新密码</span>
              <div class="input">
                <el-input size="medium" type="password" v-model="psw_new">
                </el-input>
              </div>
            </li>
            <li><span>重复新密码</span>
              <div class="input">
                <el-input size="medium" type="password" v-model="psw_new_re">
                </el-input>
              </div>
            </li>
            <li><span> </span>
              <div class="input">
                <el-button type="primary" size="small" @click="setPsw" :loading="btnLoad_psw">修改密码</el-button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer ">
        <el-button type="info " plain size="medium " @click="closeDialog">取消</el-button>
      </div>
    </div>
  </div>

</div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: '',
      imageUrl_def: '../assets/images/avarat.png',
      modalShow: false,
      psw: '',
      psw_new: '',
      psw_new_re: '',
      btnLoad_img: false,
      btnLoad_psw: false,
      fullcontainer: false,
    }
  },
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    setPsw: function() {
      let that = this;
      console.log(that.psw);
      that.btnLoad_psw = true;
      if (that.psw == '') {
        that.$message.error('请输入原密码');
      } else {
        if (that.psw_new == that.psw_new_re) {
          if (that.psw_new == '') {
            that.$message.error('请输入新密码');
          } else {
            that.axios.post('/api/user/resetPsd', {
              'Name': that.$store.state.user.userName,
              'Password': that.psw,
              'NewPassword': that.psw_new,
            }).then(function(rel) {
              console.log(rel);
              if (rel.data.StateCode == 500) {
                that.$message.error(rel.data.Message);
              } else if (rel.data.StateCode == 200) {
                that.$message(rel.data.Message);
              }
              that.btnLoad_psw = false;
              that.modalShow = false;
              that.psw = '';
              that.psw_new = '';
              that.psw_new_re = '';
            }).catch(rel => {
              console.log(rel);
            });
          }
        } else {
          that.$message.error('重复新密码要和新密码相同, 请重新输入!');
        }

      }

    },
    handleCommand: function(command) {
      console.log(command)
      if (command == 'loginOut') {
        this.loginOut();
      } else if (command == 'user') {
        this.changeUser();
      }
    },
    handleAvatarSuccess: function(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res);
      let that = this;
      that.axios.post('/api/user/ResetImg', {
        'Name': that.$store.state.user.userName,
        'Url': res,
      }).then(function(rel) {
        console.log(rel);
      }).catch(rel => {
        console.log(rel);
      });
    },
    beforeAvatarUpload: function(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
      }
      return isJPG && isLt2M;
    },
    changeUser: function() {
      this.modalShow = true;
      console.log(localStorage.userAvarat_gaomin);
      if (localStorage.userAvarat_gaomin) {
        let img = JSON.parse(localStorage.userAvarat_gaomin);
        this.imageUrl = img;
      }
    },
    closeDialog: function() {
      this.modalShow = false;
    },
    loginOut: function() {
      console.log("loginOut")
      let that = this;
      that.axios.post('/api/login/LoginOut').then(function(rel) {
        console.log(rel);
        that.$message({
          message: rel.data.Message,
          type: 'success'
        });
        localStorage.removeItem("jurisdiction_gaomin");
        localStorage.removeItem("userName_gaomin");
        setTimeout(function() {
          that.$store.state.user.userName = '';
          that.$store.state.user.loginedState = false;
          that.$router.push('/sign');
        }, 1000)
      }).catch(rel => {
        console.log(rel);
        that.$message({
          message: '注销失败,请重试',
          type: 'warning'
        });
      });
    },
    fullContainer: function() {
      if (this.fullcontainer) {
        this.fullcontainer = false;
        var el = document;
        var cfs = el.cancelFullScreen || el.webkitCancelFullScreen ||
          el.mozCancelFullScreen || el.exitFullScreen;
        if (cfs) { //typeof cfs != "undefined" && cfs
          cfs.call(el);
        } else if (typeof window.ActiveXObject != "undefined") {
          //for IE，这里和fullScreen相同，模拟按下F11键退出全屏
          var wscript = new ActiveXObject("WScript.Shell");
          if (wscript != null) {
            wscript.SendKeys("{F11}");
          }
        }
      } else {
        this.fullcontainer = true;
        let el = document.documentElement;
        let rfs = el.requestFullScreen || el.webkitRequestFullScreen ||
          el.mozRequestFullScreen || el.msRequestFullScreen;
        if (rfs) { //typeof rfs != "undefined" && rfs
          rfs.call(el);
        } else if (typeof window.ActiveXObject != "undefined") {
          //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
          let wscript = new ActiveXObject("WScript.Shell");
          if (wscript != null) {
            wscript.SendKeys("{F11}");
          }
        }
      }
    },
  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.topNav {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding-left: 5px;
    > div.logo {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        padding: 15px 0;
        margin-right: 25px;
        flex-grow: 0;
        > a {
            display: block;
            color: #fff;
            padding: 5px 25px 5px 80px;
            background: url("../assets/images/logo/logo_police.png") no-repeat 15px;
            background-size: 50px 50px;
            border-right: 1px solid #333;
            > h3 {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
                line-height: 24px;
            }
            > h6 {
                font-size: 12px;
                line-height: 12px;
                font-weight: lighter;
            }
        }
    }
    //end .logo
    > div.menu {
        flex-grow: 1;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        > .bt {
            border: none;
            border-radius: 0 0 10px 10px;
            background: rgba(0,0,0,0.3);
            color: #fff;
            outline: none;
            margin-right: 10px;
            padding: 24px 20px;
            text-align: center;
            transition: background 0.3s;
            > h4 {
                font-size: 16px;
                line-height: 16px;
                margin-bottom: 5px;
                color: #ccc;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            > h5 {
                font-size: 12px;
                line-height: 16px;
                color: #999;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            &.touch,
            &:focus,
            &:hover {
                background-color: rgba(255,255,255,0.3);
                > h4 {
                    color: #fff;
                }
                > h5 {
                    color: #fff;
                }
            }
            &.active,
            &.router-link-active,
            &.router-link-exact-active {
                background-color: rgba(255,255,255,0.9);
                > h4 {
                    color: #00a0e9;
                }
                > h5 {
                    color: #00a0e9;
                }
            }
        }
    }
    > div.user {
        flex-grow: 0;
        padding: 24px 20px;
        > button {
            margin-left: 20px;
        }
    }
}
.avatar {
    height: 160px;
    width: 160px;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
}
.el-menu {
    background: none;
    border: none !important;
}
</style>
