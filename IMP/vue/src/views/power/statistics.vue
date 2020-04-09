<template>
<div class="view power">
  <header class="routerHeader">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>能源管理</el-breadcrumb-item>
      <el-breadcrumb-item>能源统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-page-header @back="$goRouter.back()" content="能源统计">
    </el-page-header>
  </header>

  <div class="powerContainer">
    <div class="tool">
      <div class="floatLeft">
        <el-select size="small" placeholder="订单选择" v-model="order">
          <el-option v-for="(item, index) in orderList" :label="'订单: '+item" :value="item"></el-option>
        </el-select>
        <el-select size="small" placeholder="产线选择" v-model="line">
          <el-option v-for="(item, index) in lineList" :label="'产线: '+item" :value="item"></el-option>
        </el-select>
      </div>
      <div class="floatRight">
        <el-radio-group v-model="date" size="mini" @change="changeDate">
          <el-radio-button label="Y">年</el-radio-button>
          <el-radio-button label="Q">季</el-radio-button>
          <el-radio-button label="M">月</el-radio-button>
          <el-radio-button label="W">周</el-radio-button>
          <el-radio-button label="D">日</el-radio-button>
        </el-radio-group>
      </div>
      <div class="clr"></div>
    </div>

    <div class="chart">
      <div style="flex:4">
        <div class="title">
          <h5>能耗统计</h5>
        </div>
        <ve-line :data="chartData1" width="100%" :colors="colors" :settings='chartSettings1'></ve-line>
      </div>
      <div class="boxlist" style="flex:1">
        <div class="title">
          <h5>{{date|dateName}}能耗与费用</h5>
        </div>
        <ul>
          <li v-for="(item,index) in lastData" :key="index">
            <h5 :style="'color:'+colors2[index]">{{item.value.toFixed(2)}}</h5>
            <h6>{{item.name}}({{item.unit}})</h6>
          </li>
        </ul>
      </div>
      <i style="width: 100%;"></i>
      <div style="flex: 4">
        <div class="title">
          <h5>费用统计</h5>
        </div>
        <ve-line :data="chartData1" width="100%" :colors="colors" :settings='chartSettings2'></ve-line>
      </div>
      <div style="flex: 1">
        <div class="title">
          <h5>{{date|dateName}}费用占比</h5>
        </div>
        <ve-ring :data="chartData2" width="100%" :colors="colors"></ve-ring>
      </div>
    </div>
    <!-- <div class="chart">
      <div style="flex: 1">
        <div class="title">
          <h5>{{date|dateName}}能耗占比</h5>
        </div>
        <ve-ring :data="chartData2" width="100%" :colors="colors2" :settings='chartSettings2'></ve-ring>
      </div>
    </div> -->
    <div class="tool" style="margin-top:0">
      <div class="floatLeft">
        <el-select size="small" placeholder="订单选择" v-model="order">
          <el-option v-for="(item, index) in orderList" :label="'订单: '+item" :value="item"></el-option>
        </el-select>
        <el-select size="small" placeholder="产线选择" v-model="line">
          <el-option v-for="(item, index) in lineList" :label="'产线: '+item" :value="item"></el-option>
        </el-select>
      </div>
      <div class="floatRight">
        <el-radio-group v-model="date" size="mini" @change="changeDate">
          <el-radio-button label="Y">年</el-radio-button>
          <el-radio-button label="Q">季</el-radio-button>
          <el-radio-button label="M">月</el-radio-button>
          <el-radio-button label="W">周</el-radio-button>
          <el-radio-button label="D">日</el-radio-button>
        </el-radio-group>
      </div>
      <div class="clr"></div>
    </div>
  </div>
</div>
</template>

<script>
import {
  ENERGY_ORDER_LINE,
  ENERGY_STATISTICAL
} from 'api/api'
import {
  GetDataClass
} from './chartData.js'
export default {
  data() {
    this.colors = ['#409EFF', '#E6A23C', '#67C23A',
        '#F56C6C', '#91c7ae', '#749f83',
        '#ca8622', '#bda29a', '#6e7074',
        '#546570', '#c4ccd3'
      ],
      this.colors2 = ['#409EFF', '#409EFF', '#E6A23C',
        '#E6A23C', '#67C23A', '#67C23A',
        '#F56C6C', '#F56C6C'
      ],
      this.chartSettings1 = {
        metrics: ["水(t)", "电(kwh)", "燃气(m^3)"],
      }
    this.chartSettings2 = {
      metrics: ["水费(rmb)", "电费(rmb)", "燃气费(rmb)", "总费用(rmb)"],

    }
    return {
      date: 'D',
      order: '998',
      line: 1,
      orderList: [],
      data: null,
      lastData: null,
      chartData2: {
        columns: [],
        rows: []
      },
      chartData1: {
        columns: [],
        rows: [],
      },
    }
  },
  created() {
    this.getOrder();
  },
  mounted() {
    this.getData();
  },
  destroyed() {},
  methods: {
    getOrder: function() {
      ENERGY_ORDER_LINE().then((data) => {
        console.log(data)
        this.orderList = data.data.res.order;
        this.lineList = data.data.res.line;
      })
    },
    getData: function() {
      ENERGY_STATISTICAL(988, this.date).then((data) => {
        console.log(data)
        this.data = data.data.res;
      }).then(() => {
        this.setChart1();
        this.setChart2();
      })
    },
    setChart1: function() {
      let data = new GetDataClass(this.data);
      let columns = data.getColumns()
      let rows = data.getRows()
      this.chartData1 = {
        'columns': columns,
        'rows': rows
      }
      console.log(columns)
    },

    setChart2: function() {
      let data = new GetDataClass(this.data);
      console.log(data.getlastData())
      let lastData = this.lastData = data.getlastData()
      let columns = ['名称', '值']
      let rows = []
      for (let i of lastData) {
        if (i.name == '水费' || i.name == '电费' || i.name == '燃气费') {
          rows.push({
            '名称': `${i.name}(rmb)`,
            '值': i.value,
          })
        }
      }
      this.chartData2 = {
        'columns': columns,
        'rows': rows
      }
    },
    changeDate: function() {
      ENERGY_STATISTICAL(988, this.date).then((data) => {
        console.log(data)
        this.data = data.data.res;
      }).then(() => {
        this.setChart1();
        this.setChart2();
      })
    },
  },
  filters: {
    dateName: function(value) {
      let dateName
      switch (value) {
        case 'D':
          name = '天';
          break;
        case 'W':
          name = '周';
          break;
        case 'M':
          name = '月';
          break;
        case 'Q':
          name = '季度';
          break;
        case 'Y':
          name = '年';
          break;
      }
      return '当前' + name
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
            padding: 20px;
            background-color: #fff;
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
                height: auto;
                flex-grow: 1;
                flex-shrink: 0;
                min-width: 400px;
                background-color: #f9f9f9;
                margin: 5px;
                padding: 20px;
                > .title {
                    text-align: center;
                    font-size: 14px;
                    color: #999;
                    padding: 10px;
                    margin-bottom: 10px;
                }
                > ul {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                    > li {
                        width: calc(50% - 40px);
                        margin: 0 20px;
                        padding: 20px;
                        text-align: center;
                        border-bottom: 1px solid #ddd;
                        > h5 {
                            font-size: 36px;
                            font-weight: bold;
                        }
                        > h6 {
                            font-size: 13px;
                            font-weight: normal;
                            color: #999;
                        }
                    }
                }
            }
            &.min {
                > div {
                    min-width: 200px;
                }
            }
        }
    }
}
</style>
