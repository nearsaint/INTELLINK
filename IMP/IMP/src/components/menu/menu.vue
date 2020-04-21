<template>
<div class="componentMenu">
  <div class="menu">
    <div class="bottom">
      <button @click="isCollapse=!isCollapse">
        <i class="el-icon-caret-left" v-show="!isCollapse"></i>
        <i class="el-icon-caret-right" v-show="isCollapse"></i>
      </button>
    </div>
    <el-menu :class="[!isCollapse?'active':'']" :router="true" default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <el-menu-item index="/">
        <i class="el-icon-house"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="dashboard">
        <i class="el-icon-odometer"></i>
        <span slot="title">驾驶舱</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-notebook-2"></i>
          <span slot="title">设备管理</span>
        </template>
        <el-menu-item index="device_index">设备台账</el-menu-item>
        <el-menu-item index="device_parts">备件管理</el-menu-item>
        <el-menu-item index="1-3">点检巡检</el-menu-item>
        <el-menu-item index="1-4">设备保养</el-menu-item>
        <el-menu-item index="1-5">维修报修</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-data-line"></i>
          <span slot="title">能源管理</span>
        </template>
        <el-menu-item index="power_statistics">能源统计</el-menu-item>
        <el-menu-item index="power_analysis">能源分析</el-menu-item>
        <el-menu-item index="power_prediction">能耗预测</el-menu-item>
        <el-menu-item index="3-4">能源优化</el-menu-item>
        <el-menu-item index="3-5">异常报警</el-menu-item>
      </el-submenu>
      <!-- <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item> -->
    </el-menu>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true
    }
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
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
.componentMenu {
    position: relative;
    background-color: #fff;
    height: calc(100vh - 52px);
    min-width: 64px;
    .menu {
        overflow-y: scroll;
        height: 100%;
        .el-menu {
            border-right: none;
            transition: width 0.3s;
            &.active {
                width: 200px;
            }
        }
        .bottom {
            > button {
                border: none;
                outline: none;
                width: 100%;
                height: 18px;
                background-color: #fcfcfc;
                color: #999;
                &:hover {
                    color: #666;
                    background-color: #f6f6f6;

                }
            }
        }
    }

}
</style>
