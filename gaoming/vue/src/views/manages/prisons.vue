<template>
<div class="prisons">
  <div class="title">
    <router-link class="bt" :to="{ path: 'building'}" v-if="$store.state.user.jurisdiction.QueryArt">
      监区管理
    </router-link>
    <router-link class="bt" :to="{ path: 'room'}" v-if="$store.state.user.jurisdiction.QueryDoor">
      监舍管理
    </router-link>
    <router-link class="bt" :to="{ path: 'camera'}" v-if="$store.state.user.jurisdiction.QueryWebcam">
      视频管理
    </router-link>
  </div>
  <div class="content">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
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
      if (!this.$store.state.user.jurisdiction.QueryArt && !this.$store.state.user.jurisdiction.QueryDoor && !this.$store.state.user.jurisdiction.QueryWebcam) {
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
