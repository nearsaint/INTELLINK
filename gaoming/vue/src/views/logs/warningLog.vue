<template>
<div class="logList">
  <div class="titleContainer">
    <span></span>
    <h5>报警日志</h5>
  </div>
  <div class="sifi">
    <el-date-picker ref="inputDate" v-model="date" size="small" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']" value-format="yyyy-MM-dd hh:mm:ss">
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
    <!-- <el-input placeholder="搜索警员姓名" size="small" v-model="search" clearable></el-input> -->
    <el-button size="small" type="primary" round @click="getList()">搜索条件</el-button>
    <el-button v-if="artId||floorId||doorId||date||search" size="small" type="info" round @click="clearSifi()">清除条件</el-button>
  </div>

  <div class="list hasSifi">
    <h5 class="tiper" v-if="list.length==0">{{listTip}}</h5>
    <ul>
      <li v-for="(item, index) in list">
        <i class="fa fa-warning" aria-hidden="true"></i>
        <span class="time">{{item.CreationTime}}</span>
        <h5 class="li">
          <a class="btn cheInfo" v-if="item.BConfirmed==false" @click="cheInfo(item)">确认</a>
          <a class="btn" @click="chaCamera(item.CreationTime,item.Webcams,item)">查看视频</a>
          <span>{{item.BuildingName}}-{{item.FloorName}}-{{item.DoorName}} 门警报!</span>
          <span>警报类型 : {{getAlarm(item.AlarmCode)}}</span>
          <span v-if="item.SchedulingPolice">值班 : {{item.SchedulingPolice}}</span>
          <span v-if="item.PoliceName">确认警员 : {{item.PoliceName}}</span>
          <span v-if="item.ConfirmTime">确认时间 : {{item.ConfirmTime}}</span>
        </h5>
      </li>
      <!-- <li>
        <i class="fa fa-warning" aria-hidden="true"></i>
        <span class="time">2018-09-28 18:28:28</span>
        <h5 class="li"><span>sss门警报!</span><span>警报类型 : sdsds</span><span>值班 : sasd</span><a class="btn" @click="chaCamera('2018-09-28 18:28:28',)">查看视频</a></h5>
      </li> -->
    </ul>
  </div>
  <div class="bottomtools" style="justify-content:space-between">
    <el-button size="small" type="primary" @click="getExcel">导出 Excel</el-button>
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
      that.listTip = '数据加载中'
      that.axios.post('/api/alarmHty/GetAlarms', {
        "offset": that.offset - 1,
        "limit": that.limit,
        "ArtId": that.artId,
        "FloorId": that.floorId,
        "DoorId": that.doorId,
        "StartTime": that.date[0],
        "EndTime": that.date[1],
        "Police": that.search,
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
      that.axios.post('/api/alarmHty/ExportAlarmHty', {
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
    getList_hasSearch: function() {
      if (this.search) {
        if (this.date) {
          this.getList();
        } else {
          this.$message.error('搜索警员时必须加入时间区域!');
          this.$refs.inputDate.focus();
        }
      } else {
        this.getList();
      }
    },

    getAlarm: function(e) {
      if (e == 1) {
        return "非法开门"
      } else if (e == 2) {
        return "关门超时"
      } else if (e == 3) {
        return "门未开启"
      } else if (e == 4) {
        return "门遇阻停"
      }
    },
    cheInfo: function(item) {
      let that = this;
      console.log(item.Id);
      that.axios.post('/api/alarmHty/ConfirmAlarm?Id=' + item.Id).then(function(rel) {
        console.log(rel);
        if (rel.status == 200) {
          that.getList();
        }
      }).catch(rel => {
        console.log(rel);
      });
    },
    chaCamera: function(time, id, item) {
      // console.log(time);
      // console.log(id);
      // console.log(item);
      var timestamp = new Date(Date.parse(time.replace(/-/g, "/"))).getTime() / 1000;
      // console.log(timestamp);
      let start = this.timestampToTime(timestamp - 10);
      let end = this.timestampToTime(timestamp + 10);
      let obj = document.getElementById("cam").contentWindow;
      let Flist = obj.document.getElementById("CamIDText_select");
      let startTime = obj.document.getElementById("startTime");
      let endTime = obj.document.getElementById("endTime");
      Flist.innerHTML = "";
      for (let i = 0; i < id.length; i++) {
        let option = obj.document.createElement("option");
        option.text = id[i];
        Flist.add(option, null);
      }
      startTime.value = start;
      endTime.value = end;
      this.openCamera_hasFile();
      obj.DoQueryRecord_hasproperty();
    },
    openCamera_hasFile: function() {
      this.StopFrameLive();
      let obj = document.getElementById("cam").contentWindow;
      obj.document.getElementById("file").style.display = "block";
      $('body').addClass('hasCamera');
    },
    closeCamera_hasFile: function() {
      let obj = document.getElementById("cam").contentWindow;
      obj.document.getElementById("file").style.display = "none";
      let Flist = obj.document.getElementById("CamIDText_select");
      Flist.innerHTML = "";
      $('body').removeClass('hasCamera');
      this.StopFrameLive();
    },

    StopFrameLive: function() {
      let obj = document.getElementById("cam").contentWindow;
      let n = obj.g_imosActivePlayer.IMOSAX_GetFrameNum();
      console.log(n);
      for (let i = 1; i <= n; i++) {
        obj.g_imosActivePlayer.IMOSAX_StopFramelive(i);
      }
    },
    timestampToTime: function(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes() + ':';
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
      // console.log(Y + M + D + h + m + s);
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
    position: relative;
    > span {
        flex-grow: 0;
        flex-shrink: 1;
        width: 20%;
        padding-right: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    > .btn {
        position: absolute;
        right: 20px;
        padding: 0 10px;
        border: 1px solid #ccc;
        font-size: 12px;
        color: #ccc;
        &:focus,
        &:hover {
            color: #409EFF;
            border-color: #409EFF;
        }
        &.cheInfo {
            right: 110px;
        }
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
