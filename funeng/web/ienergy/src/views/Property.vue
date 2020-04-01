<template>
<div class="property">
  <button type="button" name="button" class="btn" @click="gotoBack">
    <i class="iconfont">&#xe8bd;</i>
  </button>
  <h3>{{tagName}}</h3>
  <div class="DBcontainer">
    <div class="chart canvas" :id="'myChart'" ref="lineChart">
    </div>
    <div class="timer">
      <el-date-picker v-show="historyMode" @change="getProperty_history()" v-model="times" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" size="small">
      </el-date-picker>
      <el-button v-show="!historyMode" @click="openHistory()" :loading="loadingData" class="submit" size="small" type="success">查看历史数据</el-button>
      <el-button v-show="historyMode" @click="closeHistory()" :loading="loadingData" type="warning" size="small" plain>返回实时数据</el-button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      machineId: {},
      tagId: {},
      tagName: '',
      echart: '',
      times: [],
      historyMode: false,
      lineOption: {
        tooltip: {
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '10%'];
          },
          axisPointer: {
            type: 'cross',
            label: {
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.5)'
            },
            lineStyle: {
              color: 'rgba(0,0,0,0.5)'
            },
            crossStyle: {
              color: 'rgba(0,0,0,0.5)'
            },
          }
        },
        grid: {
          right: 10,
          top: 60,
          left: 10,

        },
        toolbox: {
          show: true,
          right: 20,
          top: 10,
          iconStyle: {
            borderColor: '#ccc',
          },
          emphasis: {
            iconStyle: {
              borderColor: '#fff',
            },
          },
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            magicType: {
              type: ['line', 'bar']
            },
            // dataView: {
            //   show: false,
            //   readOnly: false
            // },
            dataView: {},
            restore: {},
            // saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chartDate,
          axisLine: {
            lineStyle: {
              color: '#fff',
            }
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: ['10%', '10%'],
          min: function(value) {
            return value.min - (value.min / 4);
          },
          max: function(value) {
            return value.max + (value.min / 4);
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            }
          },
          axisLabel: {
            inside: true,
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.5)'
            },
          },
        },
        dataZoom: [{
          type: 'inside',
          start: 90,
          end: 100
        }, {
          start: 0,
          end: 10,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }],
        series: [{
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          itemStyle: {
            color: '#fff'
          },
          data: this.chartData,
          markPoint: {
            label: {
              color: '#333',
            },
            data: [{
                type: 'max',
                name: '最大值'
              },
              {
                type: 'min',
                name: '最小值'
              }
            ]
          },
          markLine: {
            label: {
              position: 'middle'
            },
            lineStyle: {
              color: '#fff'
            },
            data: [{
              type: 'average',
              name: '平均值'
            }]
          }
        }]
      },
      chartData: [],
      chartDate: [],
      loadingData: false,
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.initWebSocket();
    this.get_data_query();
  },
  mounted: function() {
    this.createChart();
    this.getProperty();
  },
  beforeDestroy: function() {
    this.websock.close();
  },
  destroyed: function() {
    this.websock.close();
  },
  methods: {
    closeHistory: function() {
      // this.closeHistory();
      this.historyMode = false;
      this.initWebSocket();
      this.getProperty();
      this.times = [];
      // this.getProperty_now();
    },
    openHistory: function() {
      // this.closeHistory();
      this.historyMode = true;

      this.chartData = [];
      this.chartDate = [];
      this.lineOption.series[0].data = this.chartData;
      this.lineOption.xAxis.data = this.chartDate;
      this.echart.setOption(this.lineOption);
      this.websock.close();
      // this.getProperty_now();
    },
    get_data_query: function() {
      this.machineId = this.$route.query.machineId;
      this.tagId = this.$route.query.tagId;
      this.tagName = this.$route.query.tagName;
    },
    gotoBack: function() {
      this.$router.back(-1)
    },
    routeChange: function() {
      this.get_data_query();
    },
    getProperty: function(id) {
      let that = this;
      that.loadingData = true;
      that.axios.post('/api/Machine/GetLatestRTTags', {
        "Inputs": [{
          "GetTagsType": 0,
          "MachineId": that.machineId,
          "TagId": that.tagId,
          "QueryType": 0,
          "StatisticType": 0,
          "StartTime": '',
          "EndTime": '',
          "Count": 500
        }]
      }).then(function(res) {
        console.log(res);
        that.loadingData = false;
        that.chartData = [];
        that.chartDate = [];
        for (let i in res.data[0].Tags) {
          that.chartData.push(res.data[0].Tags[i].FValue.toFixed(2));
          that.chartDate.push(res.data[0].Tags[i].TimeStamp);
        }
        that.lineOption.series[0].data = that.chartData;
        that.lineOption.xAxis.data = that.chartDate;
        that.echart.setOption(that.lineOption);
        that.getNewProperty();
      }).catch(res => {
        console.log(res);
      });
    },
    createChart: function() {
      let that = this;
      this.echart = this.$echarts.init(document.getElementById('myChart'));
      that.echart.setOption(that.lineOption);
    },
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
      this.getNewProperty();
    },
    websocketonerror: function(e) {
      console.log("WebSocket连接发生错误" + e);　　　　　　
    },
    websocketclose: function(e) {
      console.log("WebSocket关闭")
    },
    websocketonmessage: function(e) {　
      let that = this;
      let data = JSON.parse(e.data);
      console.log(data);
      that.chartData.shift();
      that.chartDate.shift();
      that.chartData.push(data.Data.FValue.toFixed(2));
      that.chartDate.push(data.Data.TimeStamp);
      that.lineOption.series[0].data = that.chartData;
      that.lineOption.xAxis.data = that.chartDate;
      that.echart.setOption(that.lineOption);
    },
    getNewProperty: function(e) {
      let that = this;
      let machineId = parseInt(that.machineId);
      let tagId = parseInt(that.tagId);
      let data = {
        Key: 1,
        Data: {
          Tags: [{
            MachineId: machineId,
            TagId: tagId
          }],
        },
      };
      console.log(JSON.stringify(data));
      if (machineId && tagId) {
        setTimeout(function() {
          that.websock.send(JSON.stringify(data), function(res) {
            console.log(res)
          })
        }, 1000)
      }
    },
    getProperty_history: function() {
      let that = this;
      that.loadingData = true;
      // console.log(that.times[0]);
      that.axios.post('/api/Machine/GetHtyRTTags', {
        "Inputs": [{
          "GetTagsType": 0,
          "MachineId": that.machineId,
          "TagId": that.tagId,
          "QueryType": 0,
          "StatisticType": 0,
          "StartTime": that.times[0],
          "EndTime": that.times[1],
          "Count": 500
        }]
      }).then(function(res) {
        console.log(res);
        that.loadingData = false;
        that.chartData = [];
        that.chartDate = [];
        for (let i in res.data[0].Tags) {
          that.chartData.push(res.data[0].Tags[i].FValue.toFixed(2));
          that.chartDate.push(res.data[0].Tags[i].TimeStamp);
        }
        that.lineOption.series[0].data = that.chartData;
        that.lineOption.xAxis.data = that.chartDate;
        that.echart.setOption(that.lineOption);
      }).catch(res => {
        console.log(res);
        that.$Message.error(res.statusText)
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
.property {
    padding-right: 20px;
    .btn {
        border: none;
        background: none;
        outline: none;
        font-size: 32px;
        cursor: pointer;
        display: inline-block;
        margin-right: 20px;
        color: #6190E8;
        &:hover {
            opacity: 0.9;
        }
    }
    > h3 {
        display: inline-block;
        font-size: 28px;
        line-height: 32px;
    }
    .DBcontainer {
        height: 500px;
        margin-top: 20px;
        background: #6190e8;
        border-radius: 3px;
        > h3 {
            display: inline-block;
            font-size: 28px;
            line-height: 30px;
            padding: 20px;
        }
        > .chart {
            border-radius: 3px;
            bottom: 62px;
            height: calc(100% - 62px);
        }
        > .timer {
            bottom: 0;
            height: 52px;
            border-top: 1px solid rgba(255,255,255,0.3);
            position: absolute;
            width: 100%;
            padding: 10px;
            justify-content: flex-end;
            display: flex;
            > .el-button {
                margin-left: 10px;
            }
        }
    }
}
</style>
