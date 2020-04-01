<template>
<div class="login">
  <div class="logo">
    <i></i>
    <h5>乐乐健随访平台-医生端</h5>
    <h6>Lele Fit Questionnaire</h6>
  </div>
  <div class="input">
    <el-autocomplete class="inline-input signInput" v-model="userName" :fetch-suggestions="querySearch" placeholder="输入账号" clearable ref="userName"></el-autocomplete>
    <el-input class="signInput" type="password" placeholder="密码" v-model="userPassword" clearable ref="userPassword">
    </el-input>
    <el-button type="primary" :loading="isloading" round @click="login">验证登陆</el-button>
    <div class="BA">
      <a href="http://www.beian.miit.gov.cn">粤ICP备19136504号-1</a>
    </div>
  </div>
</div>
</template>

<script>
import {
  setCookie,
  getCookie
} from 'src/api/Cookie.js'
export default {
  // inject: ['hasUser'],
  data() {
    return {
      userName: '',
      truename: '',
      userPassword: '',
      userId: '',
      userList: [{
        value: '中山大学附属六院-任东林',
        psw: '13600001818',
        id: 1,
      }, {
        value: '解放军150医院-高春芳',
        psw: '13503791293',
        id: 2,
      }, {
        value: '重庆市中医院-徐月',
        psw: '13627661756',
        id: 3,
      }, {
        value: '上海曙光医院-杨巍',
        psw: '13917198396',
        id: 4,
      }, {
        value: '兰州军区总院-高峰',
        psw: '13919763019',
        id: 5,
      }, {
        value: '江苏省中医院-邵万金',
        psw: '13813889778',
        id: 6,
      }, {
        value: '中南医院-钱群',
        psw: '13098824999',
        id: 7,
      }, {
        value: '火箭军总院-赵克',
        psw: '13917198396',
        id: 8,
      }, {
        value: '北医三院-陈朝文',
        psw: '13901038133',
        id: 9,
      }, {
        value: '银川市人民医院-杨芸',
        psw: '09516192235',
        id: 10,
      }, {
        value: '山西省人民医院-翟春宝',
        psw: '15835133331',
        id: 11,
      }, {
        value: '吉林大学附属医院-邰建东',
        psw: '043262456181',
        id: 12,
      }, {
        value: '厦门中医院-赵斌',
        psw: '05825579686',
        id: 13,
      }, {
        value: '沈阳市肛肠医院-袁和学',
        psw: '02431138888',
        id: 14,
      }, {
        value: '汕头大学第一附属医院-杨填',
        psw: '13502771778',
        id: 15,
      }],
      isloading: false,
      jurisdiction: [],
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.$store.state.user.loginedState = false;
  },
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {

    login: function() {
      let that = this;
      if (that.userName == '') {
        that.$refs.userName.focus();
        that.$message({
          message: '请输入账号',
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
        that.login();
      }
    },
    postUser: function() {
      for (let i in this.userList) {
        if (this.userList[i].value == this.userName) {
          if (this.userList[i].psw == this.userPassword) {
            this.$store.state.user.logined = true;
            setCookie('lelefitToken', this.userName, 1000 * 60 * 60 * 24);
            this.$store.state.user.username = this.userList[i].value;
            localStorage.userName_lelejian = this.userList[i].value;
            localStorage.id_lelejian = this.userList[i].id;
            this.$message({
              message: "登陆成功!",
              type: "success"
            });
            this.getUtil();
            this.$router.push({
              path: '/treat',
            });
            return
          } else {
            this.$message({
              message: "密码错误!",
              type: "warning"
            });
            this.isloading = false;
            return
          }
        }
      }
      this.$message({
        message: "账号错误!",
        type: "warning"
      });
      this.isloading = false;
    },
    login: function() {
      let that = this;
      let name;
      if (that.userName == 'admin') {
        name = that.userName
      } else {
        name = that.userName.split('-')[1]
      }
      console.log(name);
      if (name === undefined) {
        that.$message({
          message: "账号错误!",
          type: "warning"
        });
      } else {
        that.$axios.post('/api/login', {
          username: name,
          password: that.userPassword
        }).then(function(rel) {
          console.log(rel)
          if (rel.data.code == 200) {
            that.$message({
              message: "登陆成功!",
              type: "success"
            });
            that.$store.state.user.username = rel.data.name;
            localStorage.userName_lelejian = rel.data.name;
            localStorage.id_lelejian = rel.data.id;
            that.$store.state.user.logined = true;
            setCookie('lelefitToken', rel.data.name, 1000 * 60 * 60 * 24);
            const cookie = that.$cookies.get();
            console.log(cookie);
            that.$router.push({
              path: '/treat',
            });
          } else if (rel.data.code == 401) {
            that.$message({
              message: "账号或者密码错误!",
              type: "warning"
            });
          }
        }).catch(rel => {
          console.log(rel)
        });
      }

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
  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
div.login {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #f5f5f5;
}
div.logo {
    margin: 60px auto;
    display: flex;
    width: 400px;
    flex-wrap: wrap;
    > i {
        display: block;
        width: 168px;
        height: 168px;
        margin: 40px auto;
        background-image: url("../assets/images/icons/android-chrome-512x512.png");
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
    }
    @media (max-height: 700px) {
        & {
            margin: 20px auto !important;
            > i {
                width: 128px;
                height: 128px;
                margin: 20px auto;
            }
        }
    }
    > h5 {
        width: 100%;
        display: block;
        text-align: center;
        font-size: 32px;
        font-weight: bolder;
        color: #333;
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
    padding: 40px 40px 30px;
    border-radius: 10px;
    // background: #fff;
    > .el-input,
    > .el-autocomplete {
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
    }
    > .el-button {
        margin: 20px auto 0;
        width: 100%;
    }
    > .BA {
        padding: 10px 0 0;
        width: 100%;
        text-align: center;
        > a {
            color: #ccc;
            font-size: 12px;
        }
    }
}
</style>
