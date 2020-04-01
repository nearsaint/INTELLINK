<template>
<div class="dashboard">
  <div class="btnContainer">
    <el-button size="mini" type="primary" round @click="item_add"><i class="fa fa-plus-circle"></i> 添加窗口</el-button>
    <el-button size="mini" type="primary" round @click="item_lock"><i class="fa" :class="[this.lock?'fa-lock':'fa-unlock']"></i> <template v-if="this.lock">已锁定</template><template v-else>已解锁</template></el-button>
    <el-button size="mini" type="primary" round><i class="fa fa-plus-circle"></i> 全屏</el-button>
  </div>
  <gridstackView :ref="'gridstackView'" @lock="viewActive"></gridstackView>

</div>
</template>

<script>
import gridstackView from 'components/dashboard/gridstackView'
export default {
  data() {
    return {
      lock: false,
    }
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    item_add: function() {
      // this.$refs.gridstackView.item_add()
      this.$goRouter.to('/dashboard_setting', {
        id: ''
      })
    },
    item_lock: function() {
      this.$refs.gridstackView.item_lock()
    },
    viewActive: function(e) {
      this.lock = e;
    }
  },
  computed: {},
  watch: {},
  components: {
    gridstackView
  },
}
</script>
<style lang="scss" scoped>
.dashboard {
    padding: 10px 5px;
    position: relative;
    > .btnContainer {
        position: fixed;
        top: 0;
        left: 64px;
        width: auto;
        height: 52px;
        z-index: 10000;
        padding: 12px 10px;
    }
}
</style>
