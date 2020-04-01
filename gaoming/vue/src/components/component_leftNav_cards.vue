<template>
<div class="leftNav">
  <router-link class="bt" :to="{ path: '/manage/prisons'}">
    <i class="fa fa-building" aria-hidden="true"></i>
    <h4>监舍管理</h4>
    <h5>Prisons</h5>
  </router-link>
  <router-link class="bt" :to="{ path: '/manage/roles'}">
    <i class="fa fa-user-secret" aria-hidden="true"></i>
    <h4>角色管理</h4>
    <h5>Roles</h5>
  </router-link>
  <router-link class="bt" :to="{ path: '/manage/polices'}">
    <i class="fa fa-users" aria-hidden="true"></i>
    <h4>警员管理</h4>
    <h5>Polices</h5>
  </router-link>
  <router-link class="bt" :to="{ path: '/manage/cards'}">
    <i class="fa fa-id-card" aria-hidden="true"></i>
    <h4>卡片管理</h4>
    <h5>Cards</h5>
  </router-link>
  <router-link class="bt" :to="{ path: '/manage/scheduling'}">
    <i class="fa fa-calendar" aria-hidden="true"></i>
    <h4>排班管理</h4>
    <h5>Scheduling</h5>
  </router-link>
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
  methods: {},
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
</style>
