<template>
<div class="view deviceLedger">
  <header class="routerHeader">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
      <el-breadcrumb-item>备件管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-page-header @back="$goRouter.back()" content="备件管理">
    </el-page-header>
  </header>

  <div class="tableContainer">
    <ul class="chart">
      <li>
        <h3>{{total}}</h3>
        <h6>备件总数</h6>
      </li>
      <!-- <li style="color: #67C23A">
        <h3>10</h3>
        <h6>正常</h6>
      </li>
      <li style="color: #F56C6C">
        <h3>0</h3>
        <h6>过期</h6>
      </li> -->
    </ul>
    <!-- <div class="tool">
      <div class="floatLeft">
        <el-select size="small" placeholder="状态筛选">
          <el-option>全部状态</el-option>
          <el-option>正常</el-option>
          <el-option>过期</el-option>
        </el-select>
        <el-select size="small" placeholder="类型筛选">
          <el-option>全部设备类型</el-option>
        </el-select>
      </div>
      <div class="floatRight">
        <el-input size="small" placeholder="请输入备件明" suffix-icon="el-icon-search">
        </el-input>
        <el-upload class="upload-demo" action="http://192.168.0.97:5000/book/UPLOAD_FILE">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <div class="clr">

      </div>
    </div> -->
    <el-table :data="tableData" style="width: 100%" stripe border height="500">
      <el-table-column fixed prop="system" label="系统名称" width="200">
      </el-table-column>
      <el-table-column fixed prop="parts_id" label="ID" width="100">
      </el-table-column>
      <el-table-column prop="system_id" label="系统编号" width="300">
      </el-table-column>
      <el-table-column prop="parameters" label="规格型号" width="300">
      </el-table-column>
      <el-table-column prop="factory" label="制造厂家" width="300">
      </el-table-column>
      <el-table-column prop="stock" label="现有备件存量" width="200">
      </el-table-column>
      <el-table-column prop="number" label="数量" width="200">
      </el-table-column>
      <el-table-column prop="purchase" label="采购日期" width="300">
      </el-table-column>
      <el-table-column prop="running_date" label="使用时间" width="300">
      </el-table-column>
      <el-table-column prop="change_circle_date" label="更换周期" width="300">
      </el-table-column>
      <el-table-column prop="next_replace_date" label="下次预计更换" width="300">
      </el-table-column>
      <el-table-column prop="statistics_date" label="历次时间统计" width="300">
      </el-table-column>
      <el-table-column prop="time_warning" label="时间预警" width="300">
      </el-table-column>
      <el-table-column prop="classify" label="备件分类" width="300">
      </el-table-column>
      <el-table-column prop="address" label="安装地点" width="300">
      </el-table-column>
      <el-table-column prop="mobile" label="联系方式" width="300">
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

      <el-pagination :page-size="10" :pager-count="10" :current-page="page" @current-change="pageChange" layout="prev, pager, next" :total="total">
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
            <el-input size="medium" placeholder="请输入内容" disabled value="电"></el-input>
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
      </ul>
      <ul class="el-drawer-ul">
        <h5>更换时间信息</h5>
        <li>
          <span>更换日期</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" value="2020年3月12日"></el-input>
          </div>
        </li>
        <li>
          <span>有效时长</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" value="327"></el-input>
          </div>
        </li>
        <li>
          <span>最后期限</span>
          <div>
            <el-input size="medium" placeholder="请输入内容" value="2020年5月20日"></el-input>
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
  DEVICE_PARTS
} from 'api/api'
export default {
  data() {
    return {
      drawer: false,
      page: 1,
      total: 0,
      tableData: []
    }
  },
  created() {},
  mounted() {
    this.getList();
  },
  destroyed() {},
  methods: {
    handleEdit: function() {
      this.drawer = true
    },
    filterTag(value, row) {
      return row.state === value;
    },
    pageChange: function(e) {
      this.page = e;
      this.getList();
    },
    getList: function() {
      DEVICE_PARTS(this.page).then((data) => {
        console.log(data)
        this.tableData = data.data.data.parts;
        this.total = data.data.data.total_page;
      })
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
