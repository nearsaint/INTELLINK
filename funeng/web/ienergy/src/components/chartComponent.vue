<template>
<div class="chart">
  <!-- {{property}} -->
  <div class="DBcontainer">
    <div class="chart canvas" :id="'myChart'+property.TagId" ref="lineChart">
    </div>
  </div>
  <div class="text">
    <h4>{{property.TagName}}</h4>
    <h4>{{property.FValue}}</h4>
  </div>
</div>
</template>

<script>
export default {
  props: ['query'],
  data() {
    return {
      property: {},
      echart: '',
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.get_data_query();
  },
  mounted: function() {
    this.createChart();
  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    get_data_query: function() {
      this.property = this.query;
      console.log(this.property);
    },
    createChart: function() {
      let that = this;
      this.echart = this.$echarts.init(document.getElementById('myChart' + that.property.TagId));
      that.echart.setOption({
        xAxis: {
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: [1, 2, 3, 4],

        },
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross',
          }
        },
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        },
        yAxis: {
          boundaryGap: ['20%', '20%'],
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          scale: true,
        },
        series: [{
          data: [1, 2, 3, 4, 5],
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#fff'
          },
          itemStyle: {
            borderWidth: '4',
            borderColor: '#fff'
          },
        }]
      });
    },
  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.DBcontainer {
    width: 95%;
    height: 160px;
    margin: -10px auto 0;
    position: relative;
    // background-image: url("../assets/images/bg_db.png");
    overflow: hidden;
    border-radius: 5px;
    background-repeat: repeat;
    background-position: center;
    background-color: rgba(97,144,234,1);
}
.text {
    padding: 10px;
    // background: #fff;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
}
</style>
