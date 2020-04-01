<template>
<div class="propertys">
  <div class="title">
    <div class="status" :class="[machine.Status==0? 'running':'',machine.Status==1? 'stop':'',machine.Status==2? 'offline':'',machine.Status==3? 'standby':'',machine.Status==4? 'alarm':'',machine.Status==5? 'warning':'']">
      <h1>{{machine.MachineName}}</h1>
      <h4>
					<template v-if="machine.Status == 0">运行</template>
					<template v-if="machine.Status == 1">停止</template>
					<template v-if="machine.Status == 2">离线</template>
					<template v-if="machine.Status == 3">就绪</template>
					<template v-if="machine.Status == 4">错误</template>
					<template v-if="machine.Status == 5">警告</template>
      </h4>
      <i class="iconfont" v-if="machine.Status == 0">&#xe78b;</i>
      <!-- running -->
      <i class="iconfont" v-if="machine.Status == 1">&#xe792;</i>
      <!-- stop -->
      <i class="iconfont" v-if="machine.Status == 2">&#xe7a0;</i>
      <!-- offline -->
      <i class="iconfont" v-if="machine.Status == 3">&#xe77d;</i>
      <!-- standby -->
      <i class="iconfont" v-if="machine.Status == 4">&#xe796;</i>
      <!-- alarm -->
      <i class="iconfont" v-if="machine.Status == 5">&#xe783;</i>
      <!-- warn -->
      <h5><span>设备ID:</span><span>{{machine.MachineId}}</span></h5>
      <h5><span>设备类型:</span><span>{{machine.MachineTypeName}}</span></h5>
      <h5><span>所属区域:</span><span>{{machine.AreaName}}</span></h5>
      <h5><span>所属数采单元:</span><span>{{machine.DTUName}}</span></h5>
      <h5><span>设备参数个数:</span><span>{{machine.Tags.length}}</span></h5>
    </div>

    <div class="alarms">
      <h5 v-show="alarms.length==0">暂无警告信息</h5>
      <ul>
        <li v-for="(item,index) in alarms" :key="index">
          <h5>{{item.TagName}}</h5>
          <h6>{{item.AlarmInfo}}</h6>
          <h6>{{item.TimeStamp}}</h6>
        </li>
      </ul>
    </div>
  </div>
  <!-- end .title -->
  <div class="list">
    <router-view class="routerView"></router-view>
  </div>
</div>
</template>

<script>
import chartComponent from 'components/chartComponent.vue'
export default {
  data() {
    return {
      machineId: {},
      machine: {},
      alarms: [],
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.get_data_query();
  },
  mounted: function() {
    this.getMachine();
    this.getAlarms();
  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    get_data_query: function() {
      this.machineId = this.$route.query.machineId;
      console.log(this.machineId);
    },
    routeChange: function() {
      this.get_data_query();
      this.getMachine();
      this.getAlarms();
    },
    getMachine: function() {
      let that = this;
      let list = that.$store.state.iot.data.Machines;
      // console.log(list);
      for (let i in list) {
        if (that.machineId == list[i].MachineId) {
          that.machine = list[i];
        }
      }
    },
    getAlarms: function() {
      let that = this;
      that.axios.post('/api/machine/GetAlarms', {
        'MachineId': that.machineId,
        'Count': 5
      }).then(function(res) {
        console.log(res);
        that.alarms = res.data.Alarms;
      }).catch(res => {
        console.log(res);
      });
    },
  },
  computed: {},
  components: {},
  watch: {
    '$route': 'routeChange',
  },
}
</script>

<style lang="scss" scoped>
.propertys {
    padding: 20px;
    > .title {
        display: flex;
        justify-content: flex-start;
        padding-bottom: 20px;
        border-bottom: 1px solid #ddd;
        > .status {
            width: calc(50% - 10px);
            margin-right: 10px;
            background-color: #999;
            padding: 20px;
            border-radius: 3px;
            color: #fff;
            display: flex;
            flex-wrap: wrap;
            overflow: hidden;
            position: relative;
            &.running {
                background: #09BB07;
            }
            &.standby {
                background: #00b7ee;
            }
            &.stop {
                background: #666;
            }
            &.off {
                background: #ccc;
            }
            &.warning {
                background: #FFB400;
            }
            &.alarm {
                background: #cd0615;
            }
            > h1 {
                font-size: 32px;
                width: 100%;
                margin-bottom: 10px;
            }
            > h4 {
                font-size: 20px;
                width: 100%;
                margin-bottom: 20px;
                font-weight: bold;
            }
            > h5 {
                font-size: 14px;
                width: 420px;
                border-top: 1px dotted rgba(255,255,255,0.5);
                padding: 8px 0;
                display: block;
                margin-right: 108px;
                display: flex;
                justify-content: space-between;
                &:last-child {
                    border-bottom: 1px dotted rgba(255,255,255,0.5);
                }
            }
            > .iconfont {
                position: absolute;
                right: 20px;
                top: 10px;
                font-size: 88px;
                opacity: 0.8;
            }
        }
        > .alarms {
            // padding: 10px;
            width: calc(50% - 10px);
            margin-left: 10px;
            background: #34495E;
            border-radius: 3px;
            position: relative;
            > h5 {
                position: absolute;
                top: 50%;
                right: 50%;
                transform: translateX(50%);
                color: #fff;
            }
            > ul {
                width: 100%;
                > li {
                    border-bottom: 1px solid rgba(255,255,255,0.3);
                    padding: 10px;
                    &:last-child {
                        border-bottom: none;
                    }
                    > h5 {
                        font-size: 14px;
                        font-weight: bold;
                        color: #F1C40F;
                        line-height: 16px;
                    }
                    > h6 {
                        font-size: 12px;
                        color: #ccc;
                        line-height: 16px;
                    }
                }
            }
        }
    }
    > .list {
        width: calc(100% + 20px);
        padding: 20px 0 0;
        margin-right: -20px;

    }
}
</style>
