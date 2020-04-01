<template>
<div class="login">
  <h3>登陆 | SignIn</h3>
  <h4>南方电网综合能源有限公司<br/>龙旗电子制氮、制气项目</h4>
  <div class="form">
    <at-input v-model="inputValue" placeholder="账号" size="large"></at-input>
    <at-input v-model="password" type="password" placeholder="密码" size="large"></at-input>
    <at-button type="primary" @click="signIn">登陆</at-button>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: '',
      password: '',
    }
  },
  beforeCreate: function() {},
  created: function() {
    if (localStorage.logined) {
      this.$router.push('/');
    }
  },
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    signIn: function(id) {
      let that = this;
      that.axios.post('/api/login/LoginIn', {
        'LoginName': that.inputValue,
        'Password': that.password,
      }).then(function(res) {
        console.log(res);
        if (res.data.StateCode == 200) {
          localStorage.setItem('logined', true);
          that.$store.state.logined = true;
          localStorage.setItem('loginName', that.inputValue);
          that.$store.state.loginName = that.inputValue;
          that.$router.push('/');
          that.$Message.success(res.data.Message)
        } else {
          that.$Message.error(res.data.Message)
        }
        // console.log(that.$store.state.logined);
        // console.log(localStorage.logined);
      }).catch(res => {
        console.log(res);
      });
    },

  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.login {
    padding: 60px;
    text-align: center;
    > h3 {
        margin-bottom: 10px;
        font-size: 26px;
        font-weight: bold;
    }
    > h4 {
        margin-bottom: 60px;
        font-size: 14px;
        line-height: 18px;
        color: #ccc;
    }
    > .form {
        margin: 0 auto;
        width: 400px;
        .at-input {
            margin-bottom: 20px;
        }
        .at-btn {
            width: 100%;
        }
    }
}
</style>
