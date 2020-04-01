<template>
<div class="view deviceLedger">
  <header class="routerHeader">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
      <el-breadcrumb-item>设备台账</el-breadcrumb-item>
    </el-breadcrumb>
    <el-page-header @back="$goRouter.back()" content="设备台账">
    </el-page-header>
  </header>

  <div class="tableContainer">
    <ul class="chart">
      <li>
        <h3>10</h3>
        <h6>设备总数</h6>
      </li>
      <li style="color: #67C23A">
        <h3>8</h3>
        <h6>正常状态</h6>
      </li>
      <li style="color: #E6A23C">
        <h3>0</h3>
        <h6>报警状态</h6>
      </li>
      <li style="color: #F56C6C">
        <h3>2</h3>
        <h6>停机状态</h6>
      </li>
    </ul>
    <div class="tool">
      <div class="floatLeft">
        <el-select size="small" placeholder="产线选择">
          <el-option>全部产线</el-option>
          <el-option>1产线</el-option>
          <el-option>2产线</el-option>
          <el-option>3产线</el-option>
        </el-select>
        <el-select size="small" placeholder="状态筛选">
          <el-option>全部状态</el-option>
        </el-select>
        <el-select size="small" placeholder="类型筛选">
          <el-option>全部类型</el-option>
        </el-select>
      </div>
      <div class="floatRight">
        <el-input size="small" placeholder="请输入设备名" suffix-icon="el-icon-search">
        </el-input>
        <el-button type="primary" size="small">上传 Excel</el-button>
      </div>
      <div class="clr">

      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" stripe border height="500">
      <el-table-column fixed prop="index" label="序号" width="60">
      </el-table-column>
      <el-table-column fixed prop="name" label="名称" width="200">
      </el-table-column>
      <el-table-column prop="id" label="系统编号" width="200">
      </el-table-column>
      <el-table-column prop="id" label="规格型号" width="200">
      </el-table-column>
      <el-table-column prop="zip" label="厂家" width="300">
      </el-table-column>
      <el-table-column prop="city" label="数量" width="80">
      </el-table-column>
      <el-table-column prop="date" label="购进日期" width="200">
      </el-table-column>
      <el-table-column prop="date" label="启用日期" width="200">
      </el-table-column>
      <el-table-column prop="user" label="使用部门" width="200">
      </el-table-column>
      <el-table-column prop="state" label="状态" width="100" :filters="[{ text: '正常', value: '正常' },{ text: '报警', value: '报警' },{ text: '停机', value: '停机' }]" :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state === '正常' ? 'success' : 'warning'" disable-transitions>{{scope.row.state}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="安装地点" width="200">
      </el-table-column>
      <el-table-column prop="mark" label="备注" width="400">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <!-- <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template> -->
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit()" type="primary">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="tool">

      <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000">
      </el-pagination>
    </div>
  </div>
  <el-drawer title="编辑设备信息" :visible.sync="drawer" :with-header="false">
    <div class="con">
      <ul class="el-drawer-ul">
        <h5>设备基础信息</h5>
        <li>
          <span>序号</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" disabled value="1"></el-input>
          </div>
        </li>
        <li>
          <span>ID</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" disabled value="xd872-2928"></el-input>
          </div>
        </li>
        <li>
          <span>状态</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" disabled value="正常"></el-input>
          </div>
        </li>
        <li>
          <span>类型</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" disabled value="主设备"></el-input>
          </div>
        </li>
      </ul>
      <ul class="el-drawer-ul">
        <h5>采购信息</h5>
        <li>
          <span>厂家</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" value="广东东莞飞扬"></el-input>
          </div>
        </li>
        <li>
          <span>采购日期</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" value="2016-02-16"></el-input>
          </div>
        </li>
      </ul>
      <ul class="el-drawer-ul">
        <h5>保养信息</h5>
        <li>
          <span>保养厂家</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" value="广东东莞飞扬"></el-input>
          </div>
        </li>
        <li>
          <span>保养周期</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" value="32"></el-input>
          </div>
        </li>
        <li>
          <span>初始偏差</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" value="32"></el-input>
          </div>
        </li>
      </ul>
      <ul class="el-drawer-ul">
        <h5>设备参数</h5>
        <li>
          <span>电源功率</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" value="50W"></el-input>
          </div>
        </li>
        <li>
          <span>待机功率</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" value="≤0.50W"></el-input>
          </div>
        </li>
        <li>
          <span>工作电压</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" value="220v"></el-input>
          </div>
        </li>
        <li>
          <span>重量</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" value="35.3kg"></el-input>
          </div>
        </li>
        <li>
          <span>长宽高</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" value="1723.2mm*2463.1mm*2165.8mm"></el-input>
          </div>
        </li>
      </ul>
      <ul class="el-drawer-ul">
        <h5>其他信息</h5>
        <li>
          <span>备注</span>
          <div>
            <el-input type="textarea" :rows="6" placeholder="请输入内容">
            </el-input>
          </div>
        </li>
      </ul>
      <div class="btn-container">
        <el-button size="small">关闭</el-button>
        <el-button size="small" type="primary">提交</el-button>
      </div>
    </div>
  </el-drawer>
