<template>
<div class="toolComponent">
  <!-- <div class="search">
    <el-input size="medium" placeholder="快速搜索患者">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
  </div> -->
  <div class="user">
    <el-dropdown size="medium" split-button type="primary" @command="handleCommand">
      <b class="avarat"></b> {{$store.state.user.username}}
      <el-dropdown-menu slot="dropdown">
        <!-- <el-dropdown-item icon="el-icon-set-up">账号设置</el-dropdown-item> -->
        <el-dropdown-item icon="el-icon-switch-button" command="a">注销</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
    }
  },
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {
    this.$store.state.user.username = localStorage.userName_lelejian;
  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    handleCommand(e) {
      if (e == "a") {
        this.signOut();
      }
    },
    signOut: function() {
      this.$store.state.user.logined = false;
      this.$store.state.user.username = '';
      localStorage.userName_lelejian = '';
      this.$router.push({
        path: '/login',
      });
    },
  },
  computed: {},
  watch: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.toolComponent {
    height: 64px;
    width: 100%;
    padding: 0 20px;
    // background-color: #fff;
    // border-bottom: 1px solid #ddd;
    .search {
        float: left;
        width: 210px;
        opacity: 0.5;
        height: 100%;
        padding: 14px 0;
        transition: all 0.3s;
        &:hover {
            width: 360px;
            opacity: 1;
        }
    }
    .user {
        height: 100%;
        float: right;
        padding: 14px 0;
    }
}
</style>
