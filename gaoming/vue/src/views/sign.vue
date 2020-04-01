<template>
<div>
  <div class="logo">
    <i></i>
    <h5>高明监狱电动门管理系统</h5>
    <h6>Foshan GaoMing Prison Entrance Guard System</h6>
  </div>
  <div class="input">
    <el-autocomplete class="inline-input signInput" v-model="userName" :fetch-suggestions="querySearch" placeholder="警员账号" clearable ref="userName"></el-autocomplete>
    <el-input class="signInput" type="password" placeholder="密码" v-model="userPassword" clearable ref="userPassword">
    </el-input>
    <el-button type="primary" :loading="isloading" round @click="login">验证登陆</el-button>
  </div>
</div>
</template>

<script>
import {
  setCookie,
  getCookie
} from 'src/assets/scripts/Cookie.js'
export default {
  // inject: ['hasUser'],
  data() {
    return {
      userName: '',
      truename: '',
      userPassword: '',
      userId: '',
      userList: [],
      isloading: false,
      jurisdiction: [],
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.$store.state.user.loginedState = false;
    this.$store.state.user.userName = '';
    // this.keyupSubmit();
  },
  mounted: function() {
    this.getPolices();
    // this.hasUser();

    console.log(this.$store.state.user.userName)
  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    keyupSubmit: function() {
      // document.onkeydown = e => {
      //   let _key = window.event.keyCode;
      //   if (_key === 13) {
      //     this.login();
      //   }
      // }
    },
    getPolices: function() {
      let that = this;
      that.axios.get('/api/user/GetUserList')
        .then(function(rel) {
          console.log(rel.data.rows);
          for (let i in rel.data.rows) {
            that.userList.push({
              'value': rel.data.rows[i].UserName
            });
          }
        }).catch(rel => {
          console.log(rel);
        });
    },
    querySearch(queryString, cb) {
      var restaurants = this.userList;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    login: function() {
      // alert('不应该出来的啊    我草       !!!!')
      let that = this;
      if (that.userName == '') {
        that.$refs.userName.focus();
        that.$message({
          message: '请输入或选择警员账号',
          type: 'warning'
        });
        return;
      } else if (that.userPassword == '') {
        that.$refs.userPassword.focus();
        that.$message({
          message: '请输入账号密码',
          type: 'warning'
        });
        return;
      } else {
        that.isloading = true;
        that.postUser();
      }

    },
    postUser: function() {
      let that = this;
      that.axios.post('/api/login/LoginIn', {
        "LoginName": that.userName,
        "Password": that.userPassword,
      }).then(function(rel) {
        console.log(rel);
        let type;
        if (rel.data.StateCode == 200) {
          type = 'success';
        } else {
          type = 'warning';
        }

        if (rel.data.Data) {
          if (typeof(Storage) !== "undefined") {
            // console.log(rel.data.Data);
            localStorage.truename_gaomin = JSON.stringify(rel.data.TrueName);
            localStorage.jurisdiction_gaomin = JSON.stringify(rel.data.Data);
            localStorage.userAvarat_gaomin = JSON.stringify(rel.data.Img);
            that.truename = rel.data.TrueName;
            console.log(that.truename);
            // console.log(localStorage.jurisdiction_gaomin);
            that.getJurisdiction();
          } else {
            that.$message({
              message: "权限读取出错!",
              type: "warning"
            });
          }
        }

        that.$message({
          message: rel.data.Message,
          type: type
        });

        that.isloading = false;
        if (rel.data.StateCode == 500) {
          that.$refs.userName.focus();
        } else if (rel.data.StateCode == 200) {
          that.$store.state.user.userName = that.userName;
          localStorage.userName_gaomin = that.userName;
          that.$store.state.user.trueName = that.truename;
          localStorage.truename_gaomin = that.truename;
          setTimeout(function() {
            that.$store.state.user.loginedState = true;
            if (that.$route.query.to) {
              that.$router.push(that.$route.query.to);
            } else {
              that.$router.push('/');
            }
          }, 1000)
        }
      }).catch(rel => {
        console.log(rel);
        that.$message({
          message: '登陆失败,请重试',
          type: 'warning'
        });
        that.isloading = false;
      });
    },

    getJurisdiction: function() {
      if (localStorage.jurisdiction_gaomin) {
        let ju = localStorage.jurisdiction_gaomin;
        let jv = JSON.parse(ju);
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
          } else if (jv[i].Code == "AuthorizeCard") {
            this.$store.state.user.jurisdiction.AuthorizeCard = jv[i].Enabled;
          } else if (jv[i].Code == "DeleteCard") {
            this.$store.state.user.jurisdiction.DeleteCard = jv[i].Enabled;
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
      }
    },
  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
div.logo {
    margin: 0 auto 40px;
    display: flex;
    width: 400px;
    flex-wrap: wrap;
    > i {
        display: block;
        width: 168px;
        height: 168px;
        margin: 0 auto 40px;
        background-image: url("../assets/images/logo/logo_police.png");
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
    }
    > h5 {
        width: 100%;
        display: block;
        text-align: center;
        font-size: 32px;
        font-weight: bolder;
        color: #fff;
        margin-bottom: 10px;
    }
    > h6 {
        width: 100%;
        display: block;
        text-align: center;
        font-size: 16px;
        color: #999;
    }
}
div.input {
    display: flex;
    flex-wrap: wrap;
    width: 320px;
    margin: 0 auto;
    border: 1px solid #ddd;
    padding: 40px;
    border-radius: 10px;
    > .el-autocomplete,
    > .el-input {
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
    }
    > .el-button {
        margin: 20px auto 0;
        width: 100%;
    }
}
</style>
