<template>
<div class="patient boxView">
  <div class="userList">
    <patientListBox></patientListBox>
  </div>
  <div class="message">
    <reviewMessageBox class="reviewMessageBox"></reviewMessageBox>
  </div>
</div>
</template>

<script>
import reviewMessageBox from 'components/home/reviewMessageBox.vue'
import patientListBox from 'components/patient/patientListBox.vue'
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
    patientListBox
  },
}
</script>
<style lang="scss" scoped>
.patient {
    > .userList {
        width: calc(79% - 20px);
        margin-right: 20px;
    }
    > .message {
        width: 21%;
        > .reviewMessageBox {
            height: calc(100vh - 104px);
            // margin-bottom: 20px;
        }
    }
}
</style>
