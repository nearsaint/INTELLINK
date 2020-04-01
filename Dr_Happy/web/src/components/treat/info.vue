<template>
<div class="info box">
  <div class="title">患者信息
  </div>
  <div class="content">
    <div class="userinfo">
      <div class="avarat male" :style="'background-image: url('+item.avatarUrl+')'"></div>
      <h3>{{item.name}}</h3>
    </div>
    <ul>
      <h5>患者基础信息</h5>
      <li>
        <h5>{{item.phone}}</h5>
        <h6>联系方式</h6>
      </li>
      <li>
        <h5>
          <template v-if="item.sex==1">男</template>
          <template v-if="item.sex==2">女</template>
          <template v-if="item.sex==0">未知</template>
        </h5>
        <h6>性别</h6>
      </li>
      <li>
        <h5>{{item.nation}}</h5>
        <h6>民族</h6>
      </li>
      <li>
        <h5>{{item.birthday}}</h5>
        <h6>出生年月日</h6>
      </li>
    </ul>
    <ul>
      <h5>开始此次治疗时数据</h5>
      <li>
        <h5>{{item.height}}cm</h5>
        <h6>身高</h6>
      </li>
      <li>
        <h5>{{item.weight}}kg</h5>
        <h6>体重</h6>
      </li>
      <li>
        <h5>
          <template v-if="item.smoking==1">是</template>
          <template v-if="item.smoking==0">否</template>
        </h5>
        <h6>吸烟史</h6>
      </li>
      <li>
        <h5>{{getAge(item.birthday,item.questionnaire.start)}}</h5>
        <h6>年龄</h6>
      </li>
      <li>
        <h5>
          <template v-if="item.drinking==1">是</template>
          <template v-if="item.drinking==0">否</template>
        </h5>
        <h6>饮酒史</h6>
      </li>
    </ul>
    <!-- <ul>
      <h5>微信信息</h5>
      <li>
        <h5>wx927438293</h5>
        <h6>微信号</h6>
      </li>
      <li>
        <h5>(づ￣3￣)づ╭❤～</h5>
        <h6>微信昵称</h6>
      </li>
    </ul> -->
    <ul>
      <h5>疗程信息</h5>
      <li>
        <h5>{{item.hospital}}</h5>
        <h6>医院</h6>
      </li>
      <li>
        <h5>{{item.subject}}</h5>
        <h6>科室</h6>
      </li>
      <li>
        <h5>{{item.treatment}}</h5>
        <h6>治疗</h6>
      </li>
      <li>
        <h5>{{item.questionnaire.start}}</h5>
        <h6>开始治疗日期</h6>
      </li>
    </ul>
    <ul>
      <h5>审核信息</h5>
      <li>
        <h5>{{item.reviewer}}</h5>
        <h6>审核者</h6>
      </li>
      <li>
        <h5>{{item.questionnaire.start}}</h5>
        <h6>审核时间</h6>
      </li>
    </ul>
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

    }
  },
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    getAge: function(t1, t2) {
      t1 = t1.split('-');
      t1 = parseInt(t1[0]);
      t2 = t2.split('-');
      t2 = parseInt(t2[0]);
      let age = t2 - t1;
      return age;
    }
  },
  computed: {},
  watch: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.info {
    > .content {
        display: flex;
        flex-wrap: wrap;
        > .userinfo {
            width: 100%;
            position: relative;
            padding-top: 120px;
            text-align: center;
            > .avarat {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 3px solid #ddd;
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                background-color: #f5f5f5;
                position: absolute;
                left: 50%;
                top: 0;
                margin-left: -50px;
            }
            h3 {
                margin-bottom: 10px;
            }
            h5 {
                font-size: 16px;
                color: #999;
            }
        }
        > ul {
            width: 100%;
            border-bottom: 1px solid #ddd;
            display: flex;
            flex-wrap: wrap;
            margin-top: 20px;
            > h5 {
                font-size: 12px;
                color: #999;
                line-height: 24px;
                padding: 0 10px;
                width: 100%;
                text-align: center;
            }
            > li {
                width: 50%;
                padding: 20px 10px;
                border-top: 1px solid #ddd;
                border-right: 1px solid #ddd;
                text-align: center;
                &:nth-child(odd) {
                    border-right: none;
                }
                > h5 {
                    font-size: 15px;
                    font-weight: bolder;
                    margin-bottom: 10px;
                    color: #666;
                }
                > h6 {
                    font-size: 13px;
                    color: #999;
                }
            }
        }
    }
}
</style>
