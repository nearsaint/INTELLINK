<template>
<div>
  <div class="search">
    <div class="title"> 能源站综合数据分析报表</div>
    <!-- <div slot="extra"><a></a></div> -->
    <div class="content">
      <div class="block">
        <span class="demonstration">时间</span>
        <el-date-picker v-model="time" type="date" placeholder="选择日期" :type="timeType">
        </el-date-picker>
      </div>
      <div class="block">
        <span class="demonstration">查看方式</span>
        <el-select v-model="type" placeholder="请选择" @change="typeChange">
          <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="block">
        <el-button type="primary" icon="el-icon-search" @click="searchPower">查询</el-button>
      </div>
      <div class="export">
        <el-button type="success" icon="el-icon-document" @click="exportPower">导出报表</el-button>
      </div>
    </div>
  </div>

  <div class="table">
    <el-table class="" :data="powers" stripe style="width: 100%">
      <el-table-column prop="Time" label="时间" width=200>
      </el-table-column>
      <el-table-column prop="AvgFlow" label="平均供气流量(m³/min)" width=200>
      </el-table-column>
      <el-table-column prop="TotalFlow" label="流量计累积(m³)" width=200>
      </el-table-column>
      <el-table-column prop="AvgFlow2" label="平均供氮气流量(m³/h)" width=200>
      </el-table-column>
      <el-table-column prop="TotalFlow2" label="流量计累积(m³)" width=200>
      </el-table-column>
      <el-table-column prop="AvgFlow1" label="平均供制氮机气量(m³/min)" width=200>
      </el-table-column>
      <el-table-column prop="TotalFlow1" label="流量计累积(m³)" width=200>
      </el-table-column>
      <el-table-column prop="AvgPower" label="平均功率(KW)" width=200>
      </el-table-column>
      <el-table-column prop="TotalPower" label="电表累积(KWH)" width=200>
      </el-table-column>
      <el-table-column prop="GNRatio" label="气氮比" width=200>
      </el-table-column>
      <el-table-column prop="Consump" label="单耗(KWH/m³)" width=200>
      </el-table-column>
    </el-table>
  </div>
  <!-- <div class="search">
    <div class="">sousuo</div>
    <div class="">sousuo</div>
  </div> -->
  <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
    <span>文件已生成,单击进行下载.</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="downloadPower">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      time: '',
      types: [{
        value: 0,
        label: '按日'
      }, {
        value: 1,
        label: '按月'
      }],
      type: '按日',
      powers: [],
      dialogVisible: false,
      filepath: '',
      timeType: 'date'
    }
  },
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    searchPower: function() {
      let that = this;
      // let powerInput;
      // powerInput.PowerReportType=type;
      // powerInput.Time=time;
      console.log("type:" + that.type);
      console.log("time:" + that.time);
      that.axios.post('/api/Machine/GetPowerReport', {
          PowerReportType: that.type,
          Time: that.time
        })
        .then(function(res) {
          console.log(res);
          that.powers = res.data;
          // console.log(that.$store.state.iot.data.Machines);
          // for (let i in res.data) {

          // }
        }).catch(res => {
          console.log(res);
          that.$Message.error(res.statusText)
        });
    },
    exportPower: function() {
      let that = this;
      that.axios.post('/api/Machine/ExportAlarmHty', {
          PowerReportType: that.type,
          Time: that.time
        })
        .then(function(res) {
          console.log(res);
          that.filepath = res.data.Data;
          that.dialogVisible = true;
        }).catch(res => {
          console.log(res);
          that.$Message.error(res.statusText)
        });
    },
    downloadPower: function() {
      console.log(111);
      window.location.href = this.filepath;
    },
    typeChange: function() {
      let that = this;
      console.log(that.type);
      if (that.type == '1')
        that.timeType = 'month';
      else if (that.type == '0')
        that.timeType = 'date';
    }
  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.search {
    position: relative;
    display: inline-block;
    flex: wrap;
    .title {
        margin: 20px 20px 10px;
        font-weight: bold;
        font-size: 20px;
    }
    .content {
        display: flex;
        flex: wrap;
        .block {
            margin: 10px;
            .demonstration {
                margin: 10px 20px;
                font-size: 15px;
            }
        }
        .export {
            margin-top: 10px;
            margin-left: 300px;
        }
    }
}
.table {
    margin: 20px 20px 10px;
    padding-bottom: 20px;
}
.tableContainer {
    display: flex;
}
</style>
