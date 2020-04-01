<template>
<div class="menuComponent" v-show="logined">
  <div class="floatLeft">
    <div class="logo">
      <a href="/Vue/#/"></a>
      <i></i>
      <span>
        <h6>南方电网综合能源有限公司</h6>
        <h6>龙旗电子制氮、制气项目</h6>
      </span>
    </div>
  </div>
  <div class="floatRight">
    <at-menu mode="horizontal" router>
      <at-menu-item :to="{ path: '/home' }"><i class="iconfont">&#xe895;</i> 总览</at-menu-item>
      <at-menu-item :to="{ path: '/machine' }"><i class="iconfont">&#xe813;</i> 设备</at-menu-item>
      <at-menu-item :to="{ path: '/form' }"><i class="iconfont">&#xe7e3;</i> 报表</at-menu-item>
    </at-menu>
    <i class="line"></i>
    <at-dropdown @on-dropdown-command="handleCommand">
      <at-button size="small">{{userName}}</at-button>
      <at-dropdown-menu slot="menu">
        <at-dropdown-item name="signOut">注销</at-dropdown-item>
      </at-dropdown-menu>
    </at-dropdown>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      logined: this.$store.state.logined,
      userName: this.$store.state.loginName
    }
  },
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    handleCommand: function(e) {
      if (e == 'signOut') {
        this.signOut()
      }
    },
    signOut: function() {
      let that = this;
      that.axios.post('/api/login/Logout').then(function(res) {
        console.log(res);
        if (res.data.StateCode == 200) {
          localStorage.setItem('logined', false);
          that.$store.state.logined = false;
          localStorage.setItem('loginName', '');
          that.$store.state.loginName = '';
          that.$router.push('/login');
        };
      }).catch(res => {
        console.log(res);
      });
    }
  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.logo {
    height: 60px;
    width: auto;
    display: flex;
    > a {
        display: block;
        height: 60px;
        width: 160px;
        background-image: url("../assets/images/logo.png");
        background-position: left;
        background-size: 90%;
        background-repeat: no-repeat;
    }
    > i {
        display: block;
        height: 30px;
        width: 1px;
        background-color: #ddd;
        margin: 15px 20px 15px 0;
    }
    span {
        margin: 10px 0;
        > h6 {
            line-height: 20px;
            font-size: 14px;
        }
    }
}
.at-menu {
    height: 60px !important;
    line-height: 60px !important;
    border-bottom: 0;
    > .at-menu__item {
        height: 100% !important;
        margin: 0 20px;
    }
}
.floatRight {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    > i.line {
        height: 30px;
        width: 1px;
        background: #ddd;
        display: block;
        margin: 15px 20px 15px 10px;
    }
    .at-btn {
        height: 30px;
        margin: 15px 0;
    }
}
.iconfont {
    font-size: 20px;
}
</style>
