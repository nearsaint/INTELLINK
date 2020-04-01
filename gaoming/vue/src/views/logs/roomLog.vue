<template>
<div class="logList">
  <div class="titleContainer">
    <span></span>
    <h5>监舍日志</h5>
  </div>
  <div class="sifi">
    <el-date-picker v-model="date" size="small" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']" value-format="yyyy-MM-dd hh:mm:ss">
    </el-date-picker>
    <el-select placeholder="全部监区" size="small" v-model="artId" @change="getFloors">
      <el-option label="全部监区" value=""></el-option>
      <el-option v-for="(item, index) in arts" :key="index" :label=" item.Name" :value="item.Id">
      </el-option>
    </el-select>
    <el-select v-if="floors.length!=0" placeholder="全部楼层" size="small" v-model="floorId" @change="getDoors">
      <el-option label="全部楼层" value=""></el-option>
      <el-option v-for="(item, index) in floors" :key="index" :label="item.Name" :value="item.Id">
      </el-option>
    </el-select>
    <el-select v-if="doors.length!=0" placeholder="全部监舍" size="small" v-model="doorId">
      <el-option label="全部监舍" value=""></el-option>
      <el-option v-for="(item, index) in doors" :key="index" :label="item.Name" :value="item.Id">
      </el-option>
    </el-select>
    <el-input placeholder="搜索警员姓名" size="small" v-model="search" clearable></el-input>
    <el-button size="small" type="primary" round @click="getList()">搜索条件</el-button>
    <el-button v-if="artId||floorId||doorId||date||search" size="small" type="info" round @click="clearSifi()">清除条件</el-button>
  </div>

  <div class="list hasSifi">
    <h5 class="tiper" v-if="list.length==0">{{listTip}}</h5>
    <ul>
      <li v-for="(item, index) in list">
        <i :class="getOperate_class(item.OperateType)" class="fa" aria-hidden="true"></i>
        <span class="time">{{item.CreationTime}}</span>
        <h5 class="li"><span>{{item.BuildingName}}-{{item.FloorName}}-{{item.DoorName}}-{{getOperate(item.OperateType)}}</span><span>操作位置 : {{getLocation(item.Location)}}</span>　　<span v-if="item.OperatorName">操作者 : {{item.OperatorName}}</span>　　<span v-if="item.SchedulingPolice">值班 : {{item.SchedulingPolice}}</span></h5>
      </li>
    </ul>
  </div>
  <div class="bottomtools" style="justify-content:space-between">
    <el-button v-if="list.length!=0" size="small" type="primary" @click="getExcel">导出 Excel</el-button>
    <el-pagination v-if="total>limit" background layout="total, prev, pager, next" :page-size="limit" :total="total" @current-change="getList" :current-page.sync="offset">
    </el-pagination>
  </div>


  <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
    <span>Excel成功生成!点击或者右键另存为目标!</span>
    <span slot="footer" class="dialog-footer">
      <a class="el-button el-button--primary" v-bind:href="downloadurl" target="_blank">下载</a>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      downloadurl: '',
      list: [],
      listTip: '数据加载中',
      prisonInfo: '',

      arts: [],
      artId: '',
      floors: [],
      floorId: '',
      doors: [],
      doorId: '',
      date: '',
      search: '',

      offset: 1,
      limit: 10,
      total: 1,
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.getPrison();
  },
  mounted: function() {
    this.getList();
  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    //获取监区信息
    getPrison: function() {
      let that = this;
      that.axios.get('/api/user/GetUserArts')
        .then(function(rel) {
          console.log(rel);
          if (rel.status == 200) {
            that.prisonInfo = rel.data;
            that.arts = rel.data.Arts;
          }
        }).catch(rel => {
          console.log(rel);
        });
    },
    getFloors: function(val) {
      let that = this;
      let arts = that.arts;
      that.floors = [];
      that.floorId = '';
      that.doors = [];
      that.doorId = '';
      for (let i in arts) {
        if (arts[i].Id == val) {
          that.floors = arts[i].Floors;
          return;
        }
      }
    },
    getDoors: function(val) {
      let that = this;
      let floors = that.floors;
      that.doors = [];
      that.doorId = '';
      for (let i in floors) {
        if (floors[i].Id == val) {
          that.doors = floors[i].Doors;
          return;
        }
      }
    },
    clearSifi: function() {
      this.artId = '';
      this.floors = [];
      this.floorId = '';
      this.doors = [];
      this.doorId = '';
      this.date = '';
      this.search = '';
      this.getList();
    },

    //获取列表
    getList: function() {
      let that = this;
      that.listTip = '数据加载中';
      that.axios.post('/api/doorHty/GetDoorHties', {
        "offset": that.offset - 1,
        "limit": that.limit,
        "ArtId": that.artId,
        "FloorId": that.floorId,
        "DoorId": that.doorId,
        "StartTime": that.date[0],
        "EndTime": that.date[1],
        "PoliceName": that.search,
      }).then(function(rel) {
        console.log(rel);
        if (rel.status == 200) {
          console.log(rel);
          that.list = rel.data.rows;
          that.total = rel.data.total;
          that.listTip = '暂无数据';
        }
      }).catch(rel => {
        console.log(rel);
        that.$message({
          message: '获取列表失败,请刷新',
          type: 'warning'
        });
      });
    },
    getExcel: function() {
      let that = this;
      that.axios.post('/api/doorHty/ExportDoorHty', {
        "Offset": that.offset - 1,
        "Limit": that.limit,
        "ArtId": that.artId,
        "FloorId": that.floorId,
        "DoorId": that.doorId,
        "StartTime": that.date[0],
        "EndTime": that.date[1],
        "Police": that.search,
      }).then(function(rel) {
        console.log(rel);
        if (rel.data.StateCode == 200) {
          that.dialogVisible = true;
          that.downloadurl = rel.data.Data;
        } else {
          that.$message({
            message: rel.data.Message,
            type: 'warning'
          });
        }
      }).catch(rel => {
        console.log(rel);
        that.$message({
          message: "错误!",
          type: 'warning'
        });
      });
    },
    getOperate: function(e) {
      if (e == 1) {
        return "关闭"
      } else if (e == 2) {
        return "开启"
      } else if (e == 3) {
        return "停止"
      }
    },
    getOperate_class: function(e) {
      if (e == 1) {
        return "fa-circle"
      } else if (e == 2) {
        return "fa-circle-o"
      } else if (e == 3) {
        return "fa-warning"
      }
    },
    getLocation: function(e) {
      if (e == 0) {
        return "分控室"
      } else if (e == 1) {
        return "楼层值班室"
      } else if (e == 2) {
        return "总控室"
      } else if (e == 3) {
        return "门禁打卡"
      }
    },
  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
h5.li {
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    justify-content: flex-start;
    > span {
        flex-grow: 0;
        flex-shrink: 1;
        width: 20%;
        padding-right: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
h5.tiper {
    position: absolute;
    top: 50%;
    left: 50%;
    color: #999;
    font-size: 16px;
    transform: translateX(-50%) translateY(-50%);
}
</style>
