<template>
<div class="cards">
  <div class="title">
    <router-link class="bt" :to="{ path: 'card'}" v-if="$store.state.user.jurisdiction.QueryCard">
      卡片管理
    </router-link>
    <!-- <router-link class="bt" :to="{ path: 'device'}" v-if="$store.state.user.jurisdiction.QueryControl">
      控制器管理
    </router-link> -->
  </div>
  <div class="content">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {}
  },
  beforeCreate: function() {},
  created: function() {
    this.getJurisdiction();
  },
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    getJurisdiction: function() {
      if (!this.$store.state.user.jurisdiction.QueryCard && !this.$store.state.user.jurisdiction.QueryControl) {
        this.$message({
          message: "非法操作!您的账号权限等级不够,请检查账号或者联系管理者",
          type: 'warning'
        });
        this.$router.push('/');
      }
    },
  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
</style>
