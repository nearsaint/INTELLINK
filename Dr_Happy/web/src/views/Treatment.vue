<template>
<div class="treatment boxView">
  <el-page-header @back="goBack" :content="item.name">
  </el-page-header>
  <questionnaire class="questionnaire" v-bind:item="item"></questionnaire>
  <info class="info" v-bind:item="item"></info>
</div>
</template>

<script>
import info from 'components/treat/info.vue'
import questionnaire from 'components/treat/questionnaire.vue'
export default {
  data() {
    return {
      item: {
        name: '未知姓名',
        sex: 0,
        birthday: '1990-01-01',
        nation: '未知民族',
        phone: '未知号码',
        age: '未知年龄',
        height: '未知身高',
        weight: '未知体重',
        smoking: '未知',
        drinking: '未知',
        hospital: '未知医院',
        subject: '未知科室',
        treatment: '未知治疗',
        reviewer: '系统管理员',
        startTime: '未知时间',
        questionnaire: {
          status: '未知状态',
          data: 0,
          cycle: '未知周期',
          records: [],
        },
      },
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.get_query();
  },
  mounted: function() {
    this.questionnaire_get()
  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    goBack: function() {
      this.$router.go(-1);
    },
    get_query: function() {
      console.log(this.$route.query);
      this.pid = this.$route.query.pid;
      this.qnid = this.$route.query.qnid;
    },
    questionnaire_get: function() {
      let that = this;
      that.$axios.get('/api/patient?id=' + that.pid + '&qnid=' + that.qnid).then(function(rel) {
        console.log(rel)
        if (rel.data.code == 200) {
          that.item = rel.data;
        }
      }).catch(rel => {
        console.log(rel)
      });
    },
  },
  computed: {},
  watch: {},
  components: {
    questionnaire,
    info
  },
}
</script>
<style lang="scss" scoped>
.treatment {
    padding-bottom: 0;
    > .el-page-header {
        width: 100%;
        margin-bottom: 20px;
    }

    > .info {
        width: calc(30% - 20px);
        // height: calc(100vh - 150px);
        margin-bottom: 20px;
        border: 1px solid #ddd;
        border-radius: 6px;
    }
    > .questionnaire {
        width: 70%;
        min-height: calc(100vh - 150px);
        margin-right: 20px;
        border: 1px solid #ddd;
        border-radius: 6px;
    }
}
</style>
