<template>
<div class="home boxView">
  <div class="form">
    home
  </div>
  <div class="message">
    <reviewMessageBox class="reviewMessageBox"></reviewMessageBox>
  </div>
</div>
</template>

<script>
import reviewMessageBox from 'components/home/reviewMessageBox.vue'
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
  watch: {},
  components: {
    reviewMessageBox,
  },
}
</script>
<style lang="scss" scoped>
.home {
    > .form {
        width: calc(79% - 20px);
        margin-right: 20px;
    }
    > .message {
        width: 21%;
        > .reviewMessageBox {
            height: calc(100vh - 104px);
        }
    }
}
</style>
