<template>
<div class="routehead">
  <el-page-header @back="goBack" :content="title">
  </el-page-header>
</div>
</template>

<script>
export default {
  props: ['title'],
  data() {
    return {}
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    goBack: function() {
      console.log('go back');
    },
  },
  computed: {},
  watch: {},
  components: {},
}
</script>
<style lang="scss" scoped>
.routehead {}
</style>
