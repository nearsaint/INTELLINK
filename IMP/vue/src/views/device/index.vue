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
        <h3>{{total}}</h3>
        <h6>设备总数</h6>
      </li>
      <li style="color: #67C23A">
        <h3>54</h3>
        <h6>在用状态</h6>
      </li>
      <li style="color: #E6A23C">
        <h3>{{tableData | getWarning}}</h3>
        <h6>暂停状态</h6>
      </li>
      <li style="color: #F56C6C">
        <h3>{{tableData | getDanger}}</h3>
        <h6>故障状态</h6>
      </li>
    </ul>
    <div class="tool">
      <div class="floatLeft">
        <!-- <el-select size="small" placeholder="产线选择" disabled >
          <el-option>全部产线</el-option>
          <el-option>1产线</el-option>
          <el-option>2产线</el-option>
          <el-option>3产线</el-option>
        </el-select> -->
        <el-select size="small" placeholder="状态筛选" v-model="state" @change="getList">
          <el-option value="" label="全部状态"></el-option>
          <el-option value="在用" label="在用"></el-option>
          <el-option value="暂停" label="暂停"></el-option>
          <el-option value="故障" label="故障"></el-option>
        </el-select>
      </div>
      <div class="floatRight">
        <!-- <el-input size="small" placeholder="请输入设备名" suffix-icon="el-icon-search">
        </el-input> -->
        <el-button type="primary" size="small">上传 Excel</el-button>
      </div>
      <div class="clr">

      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" stripe border height="500">
      <el-table-column fixed type="expand" width="60">
        <template slot-scope="system">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="备件1">
              <span>1</span>
            </el-form-item>
            <el-form-item label="备件2">
              <span>2</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column fixed prop="system" label="系统名称" width="200">
      </el-table-column>
      <el-table-column prop="system_id" label="系统编号" width="200">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : scope.row.status === '故障' ? 'danger' :'warning'" disable-transitions>在用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="specification" label="规格型号" width="200">
      </el-table-column>
      <el-table-column prop="factory" label="制造厂商" width="300">
      </el-table-column>
      <el-table-column prop="amount" label="数量" width="80">
      </el-table-column>
      <el-table-column prop="purchase_date" label="购进日期" width="200">
      </el-table-column>
      <el-table-column prop="start_date" label="启用日期" width="200">
      </el-table-column>
      <el-table-column prop="department" label="使用部门" width="200">
      </el-table-column>

      <el-table-column prop="address" label="安装地点" width="200">
      </el-table-column>
      <el-table-column prop="comment" label="备注" width="400">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <!-- <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template> -->
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index)" type="primary">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="tool">
      <el-pagination :page-size="10" :pager-count="10" :current-page="page" @current-change="pageChange" layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
  <el-drawer title="编辑设备信息" :visible.sync="drawer" :with-header="false">
    <div class="con">
      <ul class="el-drawer-ul">
        <h5>设备基础信息</h5>
        <li>
          <span>系统名称</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" disabled v-model="edit.system"></el-input>
          </div>
        </li>
        <li>
          <span>系统编号</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" disabled v-model="edit.system_id"></el-input>
          </div>
        </li>
        <li>
          <span>状态</span>
          <div>
            <el-select v-model="edit.status" placeholder="请选择">
              <el-option label="在用" value="在用">
              </el-option>
              <el-option label="暂停" value="暂停">
              </el-option>
              <el-option label="故障" value="故障">
              </el-option>
            </el-select>
          </div>
        </li>
        <li>
          <span>规格型号</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" disabled v-model="edit.specification"></el-input>
          </div>
        </li>
      </ul>
      <ul class="el-drawer-ul">
        <h5>采购信息</h5>
        <li>
          <span>制造厂家</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" disabled v-model="edit.factory"></el-input>
          </div>
        </li>
        <li>
          <span>购进日期</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" disabled v-model="edit.purchase_date"></el-input>
          </div>
        </li>
        <li>
          <span>数量</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" disabled v-model="edit.amount"></el-input>
          </div>
        </li>
      </ul>
      <ul class="el-drawer-ul">
        <h5>使用信息</h5>
        <li>
          <span>使用部门</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" disabled v-model="edit.department"></el-input>
          </div>
        </li>
        <li>
          <span>安装地点</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" disabled v-model="edit.address"></el-input>
          </div>
        </li>
        <li>
          <span>启用日期</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" disabled v-model="edit.start_date"></el-input>
          </div>
        </li>
      </ul>

      <ul class="el-drawer-ul">
        <h5>其他信息</h5>
        <li>
          <span>备注</span>
          <div>
            <el-input type="textarea" disabled :rows="6" placeholder="请输入内容">
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
  DEVICE_EQUIPMENTS
} from 'api/api'
export default {
  data() {
    return {
      drawer: false,
      page: 1,
      total: 0,
      state: '',
      tableData: [],
      edit: {
        index: 0,
        address: '',
        amount: '',
        comment: '',
        department: '',
        equipment_id: '',
        factory: '',
        purchase_date: '',
        specification: '',
        start_date: '',
        status: '',
        system: '',
        system_id: '',
      },
    }
  },
  created() {},
  mounted() {
    this.getList();
  },
  destroyed() {},
  methods: {
    handleEdit: function(index) {
      this.drawer = true
      console.log(this.tableData[index]);
      for (let i in this.tableData[index]) {
        this.edit[i] = this.tableData[index][i]
      }
      this.edit.index = index;
      console.log(this.edit)
    },
    pageChange: function(e) {
      this.page = e;
      this.getList();
    },
    getList: function() {
      this.tableData = [];
      DEVICE_EQUIPMENTS(this.state, this.page).then((data) => {
        console.log(data)
        console.log(this.tableData)
        this.tableData = data.data.equs_li;
        this.total = data.data.total_num
      })
    },
  },
  filters: {
    getSuccess: function(data) {
      let n = 0;
      for (let i of data) {
        if (i.status === '在用') {
          n++;
        }
      }
      return n
    },
    getWarning: function(data) {
      let n = 0;
      for (let i of data) {
        if (i.status === '暂停') {
          n++;
        }
      }
      return n
    },
    getDanger: function(data) {
      let n = 0;
      for (let i of data) {
        if (i.status === '故障') {
          n++;
        }
      }
      return n
    }
  },
  computed: {},
  watch: {},
  components: {},
}
</script>
<style >
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
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
