<template>
<div class="prisons_camera">

  <div class="getTing" v-if="list.getTing">
    <div>
      <h5>获取数据中,请稍后</h5>
    </div>
  </div>
  <div class="noGet" v-if="list.noGet">
    <div>
      <h5>没获取到任何数据</h5>
      <a @click="getCameraList()">刷新</a>
    </div>
  </div>
  <div class="list" v-if="!list.getTing && !list.noGet">
    <div class="toptools">
      <!-- <el-button type="primary" size="small" @click="openDialog">添加监区</el-button> -->
    </div>
    <div class="title">
      <ul>
        <li class="num">序号</li>
        <li class="id">摄像机ID</li>
        <li class="name">摄像机名</li>
        <!-- <li class="btn">操作</li> -->
      </ul>
    </div>
    <div class="content">
      <ul v-for="(item,index) in list.data">
        <li class="num">{{(index + 1) + (list.limit * (list.offset-1))}}</li>
        <li class="id">{{item.ResCode}}</li>
        <li class="name">{{item.ResName}}</li>
        <!-- <li class="btn"><a @click="getName(item)">编辑</a></li> -->
      </ul>
    </div>
    <div class="bottomtools">
      <el-pagination v-if="list.total>list.limit" background layout="total, prev, pager, next" :page-size="list.limit" :total="list.total" @current-change="getCameraList" :current-page.sync="list.offset">
      </el-pagination>
    </div>
  </div>
  <!-- end .list -->
</div>
</template>

<script>
export default {

  data() {
    return {
      //list
      list: {
        data: [],
        offset: 1,
        limit: 10,
        total: 1,
        getTing: true,
        noGet: false,
      },
    }
  },

  beforeCreate: function() {},
  created: function() {
    this.getCameraList();
    this.getJurisdiction();
  },
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    getJurisdiction: function() {
      if (!this.$store.state.user.jurisdiction.QueryWebcam) {
        this.$message({
          message: "非法操作!您的账号权限等级不够,请检查账号或者联系管理者",
          type: 'warning'
        });
        this.$router.push('/');
      }
    },
    getCameraList: function() {
      let that = this;
      that.axios.post('/api/Webcam/GetWebcams', {
        "limit": that.list.limit,
        "offset": that.list.offset - 1,
      }).then(function(rel) {
        if (rel.status == 200) {
          that.list.data = rel.data.Data;
          that.list.total = rel.data.Total;
          that.list.getTing = false;
        }
      }).catch(rel => {
        that.list.getTing = false;
        that.list.noGet = true;
        that.$message({
          message: '获取列表失败,请刷新',
          type: 'warning'
        });
      });
    },
  },
  computed: {},
  components: {},
}
</script>


<style lang="scss" scoped>
.name {
    width: 30%;
}
.id {
    width: 30%;
}
.btn {
    width: 20%;
}
</style>
