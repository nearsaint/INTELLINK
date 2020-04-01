<template>
<div class="treat boxView">
  <div class="userList">
    <treatListBox class="treatListBox"></treatListBox>
  </div>
  <div class="message">
    <reviewMessageBox class="reviewMessageBox"></reviewMessageBox>
    <commentMessageBox class="commentMessageBox"></commentMessageBox>
  </div>
</div>
</template>

<script>
import reviewMessageBox from 'components/home/reviewMessageBox.vue'
import commentMessageBox from 'components/home/commentMessageBox.vue'
import treatListBox from 'components/treat/treatListBox.vue'

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
    commentMessageBox,
    reviewMessageBox,
    treatListBox
  },
}
</script>
<style lang="scss" scoped>
.treat {
    > .userList {
        width: calc(79% - 20px);
        margin-right: 20px;
    }
    > .message {
        width: 21%;
        > .commentMessageBox {
            height: 45vh;
        }
        > .reviewMessageBox {
            height: calc(55vh - 124px);
            margin-bottom: 20px;
        }
    }
}
</style>
