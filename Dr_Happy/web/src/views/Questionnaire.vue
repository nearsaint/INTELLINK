<template>
<div class="question boxView">
  <div class="questionList">
    <questionListBox class="questionListBox"></questionListBox>
  </div>
  <div class="message">
    <questionBox class="questionBox"></questionBox>
  </div>
</div>
</template>

<script>
import questionListBox from 'components/question/questionListBox.vue'
import questionBox from 'components/question/questionBox.vue'

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
    questionBox,
    questionListBox
  },
}
</script>
<style lang="scss" scoped>
.question {
    > .questionList {
        width: calc(79% - 20px);
        margin-right: 20px;
    }
    > .message {
        width: 21%;
        > .questionBox {
            height: calc(100vh - 124px);
        }
    }
}
</style>
