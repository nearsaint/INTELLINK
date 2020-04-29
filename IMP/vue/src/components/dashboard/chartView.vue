<template>
<div class="chartView">
  <ve-chart :data="chartData" :settings="chartSettings" height='100%' width="100%" :legend="legend" :extend="extend" :grid="grid" :visual-map="visualMap" :loading="loading" :data-empty="dataEmpty" ref="veLine"></ve-chart>
  <!-- <ve-histogram :data="chartData" height='100%' width="100%" :legend="legend" :extend="extend" :grid="grid" :visual-map="visualMap" :loading="loading" :data-empty="dataEmpty" ref="veLine"></ve-histogram> -->

  <div class="date">
    <el-radio-group v-model="date" size="mini">
      <el-radio-button label="年"></el-radio-button>
      <el-radio-button label="周"></el-radio-button>
      <el-radio-button label="日"></el-radio-button>
      <el-radio-button label="时"></el-radio-button>
    </el-radio-group>

    <el-button-group>
      <el-button type="primary" size="mini" @click="changeType">更换图表</el-button>
      <!-- <el-button type="primary" size="mini">更换图表</el-button>
      <el-button type="primary" size="mini">更换图表</el-button> -->
    </el-button-group>
  </div>
</div>
</template>

<script>
import 'v-charts/lib/style.css'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/visualMap'
import {
  CHART_INIT,
  CHART_SET,
  CHART_CLICK,
  CHART_RESIZE,
} from 'assets/scripts/echart'

import {
  DATA_GET_ID
} from 'api/api'
export default {
  model: {
    prop: 'options',
    event: 'change'
  },
  props: {
    options: Object,
  },
  data() {
    this.typeArr = ['line', 'histogram', 'pie', 'bar']
    this.index = 0
    this.extend = {
      series: {
        label: {
          show: true,
          color: "#666"
        },
        lineStyle: {
          width: 2
        },
        itemStyle: {
          borderWidth: 2,
          // borderColor: '#999',
        }
      }
    };
    this.grid = {
      show: true,
      top: 30,
      left: 0,
      bottom: 10,
      right: 0,
      borderColor: '#fff'
    };
    this.visualMap = [
      //   {
      //   type: 'piecewise',
      //   splitNumber: 5,
      //   min: 0,
      //   max: 200,
      //   right: 0,
      //   top: '50%'
      // }
    ];
    this.legend = {
      width: 'auto',
      top: 0,
      icon: 'roundRect',
      itemWidth: 16,
      itemHeight: 6,
      // top: 0,
      // right: auto,
      // bottom: auto,
    };
    return {
      date: '日',
      loading: false,
      dataEmpty: false,
      chartSettings: {
        type: this.typeArr[this.index]
      },
      chartData: {
        columns: ['日期', '数据1', '数据2', '数据3'],
        rows: [{
            '日期': '1/1',
            '数据1': 1393,
            '数据2': 1093,
            '数据3': 0.32
          },
          {
            '日期': '1/2',
            '数据1': 3530,
            '数据2': 3230,
            '数据3': 0.26
          },
          {
            '日期': '1/3',
            '数据1': 2923,
            '数据2': 2623,
            '数据3': 0.76
          },
          {
            '日期': '1/4',
            '数据1': 1723,
            '数据2': 1423,
            '数据3': 0.49
          },
          {
            '日期': '1/5',
            '数据1': 3792,
            '数据2': 3492,
            '数据3': 0.323
          },
          {
            '日期': '1/6',
            '数据1': 4593,
            '数据2': 4293,
            '数据3': 0.78
          }
        ]
      }
    }
  },
  created() {
    console.log('chart created')
  },
  mounted() {
    this.setEvent()
  },
  destroyed() {},
  sockets: {},
  methods: {
    setEvent: async function() {
      this.$sockets.emit('DATA_GET_ID', {
        data_id: this.options.id,
      });
      console.log('data_id:' + this.options.id)
      await this.onData();
      await this.getDate();
    },
    getDate: function() {
      let data = this.options.data
      let pram = {
        count: data.count,
        real: data.real,
        refresh: data.refresh,
        interval: data.interval,
        accuracy: data.accuracy,
        rule: data.rule,
        time: {
          startEnd: [data.time[0], data.time[1]]
        },
        data: data.data,
      }
      console.log(pram)
      this.$sockets.emit('DATA_GET_' + this.options.id, pram);
    },
    onData: function() {
      this.$sockets.on('DATA_GET_' + this.options.id).then((data) => {
        console.log(data);
        // if(this.chartData.rows.length>=data.count){}
        // this.chartData.rows
        // this.chartData.columns
      })
    },
    chartResize: function() {
      this.$refs.veLine.nextTickResize()
    },
    chartInit: function() {
      this.$refs.veLine.nextTickResize()
    },
    changeType: function() {
      console.log('更换')
      this.index++
      if (this.index >= this.typeArr.length) {
        this.index = 0
      }
      this.chartSettings = {
        type: this.typeArr[this.index]
      }
    }
  },
  computed: {},
  watch: {},
  components: {},
}
</script>
<style lang="scss" scoped>
.chartView {
    position: relative;
}
</style>
<style lang="scss">
.chartView {
    > div.date {
        display: flex;
        justify-content: space-between;
        padding: 0 15px;
    }

    .ve-bar,
    .ve-chart,
    .ve-histogram,
    .ve-line {
        width: 100% !important;
        height: calc(100% - 52px) !important;
        padding: 15px;
        > div {
            width: 100% !important;
            height: 100% !important;
            > div:first-child {
                width: 100% !important;
                height: 100% !important;
                > canvas {
                    width: 100% !important;
                    height: 100% !important;
                }
            }
        }
        .loading-spinner {
            text-align: center;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