</div>
</template>

<script>
import {
  DASHBOARD_CONTAINER_LIST
} from 'api/api'
export default {
  data() {
    return {
      drawer: false,
      tableData: [{
        index: 1,
        id: 'xd872-2928',
        date: '2016-05-02',
        name: '空压机',
        type: '主设备',
        city: '32',
        state: '正常',
        stateLight: 1,
        zip: '广东东莞飞扬',
        mark: '该设备为重点设备,2号轴轮异常!',
      }, {
        index: 1,
        id: 'xd872-2928',
        date: '2016-05-02',
        name: '空压机',
        type: '主设备',
        city: '32',
        state: '停机',
        stateLight: 1,
        zip: '广东东莞飞扬',
        mark: '该设备为重点设备,2号轴轮异常!',
      }, {
        index: 1,
        id: 'xd872-2928',
        date: '2016-05-02',
        name: '空压机',
        type: '主设备',
        city: '32',
        state: '停机',
        stateLight: 1,
        zip: '广东东莞飞扬',
        mark: '该设备为重点设备,2号轴轮异常!',
      }, {
        index: 1,
        id: 'xd872-2928',
        date: '2016-05-02',
        name: '空压机',
        type: '主设备',
        city: '32',
        state: '正常',
        stateLight: 1,
        zip: '广东东莞飞扬',
        mark: '该设备为重点设备,2号轴轮异常!',
      }, {
        index: 1,
        id: 'xd872-2928',
        date: '2016-05-02',
        name: '空压机',
        type: '主设备',
        city: '32',
        state: '正常',
        stateLight: 1,
        zip: '广东东莞飞扬',
        mark: '该设备为重点设备,2号轴轮异常!',
      }, {
        index: 1,
        id: 'xd872-2928',
        date: '2016-05-02',
        name: '空压机',
        type: '主设备',
        city: '32',
        state: '正常',
        stateLight: 1,
        zip: '广东东莞飞扬',
        mark: '该设备为重点设备,2号轴轮异常!',
      }, {
        index: 1,
        id: 'xd872-2928',
        date: '2016-05-02',
        name: '空压机',
        type: '主设备',
        city: '32',
        state: '正常',
        stateLight: 1,
        zip: '广东东莞飞扬',
        mark: '该设备为重点设备,2号轴轮异常!',
      }, {
        index: 1,
        id: 'xd872-2928',
        date: '2016-05-02',
        name: '空压机',
        type: '主设备',
        city: '32',
        state: '正常',
        stateLight: 1,
        zip: '广东东莞飞扬',
        mark: '该设备为重点设备,2号轴轮异常!',
      }, {
        index: 1,
        id: 'xd872-2928',
        date: '2016-05-02',
        name: '空压机',
        type: '主设备',
        city: '32',
        state: '正常',
        stateLight: 1,
        zip: '广东东莞飞扬',
        mark: '该设备为重点设备,2号轴轮异常!',
      }, {
        index: 1,
        id: 'xd872-2928',
        date: '2016-05-02',
        name: '空压机',
        type: '主设备',
        city: '32',
        state: '正常',
        stateLight: 1,
        zip: '广东东莞飞扬',
        mark: '该设备为重点设备,2号轴轮异常!',
      }]
    }
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    handleEdit: function() {
      this.drawer = true
    },
    filterTag(value, row) {
      return row.state === value;
    },
  },
  computed: {},
  watch: {},
  components: {},
}
</script>
<style lang="scss" scoped>
.deviceLedger {
    padding: 10px;
    > .tableContainer {
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
            background-color: #fff;
            padding: 10px 0;
            > li {
                margin: 0;
                padding: 0 40px;
                text-align: center;
                border-right: 1px solid #eee;
                > h3 {
                    font-size: 32px;
                }
                > h6 {
                    font-size: 12px;
                    font-weight: 200;
                    color: #999;
                }
            }
        }
    }
}
.con {
    height: calc(100vh - 52px);
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 10px 20px;
    .btn-container {
        height: 52px;
        padding: 10px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        border-top: 1px solid #ddd;
        text-align: right;
    }
    .el-drawer-ul {
        > h5 {
            font-size: 13px;
            color: #ccc;
            margin-bottom: 10px;
        }
        > li {
            display: flex;
            background-color: #eee;
            justify-content: flex-end;
            margin: 5px 0;
            // height: 40px;
            padding: 2px;
            width: 100%;
            border-radius: 5px;
            color: #444;
            > span {
                width: auto;
                line-height: 36px;
                padding: 0 20px;
                font-size: 13px;
                text-align: center;
                display: block;
                flex-grow: 1;
            }
            > div {
                flex-grow: 0;
                flex-shrink: 0;
                width: 60%;
                > * {
                    width: 100%;
                }
            }
        }
    }
}
</style>
