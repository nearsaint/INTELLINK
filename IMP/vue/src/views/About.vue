<template>
<div class="view">
  ff
</div>
</template>

<script>
import {
  get_text
} from 'api/api'
export default {
  data() {
    return {
      numberValidateForm: {
        age: ''
      },
      rules: [{
          required: true,
          message: '年龄不能为空'
        },
        {
          type: 'number',
          message: '年龄必须为数字值'
        }
      ]
    }
  },
  created() {},
  mounted() {
    console.log(this.$store)
    get_text().then(response => {
      console.log(response)
    }).catch(response => {
      console.log(response)
    });

  },
  destroyed() {},
  methods: {
    getConfigResult(r) {
      console.log(r);
    },

  },
  computed: {},
  watch: {},
  components: {},
}
</script>
<style lang="scss" scoped>
</style>
