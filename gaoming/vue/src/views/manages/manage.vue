<template>
<div class="manage">
  <componentLeftNavManage></componentLeftNavManage>
  <div class="mainBox right">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import componentLeftNavManage from 'components/component_leftNav_manage.vue'
export default {
  data() {
    return {

    }
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
      if (!this.$store.state.user.jurisdiction.QueryArt && !this.$store.state.user.jurisdiction.QueryDoor && !this.$store.state.user.jurisdiction.QueryWebcam && !this.$store.state.user.jurisdiction.QueryRole && !this.$store.state.user.jurisdiction
        .QueryUser && !this.$store.state.user.jurisdiction.QueryCard && !this.$store.state.user.jurisdiction.QueryControl && !this.$store.state.user.jurisdiction.QueryScheduling) {
        this.$message({
          message: "非法操作!您的账号权限等级不够,请检查账号或者联系管理者",
          type: 'warning'
        });
        this.$router.push('/');
      }
    },
  },
  computed: {},
  components: {
    componentLeftNavManage
  },
}
</script>

<style lang="scss" scoped>

</style>
