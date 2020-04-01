<template>
<div class="log">
  <componentLeftNavLog></componentLeftNavLog>
  <div class="mainBox right">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import componentLeftNavLog from 'components/component_leftNav_log.vue'
export default {
  data() {
    return {

    }
  },
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {},
  computed: {},
  components: {
    componentLeftNavLog
  },
}
</script>

<style lang="scss" scoped>
</style>
