<template>
<div class="logList">
  <div class="titleContainer">
    <span></span>
    <h5>交接班打卡日志</h5>
  </div>

  <div class="sifi">
    <el-date-picker v-model="date" size="small" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']" value-format="yyyy-MM-dd hh:mm:ss">
    </el-date-picker>
    <el-select placeholder="全部监区" size="small" v-model="artId">
      <el-option label="全部监区" value=""></el-option>
      <el-option v-for="(item, index) in arts" :key="index" :label=" item.Name" :value="item.Id">
      </el-option>
    </el-select>
    <el-input placeholder="搜索警员姓名" size="small" v-model="search" clearable></el-input>
    <el-button size="small" type="primary" round @click="getList()">搜索条件</el-button>
    <el-button v-if="artId||date||search" size="small" type="info" round @click="clearSifi()">清除条件</el-button>
  </div>
  <div class="list hasSifi">

    <h5 class="tiper" v-if="list.length==0">数据加载中</h5>
    <ul>
      <li v-for="(item, index) in list">
        <i class="fa fa-exchange" aria-hidden="true"></i>
        <span class="time">{{item.CreationTime}}</span>
        <h5 class="li"><span>位置:　{{item.ArtName}}</span><span>人员姓名:　{{item.PoliceName}}</span></h5>
      </li>
    </ul>
  </div>
  <div class="bottomtools" style="justify-content:space-between">
    <el-button v-if="list.length!=0" size="small" type="primary">导出 Excel</el-button>
    <el-pagination v-if="total>limit" background layout="total, prev, pager, next" :page-size="limit" :total="total" @current-change="getList" :current-page.sync="offset">
    </el-pagination>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      list: [],

      prisonInfo: '',

      arts: [],
      artId: '',
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
          if (rel.status == 200) {
            that.prisonInfo = rel.data;
            that.arts = rel.data.Arts;
          }
        }).catch(rel => {
          console.log(rel);
        });
    },

    clearSifi: function() {
      this.artId = '';
      this.date = '';
      this.search = '';
      this.getList();
    },

    //获取列表
    getList: function() {
      let that = this;
      that.axios.post('/api/shift/GetShifts', {
        "offset": that.offset - 1,
        "limit": that.limit,
        "ArtId": that.artId,
        "StartTime": that.date[0],
        "EndTime": that.date[1],
        "PoliceName": that.search,
      }).then(function(rel) {
        console.log(rel);
        if (rel.status == 200) {
          console.log(rel);
          that.list = rel.data.Data;
          that.total = rel.data.total;
        }
      }).catch(rel => {
        console.log(rel);
        that.$message({
          message: '获取列表失败,请刷新',
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
