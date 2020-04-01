<template>
<div class="questionEdit boxView">
  <div class="questionList">
    <questionnaireEditBox></questionnaireEditBox>
  </div>
  <!-- <div class="message">
    <questionBox class="questionBox"></questionBox>
  </div> -->
</div>
</template>

<script>
// import questionBox from 'components/question/questionBox.vue'
import questionnaireEditBox from 'components/questionnaire/questionnaireEditBox.vue'

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
    // questionBox,
    questionnaireEditBox
  },
}
</script>
<style lang="scss" scoped>
.questionEdit {
    > .questionList {
        width: 100%;
        // margin-right: 20px;
    }
    // > .message {
    //     width: 21%;
    //     > .questionBox {
    //         height: calc(100vh - 124px);
    //     }
    // }
}
</style>
