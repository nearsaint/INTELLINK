<template>
<div class="questionnaire box">
  <div class="title">问卷信息
    <div class="btnContainer">
      <a class="refresh"></a>
    </div>
  </div>
  <div class="content">
    <div class="info">
      <ul>
        <li>
          <h5>
            <template v-if="item.questionnaire.status==0">待审核</template>
            <template v-if="item.questionnaire.status==1">进行中</template>
            <template v-if="item.questionnaire.status==2">已拒绝</template>
            <template v-if="item.questionnaire.status==3">已结束</template>
            <template v-if="item.questionnaire.status==4">待开始</template>
          </h5>
          <h6>状态</h6>
        </li>
        <li>
          <h5>{{item.questionnaire.date}}</h5>
          <h6>当前天数</h6>
        </li>
        <li>
          <h5>{{item.questionnaire.cycle}}</h5>
          <h6>周期</h6>
        </li>
        <li>
          <h5>{{item.questionnaire.start}}</h5>
          <h6>开始时间</h6>
        </li>
      </ul>
    </div>

    <div class="main">
      <el-collapse v-model="activeName" accordion>
        <el-timeline>
          <el-timeline-item v-for="(day,index) in item.questionnaire.records" :key="index" :timestamp="day.isDoctor?'医生信息':'Day '+day.index" placement="top" :color="getColor(day.isDoctor,day.clock)" size="large">
            <h5 v-if="day.questions.length==0" class="null">未填写</h5>
            <el-collapse-item v-if="day.questions.length>0" :title="day.questions.length+'题'" :name="index">
              <ul>
                <li v-for="(q,i) in day.questions" :key="i">
                  <h5>{{q.ask}}</h5>
                  <h6>{{q.answer}}</h6>
                </li>
              </ul>
            </el-collapse-item>
          </el-timeline-item>

          <el-timeline-item timestamp="end" placement="top" color="#909399">
          </el-timeline-item>

        </el-timeline>
      </el-collapse>

    </div>

  </div>
</div>
</template>

<script>
export default {
  props: {
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
  },
  data() {
    return {
      activeName: 0,
    }
  },
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    getColor: function(a, b) {
      if (a) {
        return '#409EFF'
      } else {
        if (b) {
          return '#67C23A'
        } else {
          return '#F56C6C'
        }
      }
    },
  },
  computed: {},
  watch: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.questionnaire {
    > .content {
        > .info {
            > ul {
                border-top: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
                display: flex;
                flex-wrap: nowrap;
                > li {
                    border-right: 1px solid #ddd;
                    flex-shrink: 0;
                    flex-grow: 1;
                    padding: 15px 10px;
                    text-align: center;
                    &:last-child {
                        border-right: none;
                    }
                    > h5 {
                        font-size: 16px;
                        color: #444;
                        margin-bottom: 6px;
                    }
                    > h6 {
                        font-size: 12px;
                        color: #999;
                    }
                }
            }
        }

        .main {
            padding: 20px;
            .el-collapse {
                border: none;
            }
            .el-timeline-item {

                h5.null {
                    line-height: 48px;
                    font-size: 13px;
                    font-weight: 500;
                    color: #ccc;
                }
                .el-collapse-item {
                    ul {
                        border-radius: 6px;
                        border: 1px solid #ddd;
                        > li {
                            padding: 20px;
                            border-bottom: 1px solid #ddd;
                            &:last-child {
                                border-bottom: none;
                            }
                            > h5 {
                                font-size: 14px;
                                margin-bottom: 8px;
                                color: #666;
                            }
                            > h6 {
                                font-size: 15px;
                                color: #333;
                                font-weight: bold;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.questionnaire {
    .main {
        .el-collapse {
            .el-timeline-item {
                .el-timeline-item__tail {
                    transition: border-color 0.3s;
                }
                &:hover {
                    .el-timeline-item__tail {
                        border-color: #666;
                    }
                }
            }
        }
    }
}
</style>
