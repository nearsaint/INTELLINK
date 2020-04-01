<template>
<div class="chartView">
  <!-- {{options}} -->
  <div class="echart">
    <div class="canvas" :id="CHART_ID">
    </div>
  </div>
</div>
</template>

<script>
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
    return {
      CHART_ID: 'CHART_' + this.options.id,
      chart: '',
    }
  },
  created() {
    console.log('chart created')
  },
  mounted() {
    this.getDate();
  },
  destroyed() {},
  sockets: {},
  methods: {
    chartInit: function() {
      let that = this;
      CHART_INIT(that).then(chart => {
        CHART_SET(chart, {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }]
        })
      })
    },
    chartResize: function() {
      CHART_RESIZE(this.chart);
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
      // for(let i in options.data){
      //
      // }
      DATA_GET_ID(pram).then((data) => {
        console.log(data)
      })
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
    > .echart {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        > .canvas {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
<style lang="scss">
.chartView {
    > .echart {
        > .canvas {
            > div {
                width: 100% !important;
                height: 100% !important;
                > canvas {
                    width: 100% !important;
                    height: 100% !important;
                }
            }
        }
    }
}
</style>
