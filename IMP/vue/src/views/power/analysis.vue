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
        <el-select size="small" placeholder="全部产线">
          <el-option>全部产线</el-option>
          <el-option>产线1</el-option>
          <el-option>产线2</el-option>
          <el-option>产线3</el-option>
          <el-option>产线6</el-option>
        </el-select>
        <el-select size="small" placeholder="产品选择">
          <el-option>
            <span style="float: left">产品1</span>
          </el-option>
          <el-option>
            <span style="float: left">产品2</span>
          </el-option>
          <el-option>
            <span style="float: left">产品3</span>
          </el-option>
          <el-option>
            <span style="float: left">产品4</span>
          </el-option>
        </el-select>
        <el-select size="small" placeholder="班组选择">
          <el-option>
            <span style="float: left">班组1</span>
          </el-option>
          <el-option>
            <span style="float: left">班组2</span>
          </el-option>
          <el-option>
            <span style="float: left">班组3</span>
          </el-option>
          <el-option>
            <span style="float: left">班组4</span>
          </el-option>
        </el-select>
        <el-select size="small" placeholder="设备选择">
          <el-option>
            <span style="float: left">设备1</span>
          </el-option>
          <el-option>
            <span style="float: left">设备2</span>
          </el-option>
          <el-option>
            <span style="float: left">设备3</span>
          </el-option>
          <el-option>
            <span style="float: left">设备4</span>
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
        <ve-bar :data="chartData" width="100%" :colors="colors" :settings='chartSettings'></ve-bar>
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
    return {
      date: '',
      chartData: {
        columns: ['名称', '电能耗(KW/H)'],
        rows: [{
            '名称': '产线1',
            '电能耗(KW/H)': 593,
          },
          {
            '名称': '产线2',
            '电能耗(KW/H)': 693,
          },
          {
            '名称': '产线3',
            '电能耗(KW/H)': 893,
          },
          {
            '名称': '产线4',
            '电能耗(KW/H)': 1893,
          },
          {
            '名称': '产线5',
            '电能耗(KW/H)': 2293,
          },
          {
            '名称': '产线6',
            '电能耗(KW/H)': 3093,
          },
        ],
      },

    }
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {},
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
            margin: 10px 0;
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
