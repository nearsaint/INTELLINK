<template>
<div class="componentMenuTools">
  <div class="floatLeft">
    <a class="logo" href="/"></a>
  </div>
  <div class="floatRight">
    <el-button-group>
      <el-button type="primary" icon="el-icon-warning" size="small"></el-button>
      <el-button type="primary" icon="el-icon-message-solid" size="small"></el-button>
      <el-button type="primary" icon="el-icon-s-platform" size="small"></el-button>
    </el-button-group>
    <el-dropdown split-button type="primary" size="small">
      Administrator
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>账号</el-dropdown-item>
        <el-dropdown-item>注销</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {},
  computed: {},
  watch: {},
  components: {},
}
</script>
<style lang="scss" scoped>
.componentMenuTools {
    width: 100vw;
    height: 52px;
    background-color: #fff;
    // box-shadow: 0 0 6px #ccc;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 10px;
    z-index: 200;
    .el-button-group {
        margin-left: 10px;
    }
    .el-dropdown {
        margin-left: 10px;
    }
    .logo {
        height: 52px;
        width: 64px;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        display: block;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 58%;
        background-image: url("../../assets/images/logo.png");
        transition: all 0.1s;
        &:hover {
            background-size: 68%;
            background-color: #f9f9f9;
        }
    }
    .floatLeft {
        padding-left: 62px;
    }
}
</style>
