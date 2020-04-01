<template>
<div class="loadingProgress">
  <el-progress class="progress" v-show="show" :percentage="percentage" :show-text="false" :stroke-width="3" :status="status"></el-progress>
</div>
</template>

<script>
export default {
  name: 'loadingProgress',
  props: {},
  data() {
    return {
      percentage: this.$store.state.progress.percentage,
      status: this.$store.state.progress.status,
      show: this.$store.state.progress.show,
    }
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

<style scoped lang="scss">
.loadingProgress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100vw;
}
</style>
