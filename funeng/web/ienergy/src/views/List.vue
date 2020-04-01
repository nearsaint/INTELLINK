<template>
<div class="list">
  <h5 class="tip" v-show="machine==undefined">暂无数据
    <span>等待加载或重新刷新</span>
  </h5>
  <ul>
    <li v-for="(item,index) in machine.Tags" :key="index" :class="[item.RTagAlarmType==1||item.RTagAlarmType==3?'warrning':'',item.RTagAlarmType==2||item.RTagAlarmType==4?'alarm':'']">
      <!-- <chartComponent :query="item"></chartComponent> -->
      <a @click="goto(machine.MachineId,item.TagId,item.TagName,item.TagType)">
        <!-- <h3>{{item.FValue}}<span>{{item.Unit}}</span></h3> -->
        <h3 class="val blue" v-if="item.DataType==0 && item.TagType == 0">{{item.FValue}}<span>{{item.Unit}}</span></h3>
        <h3 class="val" :class="[item.FValue==1&&item.AlarmType==0?'green':'',item.FValue==1&&item.AlarmType==1?'red':'']" v-if="item.DataType==0 && item.TagType == 1">
									<template v-if="item.FValue==1 && item.AlarmType==0"><i class="iconfont">&#xe89a;</i></template>
									<template v-if="item.FValue==1 && item.AlarmType==1"><i class="iconfont">&#xe89f;</i></template>
									<template v-if="item.FValue==0"><i class="iconfont">&#xe89d;</i></template>
				</h3>
        <h3 class="val blue2" v-if="item.DataType==0 && item.TagType == 2">{{item.FValue}}<span>{{item.Unit}}</span></h3>
        <h3 class="val" v-if="item.DataType==1 && item.TagType == 0">"{{item.SValue}}"<span>{{item.Unit}}</span></h3>
        <h3 class="val" v-if="item.DataType==1 && item.TagType == 1">"{{item.SValue}}"<span>{{item.Unit}}</span></h3>
        <!-- <h3 class="val" v-if="item.DataType==0 && item.TagType == 1">"{{item.FValue}}"</h3> -->

        <h4>{{item.TagName}}</h4>
        <i class="iconfont">&#xe856;</i>
      </a>
    </li>
  </ul>
</div>
</template>

