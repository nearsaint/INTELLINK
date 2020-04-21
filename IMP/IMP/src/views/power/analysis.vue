<template>
<div class="view power">
  <header class="routerHeader">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>能源管理</el-breadcrumb-item>
      <el-breadcrumb-item>能源分析</el-breadcrumb-item>
    </el-breadcrumb>
    <el-page-header @back="$goRouter.back()" content="能源分析">
    </el-page-header>
  </header>

  <div class="powerContainer">
    <div class="tool">
      <div class="floatLeft">
        <el-select size="small" placeholder="全部产线" v-model="area" @change="getData">
          <el-option v-for="(item,index) in areaList" :label="item.name" :value="item.number_id"></el-option>
        </el-select>
        <el-select size="small" placeholder="种类筛选" v-model="project" @change="getData">
          <el-option v-for="(item,index) in projectList" :label="item.name" :value="item.number_id">
          </el-option>
        </el-select>
      </div>
      <div class="clr"></div>
    </div>

    <div class="chart">
      <div style="flex: 3">
        <div class="title">
          <h5>排名</h5>
        </div>
        <ve-bar :data="chartData" width="100%" :colors="colors" :settings='chartSettings' :data-zoom="dataZoom" :mark-line="markLine"></ve-bar>
      </div>
      <div style="flex: 1">
        <div class="title">
          <h5>占比</h5>
        </div>
        <ve-pie :data="chartData" width="100%" :colors="colors2"></ve-pie>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import {
  ENERGY_AREA_PROJECT,
  ENERGY_ANALYSIS
} from 'api/api'
import {
  DataAnalysis
} from './chartData.js'
export default {
  data() {
    this.colors = ['#409EFF', '#E6A23C', '#67C23A',
      '#F56C6C', '#91c7ae', '#749f83',
      '#ca8622', '#bda29a', '#6e7074',
      '#546570', '#c4ccd3'
    ], this.colors2 = ['#c23531', '#2f4554', '#61a0a8',
      '#d48265', '#91c7ae', '#749f83',
      '#ca8622', '#bda29a', '#6e7074',
      '#546570', '#c4ccd3'
    ]
    this.chartSettings = {
      stack: {
        '耗能': ['水费用', '电费用', '燃气费用']
      },
      showLine: ['总费用曲线']
    }
    this.dataZoom = [{
      type: 'slider',
      start: 0,
      end: 50,
      yAxisIndex: 0,
    }]
    this.markLine = {
      data: [{
        name: '平均线',
        type: 'average'
      }]
    }
    return {
      data: '',
      area: '1',
      areaList: [],
      project: "line",
      projectList: [],
      chartData: {
        columns: [],
        rows: [],
      },

    }
  },
  created() {
    this.getProject();
  },
  mounted() {
    this.getData();
  },
  destroyed() {},
  methods: {
    getProject: function() {
      ENERGY_AREA_PROJECT().then((data) => {
        this.areaList = data.data.res.area;
        this.projectList = data.data.res.project;
      })
    },
    getData: function() {
      ENERGY_ANALYSIS(this.arte, this.project).then((data) => {
        this.data = data.data.res
        console.log(data)
      }).then(() => {
        this.setChart();
      })
    },
    setChart: function() {
      let data = new DataAnalysis(this.data);
      let columns = data.getColumns(this.project)
      let rows = data.getRows(this.project)
      this.dataZoom[0].end = data.getZoom();
      this.chartData = {
        'columns': columns,
        'rows': rows
      }
    },
    projectChange: function() {
      setChart
    }
  },
  computed: {},
  watch: {},
  components: {},
}
</script>
<style lang="scss" scoped>
.power {
    padding: 10px;
    > .powerContainer {
        > .tool {
            padding: 10px;
            background-color: #fff;
            margin: 10px 0 0;
            > div {
                display: flex;
                > * {
                    margin: 0 3px;
                }
            }
        }
        > .chart {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            flex-grow: 1;
            background-color: #fff;
            padding: 10px;
            > div {
                height: 400px;
                flex-grow: 1;
                flex-shrink: 0;
                min-width: 500px;
                > .title {
                    text-align: center;
                    font-size: 14px;
                    color: #999;
                    padding: 10px;
                    margin-bottom: 10px;
                }
            }
            &.min {

                > div {
                    min-width: 200px;
                }
            }
        }
        > .btn {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            flex-grow: 1;
            background-color: #fff;
            padding: 10px;
            margin-bottom: 10px;
        }
    }
}
</style>
