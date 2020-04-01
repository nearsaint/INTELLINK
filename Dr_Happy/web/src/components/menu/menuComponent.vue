<template>
<div class="menuComponent">
  <div class="logo">
    <a href="/"></a>
  </div>
  <el-menu class="el-menu" :router="true" :collapse="true" text-color="#444" active-text-color="#1989fa" background-color="#fff">
    <!-- <el-menu-item index="/">
      <i class="el-icon-monitor"></i>
      <span slot="title">首页</span>
    </el-menu-item> -->
    <!-- <el-menu-item index="/patient" :class="($route.path.substring(0, 8)=='/patient')?'is-active':''">
      <i class="el-icon-user"></i>
      <span slot="title">患者</span>
    </el-menu-item> -->
    <el-menu-item index="/treat" :class="($route.path.substring(0, 6)=='/treat')?'is-active':''">
      <!-- <i class="el-icon-date"></i> -->
      <i class="el-icon-monitor"></i>
      <span slot="title">疗程</span>
    </el-menu-item>
    <el-menu-item index="/questionnaire" :class="($route.path.substring(0, 9)=='/question')?'is-active':''">
      <i class="el-icon-document-copy"></i>
      <span slot="title">问卷</span>
    </el-menu-item>
    <el-menu-item disabled>
      <!-- index="/user" :class="($route.path.substring(0, 5)=='/user')?'is-active':''" -->
      <i class="el-icon-setting"></i>
      <!-- <span slot="title">权限</span> -->
    </el-menu-item>
  </el-menu>
</div>
</template>

<script>
export default {
  data() {
    return {}
  },
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    goto: function(route) {
      this.$router.push({
        path: route,
      })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  computed: {},
  watch: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.menuComponent {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: 100vh;
    background-color: #fff;
    box-shadow: 0 0 12px #ddd;
    position: relative;
    > .logo {
        width: 64px;
        height: 64px;
        background-color: #fff;
        border-bottom: 1px solid #eee;
        > a {
            display: block;
            height: 100%;
            width: 100%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 66%;
            background-image: url("../../assets/images/icons/logo_onlyicon.png");
        }
    }
    > .el-menu {
        border-right: none;
        background-color: none;
        position: absolute;
        height: auto;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-50%);
    }
}
</style>

<style lang="scss">
.menuComponent .el-menu-item.is-active {
    color: #409EFF !important;
}
</style>
