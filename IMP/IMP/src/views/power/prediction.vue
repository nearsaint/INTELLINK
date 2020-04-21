<template>
<div class="view power">
  <header class="routerHeader">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>能源管理</el-breadcrumb-item>
      <el-breadcrumb-item>能源预测</el-breadcrumb-item>
    </el-breadcrumb>
    <el-page-header @back="$goRouter.back()" content="能源预测">
    </el-page-header>
  </header>

  <div class="powerContainer">
    <div class="tool">
      <div class="floatLeft">
        <el-select size="small" placeholder="产线选择">
          <el-option>全部产线</el-option>
          <el-option>产线1</el-option>
          <el-option>产线2</el-option>
          <el-option>产线3</el-option>
          <el-option>产线6</el-option>
        </el-select>
      </div>
      <div class="clr"></div>
    </div>

    <div class="chart">
      <div style="flex: 3">
        <div class="title">
          <h5>能耗费用预测</h5>
        </div>
        <ve-histogram :data="chartData" width="100%" :colors="colors" :settings='chartSettings'></ve-histogram>
      </div>
      <div style="flex: 1">
        <div class="title">
          <h5>能耗费用预测雷达图</h5>
        </div>
        <ve-radar :data="chartData3" width="100%" :colors="colors2"></ve-radar>
      </div>
    </div>

    <div class="chart min">
      <div style="flex: 1">
        <div class="title">
          <h5>每天水电气能耗</h5>
        </div>
        <ve-line :data="chartData3" width="100%" :colors="colors" :settings='chartSettings'></ve-line>
      </div>
      <div style="flex: 1">
        <div class="title">
          <h5>平均每小时耗电量</h5>
        </div>
        <ve-line :data="chartData2" width="100%" :colors="colors" :settings='chartSettings'></ve-line>
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
      showLine: ['总费用']
    }
    return {
      date: '',
      chartData2: {
        columns: ['日期', '电费(K/WH)'],
        rows: [{
            '日期': '0',
            '电费(K/WH)': 1313,
          },
          {
            '日期': '1',
            '电费(K/WH)': 1093,
          }, {
            '日期': '2',
            '电费(K/WH)': 593,
          },
          {
            '日期': '3',
            '电费(K/WH)': 693,
          },
          {
            '日期': '4',
            '电费(K/WH)': 893,
          },
          {
            '日期': '5',
            '电费(K/WH)': 1893,
          },
          {
            '日期': '6',
            '电费(K/WH)': 1313,
          },
          {
            '日期': '7',
            '电费(K/WH)': 1093,
          }, {
            '日期': '8',
            '电费(K/WH)': 593,
          },
          {
            '日期': '9',
            '电费(K/WH)': 693,
          },
          {
            '日期': '10',
            '电费(K/WH)': 893,
          },
          {
            '日期': '11',
            '电费(K/WH)': 1893,
          },
          {
            '日期': '12',
            '电费(K/WH)': 1313,
          },
          {
            '日期': '13',
            '电费(K/WH)': 1093,
          }, {
            '日期': '14',
            '电费(K/WH)': 593,
          },
          {
            '日期': '15',
            '电费(K/WH)': 693,
          },
          {
            '日期': '16',
            '电费(K/WH)': 893,
          },
          {
            '日期': '17',
            '电费(K/WH)': 1893,
          },
          {
            '日期': '18',
            '电费(K/WH)': 1313,
          },
          {
            '日期': '19',
            '电费(K/WH)': 1093,
          }, {
            '日期': '20',
            '电费(K/WH)': 593,
          },
          {
            '日期': '21',
            '电费(K/WH)': 693,
          },
          {
            '日期': '22',
            '电费(K/WH)': 893,
          },
          {
            '日期': '23',
            '电费(K/WH)': 1893,
          }
        ],
      },
      chartData: {
        columns: ['日期', '水费(RMB)', '电费(RMB)', '燃气费(RMB)', '总费用', ],
        rows: [{
            '日期': '周一',
            '水费(RMB)': 493,
            '电费(RMB)': 593,
            '燃气费(RMB)': 110.32,
            '总费用': 40,
          },
          {
            '日期': '周二',
            '水费(RMB)': 493,
            '电费(RMB)': 693,
            '燃气费(RMB)': 240.32,
            '总费用': 1330.32,
          },
          {
            '日期': '周三',
            '水费(RMB)': 793,
            '电费(RMB)': 893,
            '燃气费(RMB)': 570.32,
            '总费用': 2140.32,
          },
          {
            '日期': '周四',
            '水费(RMB)': 1093,
            '电费(RMB)': 1893,
            '燃气费(RMB)': 540.32,
            '总费用': 3540.32,
          },
          {
            '日期': '周五',
            '水费(RMB)': 1313,
            '电费(RMB)': 1293,
            '燃气费(RMB)': 230.32,
            '总费用': 2850.32,
          },
          {
            '日期': '周六',
            '水费(RMB)': 1393,
            '电费(RMB)': 1093,
            '燃气费(RMB)': 240.32,
            '总费用': 2780.32,
          },
          {
            '日期': '周日',
            '水费(RMB)': 1293,
            '电费(RMB)': 1493,
            '燃气费(RMB)': 1240.32,
            '总费用': 2280.32,
          },
        ],
      },
      chartData3: {
        columns: ['日期', '水费(RMB)', '电费(RMB)', '燃气费(RMB)'],
        rows: [{
            '日期': '周一',
            '水费(RMB)': 493,
            '电费(RMB)': 593,
            '燃气费(RMB)': 110.32,
          },
          {
            '日期': '周二',
            '水费(RMB)': 493,
            '电费(RMB)': 693,
            '燃气费(RMB)': 240.32,
          },
          {
            '日期': '周三',
            '水费(RMB)': 793,
            '电费(RMB)': 893,
            '燃气费(RMB)': 570.32,
          },
          {
            '日期': '周四',
            '水费(RMB)': 1093,
            '电费(RMB)': 1893,
            '燃气费(RMB)': 540.32,
          },
          {
            '日期': '周五',
            '水费(RMB)': 1313,
            '电费(RMB)': 1293,
            '燃气费(RMB)': 230.32,
          },
          {
            '日期': '周六',
            '水费(RMB)': 1393,
            '电费(RMB)': 1093,
            '燃气费(RMB)': 240.32,
          },
        ],
      }
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
            margin-bottom: 10px;
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
        }
    }
}
</style>
