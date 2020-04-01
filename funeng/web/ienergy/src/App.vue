<template>
<div id="app">
  <header v-if="this.$store.state.logined">
    <menuComponent class="menuComponent"></menuComponent>
  </header>
  <main>
    <router-view class="routerView"></router-view>
  </main>
  <footer>
    <h5>Copyright ©2017 盛智技术提供支持 <a href="http://www.beian.miit.gov.cn" target="_blank">粤ICP备18013414号</a></h5>
    <!-- 盛智技术提供支持 -->
  </footer>
</div>
</template>

<script>
import menuComponent from 'components/menuComponent.vue'
export default {
  data() {
    return {
      logined: this.$store.state.logined
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.checkLogin();
    this.getTree();
  },
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    getTree: function(id) {
      let that = this;
      that.axios.get('/api/Machine/GetIOTList')
        .then(function(res) {
          console.log(res);
          that.$store.state.iot.data = res.data;
          // console.log(that.$store);
        }).catch(res => {
          console.log(res);
          that.$Message.error(res.statusText)
        });
    },
    checkLogin: function() {
      this.$store.state.logined = false;
      this.$store.state.loginName = '';
      console.log(this.logined);
      // // console.log(JSON.parse(localStorage.logined));
      // let logined = localStorage.getItem(logined);
      if (localStorage.logined == undefined || localStorage.logined == 'false') {
        this.$router.push({
          path: '/login',
        })
      } else {
        this.$store.state.logined = JSON.parse(localStorage.logined);
        this.$store.state.loginName = localStorage.loginName;
      }
      // console.log(this.$store.state.logined);
    },
  },
  computed: {},
  components: {
    menuComponent,
  },
}
</script>
<style lang="scss" scoped>
header {
    background: #fff;
    height: 60px;
    box-shadow: 0 10px 60px 0 rgba(29,29,31,0.07);
    opacity: 0.98;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 900;
    // min-width: 1280px;
    .menuComponent {
        width: 90%;
        margin: 0 auto;
    }
}
main {
    padding: 70px 0 5px;
    margin: 0 auto;
    width: 90%;
    min-width: 1400px;
    > .routerView {
        background-color: #fff;
        box-shadow: 0 4px 30px 0 rgba(223,225,230,0.5);
    }
}
footer {
    margin: 0 auto;
    width: 90%;
    color: #ccc;
    text-align: center;
    padding: 0 20px;
    a {
        color: #ccc;
    }
}
</style>

  <!-- // #nav {
  //     padding: 30px;
  //     a {
  //         font-weight: bold;
  //         color: #2c3e50;
  //         &.router-link-exact-active {
  //             color: #42b983;
  //         }
  //     }
  // } -->
