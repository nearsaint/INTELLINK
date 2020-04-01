<template>
<div class="leftNav">
  <!-- <router-link class="bt" :to="{ path: 'myLog'}">
    <i class="fa fa-address-book" aria-hidden="true"></i>
    <h4>我的日志</h4>
    <h5>My Log</h5>
  </router-link> -->
  <router-link class="bt" :to="{ path: 'roomLog'}" v-if="$store.state.user.jurisdiction.QueryDoorHty">
    <i class="fa fa-unlock" aria-hidden="true"></i>
    <h4>监舍日志</h4>
    <h5>Room Log</h5>
  </router-link>
  <router-link class="bt" :to="{ path: 'warningLog'}" v-if="$store.state.user.jurisdiction.QueryAlarmHty">
    <i class="fa fa-warning" aria-hidden="true"></i>
    <h4>报警日志</h4>
    <h5>Warning Log</h5>
  </router-link>
  <!-- <router-link class="bt" :to="{ path: 'exchangeLog'}" v-if="$store.state.user.jurisdiction.QueryShiftHty">
    <i class="fa fa-exchange" aria-hidden="true"></i>
    <h4>交接班日志</h4>
    <h5>Exchange Log</h5>
  </router-link> -->
</div>
</template>

<script>
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
  components: {},
}
</script>

<style lang="scss" scoped>
</style>