<script>
import chartComponent from 'components/chartComponent.vue'
export default {

  data() {
    return {
      machineId: {},
      websock: null,
      machine: {},
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.initWebSocket();
  },
  mounted: function() {
    this.get_data_query();
    this.getMachine();
  },
  beforeDestroy: function() {
    this.websock.close();
  },
  destroyed: function() {
    this.websock.close();
  },
  methods: {
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
    get_data_query: function() {
      this.machineId = this.$route.query.machineId;
      console.log(this.machineId);
    },
    routeChange: function() {
      this.get_data_query();
      this.getMachine();
      this.websocketsend();
    },
    //WebSocket
    initWebSocket: function() {　
      // const link = 'ws://192.168.0.13:3150/Extension/GSocket/WSHandler.ashx';　　　　　　　
      const link = 'wss://38798879.xyz/Extension/GSocket/WSHandler.ashx';　　　　　　　
      this.websock = new WebSocket(link);　　　　　　　　
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;　　　　　　　　
      this.websock.onclose = this.websocketclose;　　　　
    },
    websocketonopen: function(data) {　　　　　　　　
      console.log("WebSocket连接成功");　　
      this.websocketsend();　　　　
    },
    websocketonerror: function(e) {
      console.log("WebSocket连接发生错误" + e);　　　　　　
    },
    websocketonmessage: function(e) {　
      let that = this;
      let data = JSON.parse(e.data);
      console.log(data);
      if (data.Data.MachineStatus) {
        that.machine.Status = data.Data.MachineStatus
      }
      if (data.Data.InitialMachineDtos) {
        if (data.Data.InitialMachineDtos.length == 0) {
          return
        }
        that.machine.Status = data.Data.InitialMachineDtos[0].MachineStatus;
      }
      let Tags = that.machine.Tags;
      let RTags;
      if (data.Data.InitialMachineDtos) {
        RTags = data.Data.InitialMachineDtos[0].RTags
      } else {
        RTags = data.Data.RTags
      }
      console.log(Tags);
      console.log(RTags);
      for (let i in RTags) {
        for (let n in Tags) {
          if (RTags[i].TagId == Tags[n].TagId) {
            if (Tags[n].TagType == 0 || Tags[n].TagType == 2) {
              Tags[n].FValue = RTags[i].FValue.toFixed(2);
            } else {
              Tags[n].FValue = RTags[i].FValue
            }
            Tags[n].SValue = RTags[i].SValue;
            Tags[n].RTagAlarmType = RTags[i].RTagAlarmType;
          }
        }
      }
    },
    websocketsend: function(e) {
      let that = this;
      let machineId = parseInt(this.machine.MachineId);
      let data = {
        Key: 0,
        Data: {
          MachineIds: [machineId],
        },
      };
      console.log(JSON.stringify(data));
      if (machineId) {
        setTimeout(function() {
          that.websock.send(JSON.stringify(data), function(res) {
            console.log(res)
          })
        }, 1000)
      }
    },
    goto: function(MachineId, TagId, TagName, TagType) {
      let that = this;
      if (TagType == 0) {
        that.$router.push({
          path: '/machine/propertys/' + MachineId + '/property/' + TagId,
          query: {
            'machineId': MachineId,
            'tagId': TagId,
            'tagName': TagName
          }
        })
      } else if (TagType == 1) {
        that.$router.push({
          path: '/machine/propertys/' + MachineId + '/log/' + TagId,
          query: {
            'machineId': MachineId,
            'tagId': TagId,
            'tagName': TagName
          }
        })
      }
      // else if (TagType == 2) {
      //   that.$router.push({
      //     path: '/machine/propertys/' + MachineId + '/statistic/' + TagId,
      //     query: {
      //       'machineId': MachineId,
      //       'tagId': TagId,
      //       'tagName': TagName
      //     }
      //   })
      // }

    },
  },
  computed: {},
  components: {
    chartComponent,
  },
  watch: {
    '$route': 'routeChange',
  },
}
</script>

<style lang="scss" scoped>
.list {
    width: 100%;
    padding: 0;
    > ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        > li {
            width: calc(33.33% - 20px);
            margin-right: 20px;
            margin-bottom: 20px;
            background: #fefefe;
            border: 1px solid #ddd;
            border-radius: 3px;
            transition: all 0.3s;
            // overflow: hidden;
            @media (max-width: 1500px) {
                & {
                    width: calc(50% - 20px) !important;
                }
            }
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            &.warrning {
                border: 1px solid rgba(241,196,15,1);
                background: rgba(241,196,15,0.3);
                &:hover {
                    background: rgba(241,196,15,0.4);
                }
            }
            &.alarm {
                border: 1px solid rgba(241,31,15,1);
                background: rgba(241,31,15,0.3);
                &:hover {
                    background: rgba(241,31,15,0.4);
                }
            }
            &:hover {
                background: #f3f3f3;
                // > a {
                //     > h3 {
                //         color: #fff !important;
                //         > span {
                //             color: #fff !important;
                //         }
                //     }
                //     > h4 {
                //         color: #fff;
                //     }
                //     > i {
                //         color: #fff;
                //     }
                // }
            }
            > a {
                display: block;
                width: 100%;
                height: 100%;
                padding: 15px;
                position: relative;
                > h3 {
                    color: #999;
                    font-size: 26px;
                    margin-bottom: 10px;
                    > span {
                        color: #999;
                        font-size: 16px;
                        margin-left: 5px;
                    }
                    &.blue {
                        color: #3498DB;
                    }
                    &.blue2 {
                        color: #8E44AD;
                    }
                    &.green {
                        color: #27AE60;
                    }
                    &.red {
                        color: #c70000;
                    }
                }
                > h4 {
                    color: #444;
                    font-size: 16px;
                }
                > i {
                    position: absolute;
                    top: 50%;
                    right: 20px;
                    font-size: 20px;
                    transform: translateY(-50%);
                    color: #ddd;
                }
            }
        }
    }
}
.tip {
    text-align: center;
    width: 100%;
    padding: 100px 0;
    font-size: 16px;
    color: #444;
    > span {
        font-size: 12px;
        display: block;
        margin-top: 10px;
        color: #999;
    }
}
</style>
