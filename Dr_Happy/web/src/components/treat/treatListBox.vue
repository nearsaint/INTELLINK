<template>
<div class="treatListBox mainBox">
  <ul class="statistics">
    <li>
      <h3>{{total}}</h3>
      <h6>治疗总数</h6>
    </li>
    <li>
      <h3>{{getIngNum()}}</h3>
      <h6>当前页疗程中</h6>
    </li>
    <li>
      <h3>{{getEndNum()}}</h3>
      <h6>当前页已结束</h6>
    </li>
  </ul>
  <div class="listBox box">
    <div class="title">
      疗程管理
      <div class="btnContainer">
        <!-- <el-tooltip content="高级筛选" placement="top">
          <a class="fa-filter fa"></a>
        </el-tooltip> -->
        <el-tooltip content="导出全部患者Excel" placement="top">
          <a class="fa fa-cloud-download" @click="downloadExcel('','','全部患者')"></a>
        </el-tooltip>
        <el-tooltip content="切换列表模式" placement="top">
          <a class="fa" :class="[isList? 'isList_icon':'isLarge_icon']" @click="changeIsList"></a>
        </el-tooltip>
        <el-tooltip content="刷新" placement="top">
          <a class="refresh_icon fa" @click="treatment_get()"></a>
        </el-tooltip>
      </div>
    </div>
    <div class="content">
      <div class="filter">
        <!-- <ul class="floatLeft">
          <li>
            <el-input class="search" placeholder="搜索患者姓名" size="medium">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </li>
        </ul> -->
        <ul class="floatRight">
          <span class="text">当前页有{{list.length}}个条目</span>
        </ul>
        <div class="clr"></div>
      </div>

      <div class="noLists" v-if="list.length==0">
        <i class="el-icon-files"></i>
        <h5>暂时治疗条目</h5>
        <el-button type="primary" plain icon="el-icon-refresh-left" circle></el-button>
      </div>
      <ul class="list" :class="[isList?'isList':'noList']">
        <ul class="item">
          <li class="name">名称/性别/状态</li>
          <li class="treat">治疗</li>
          <li class="time">时间</li>
          <li class="edit">操作</li>
        </ul>
        <li v-for="(item, index) in list" :key="index">
          <ul class="item">
            <li class="name">
              <span :class="[item.sex==1?'male':'',item.sex==2?'female':'']" :style="'background-image: url('+item.url+')'">
                <i v-if="item.url==null" class="el-icon-s-custom"></i>
                <b class="fa" aria-hidden="true"></b>
              </span>
              <b></b>
              <h4>{{item.name}}</h4>
              <h2 class="stage" :class="[item.status==0||item.status==4?'waitting':'',item.status==1||item.status==5?'ing':'',item.status==3?'end':'',]">
                <template v-if="item.status==0">待审核</template>
                <template v-if="item.status==1">进行中</template>
                <template v-if="item.status==2">已拒绝</template>
                <template v-if="item.status==3">问卷结束</template>
                <template v-if="item.status==4">待开始</template>
                <template v-if="item.status==5">疗程结束</template>
              </h2>
            </li>
            <!-- <li class="stage">
              <h2 class="stage ing"></h2>
              <h6>3阶段</h6>
            </li> -->
            <li class="treat">
              <h5>{{item.treatment}}</h5>
              <h6>{{item.hospital}}-{{item.subject}}</h6>
            </li>
            <li class="time">
              <h5>第{{getDayNum(item.start)}}天</h5>
              <h6>{{item.start}}</h6>
            </li>
            <li class="edit">
              <el-tooltip content="导出Excel" placement="top">
                <a @click="downloadExcel(item.pid,item.qnid,item.name)" class="edit" style="right: 40px"><i class="fa fa-cloud-download" aria-hidden="true"></i></a>
              </el-tooltip>
              <el-tooltip content="详细" placement="top">
                <a @click="gotoTreatment(item.pid,item.qnid)" class="edit"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></a>
              </el-tooltip>
            </li>
          </ul>
        </li>
      </ul>
      <el-pagination v-show="list.length>0" :page-size="pageSize" :current-page="activePage" @current-change="changePage" class="pagination" background layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      isList: false,
      list: [],
      loading: null,
      page: 0,
      activePage: 1,
      pageSize: 9,
      total: 0,
    }
  },
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {
    this.treatment_get();
  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: '导出中,请稍后!',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.9)'
      });
    },
    closeFullScreen() {
      this.loading.close();
    },
    downloadExcel: function(pid, qnid, name) {
      let that = this;
      that.$confirm('确定导出' + name + '的数据,保存为Excel', '导出提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        that.openFullScreen();
        that.$axios.get('/api/download/excel?pid=' + pid + '&qnid=' + qnid).then(function(rel) {
          console.log(rel)
          if (rel.data.code == 200) {
            that.closeFullScreen();
            that.$alert('导出成功' + name + '的数据,保存为Excel', 'success', {
              confirmButtonText: '下载',
              callback: action => {
                // window.location.href = '/download/' + rel.data.fname
                window.open('/download/' + rel.data.fname, '_blank');
              }
            });
          }
        }).catch(rel => {
          console.log(rel)
          that.closeFullScreen();
          that.$alert('导出失败', 'warning', {
            confirmButtonText: '关闭',
          });
        });
      }).catch(rel => {
        console.log(rel)
        that.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    changeIsList: function() {
      this.isList = !this.isList;
    },
    getDayNum: function(e) {
      let begindate = e;
      begindate = new Date(Date.parse(begindate.replace(/-/g, "/")));
      let myDate = new Date();
      let startDate = begindate.getTime();
      let endDate = myDate.getTime();
      let day = parseInt((endDate - startDate) / 1000 / 3600 / 24) + 1;
      return day
    },
    getIngNum: function() {
      let ing = 0;
      for (let i in this.list) {
        if (this.list[i].status == 1) {
          ing = ing + 1;
        }
      }
      return ing
    },
    getEndNum: function() {
      let end = 0;
      for (let i in this.list) {
        if (this.list[i].status == 3) {
          end = end + 1;
        }
      }
      return end
    },
    gotoTreatment: function(pid, qnid) {
      console.log(pid);
      this.$router.push({
        path: '/treatment/' + pid,
        query: {
          pid: pid,
          qnid: qnid
        }
      })
    },
    treatment_get: function() {
      let that = this;
      that.$axios.get('/api/patient?page=' + this.activePage + '&size=' + this.pageSize).then(function(rel) {
        console.log(rel.data)
        if (rel.data.code == 200) {
          that.list = rel.data.items;
          that.page = rel.data.page;
          that.total = rel.data.total;
        }
      }).catch(rel => {
        console.log(rel)
      });
    },
    changePage: function(e) {
      let that = this;
      // console.log(e)
      this.activePage = e
      // console.log(this.activePage)
      this.treatment_get()
    },

  },
  computed: {},
  watch: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.treatListBox {
    .statistics {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        margin: 0 -5px 20px;
        width: calc(100% + 10px);
        > li {
            flex-grow: 1;
            flex-shrink: 1;
            margin: 0 5px;
            padding: 10px;
            border-radius: 6px;
            color: #fff;
            width: 20%;
            background-color: #fff;
            box-shadow: 0 0 12px #eee;
            > h3 {
                color: #409EFF;
                font-size: 32px;
                margin-bottom: 6px;
            }
            > h6 {
                color: #666;
                font-size: 13px;
            }
        }
    }

    .listBox {
        > .content {
            min-height: 500px;
            position: relative;
            > .noLists {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
                > i {
                    font-size: 88px;
                    color: #eee;
                    text-align: center;
                    margin: 0 auto 10px;
                    display: block;

                }
                > h5 {
                    font-size: 14px;
                    color: #ccc;
                    text-align: center;
                }
                > .el-button {
                    display: block;
                    margin: 10px auto;
                }
            }
            > .filter {
                padding: 15px;
                .text {
                    line-height: 36px;
                    font-size: 14px;
                    color: #666;
                }
            }
            > .list.isList {
                .item {
                    display: flex;
                    flex-wrap: nowrap;
                    justify-content: flex-start;
                    padding: 0 15px;
                    > .name {
                        width: 30%;
                    }
                    > .treat {
                        width: 30%;
                    }
                    > .time {
                        width: 30%;
                    }
                    > .edit {
                        width: 10%;
                        text-align: right;
                        > a {
                            margin-left: 0;
                            display: inline-block;
                            width: 28px;
                            height: 28px;
                            text-align: center;
                            line-height: 28px;
                        }
                    }
                }
                > .item {
                    background-color: #999;
                    > li {
                        flex-grow: 0;
                        flex-shrink: 0;
                        color: #ddd;
                        padding: 5px;
                        font-size: 12px;
                    }
                }
                > li {
                    background-color: #fff;
                    transition: all 0.5s;
                    border-top: 1px solid #ddd;
                    &:hover {
                        margin: 0 -8px;
                        // padding: 0 8px;
                        width: calc(100% + 16px);
                        border-radius: 5px;
                        box-shadow: 0 0 8px #ccc;
                        background-color: #f9f9f9;
                        position: relative;
                        z-index: 1;
                    }
                    > .item {
                        > li {
                            position: relative;
                            padding: 20px 0;
                            &.name {
                                padding-left: 72px;
                            }
                            > span {
                                background-color: #ddd;
                                border-radius: 50%;
                                border: 2px solid #999;
                                display: block;
                                height: 52px;
                                width: 52px;
                                position: absolute;
                                top: 20px;
                                left: 10px;
                                text-align: center;
                                line-height: 50px;
                                color: #ccc;
                                font-size: 32px;
                                background-position: center;
                                background-repeat: no-repeat;
                                background-size: contain;
                                > b {
                                    font-size: 12px;
                                    background: #999;
                                    color: #fff;
                                    border-radius: 50%;
                                    display: block;
                                    position: absolute;
                                    left: -9px;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    height: 18px;
                                    width: 18px;
                                    line-height: 18px;
                                }
                                &.female {
                                    border: 2px solid #F56C6C;
                                    > b {
                                        background-color: #F56C6C;
                                        &::before {
                                            content: "\F221";
                                        }
                                    }
                                }
                                &.male {
                                    border: 2px solid #409EFF;
                                    > b {
                                        background-color: #409EFF;
                                        &::before {
                                            content: "\F222";
                                        }
                                    }
                                }

                            }

                            > h4 {
                                color: #444;
                                font-size: 18px;
                                font-weight: bold;
                                margin: 3px 0;
                                line-height: 20px;
                            }
                            > h5 {
                                color: #666;
                                font-size: 14px;
                                margin: 3px 0;
                                line-height: 20px;
                                height: 20px;
                            }
                            > h6 {
                                color: #999;
                                font-size: 14px;
                                margin: 3px 0;
                                line-height: 20px;
                                height: 20px;
                            }
                            > h2.stage {
                                display: inline-block;
                                padding: 4px 8px;
                                margin: 3px 0 0;
                                border-radius: 20px;
                                background-color: #999;
                                font-size: 13px;
                                color: #fff;
                                height: 20px;
                                &.ing {
                                    background-color: #67C23A;
                                }
                                &.end {
                                    background-color: #999;
                                }
                                &.waitting {
                                    background-color: #409EFF;
                                }
                                &.none {
                                    background-color: #E6A23C;
                                }
                                &.success {
                                    background-color: #67C23A;
                                }
                                &.warning {
                                    background-color: #F56C6C;
                                }
                            }
                            > a.edit {
                                position: absolute;
                                top: 50%;
                                right: 0;
                                font-size: 24px;
                                color: #999;
                                transform: translateY(-50%) translateX(-50%);
                                &:hover {
                                    color: #409EFF;
                                }
                            }
                        }
                    }
                }
            }
            > .list.noList {
                padding: 5px;
                display: flex;
                flex-wrap: wrap;
                border-top: 1px solid #eee;
                > ul.item {
                    display: none;
                }
                > li {
                    border-radius: 6px;
                    margin: 10px;
                    border: 1px solid #ddd;
                    width: calc(33.3333% - 20px);
                    flex-grow: 0;
                    flex-shrink: 1;
                    transition: margin 0.3s;
                    &:hover {
                        box-shadow: 0 0 12px #eee;
                        margin-top: 5px;
                        margin-bottom: 15px;
                        border-color: #409EFF;
                    }
                    > .item {
                        display: flex;
                        justify-content: center;
                        flex-grow: 0;
                        flex-shrink: 0;
                        flex-wrap: wrap;
                        > li {
                            position: relative;
                            width: 100%;
                            margin-bottom: 10px;
                            padding: 5px 10px 0;
                            > h5 {
                                font-size: 16px;
                                margin-bottom: 5px;
                                color: #333;
                            }
                            > h6 {
                                font-size: 14px;
                                color: #999;
                                display: inline-block;
                            }
                            > h2.stage {
                                display: inline-block;
                                padding: 4px 8px;
                                margin: 3px 5px 5px 0;
                                border-radius: 20px;
                                background-color: #999;
                                font-size: 13px;
                                color: #fff;
                                height: 20px;
                                &.ing {
                                    background-color: #67C23A;
                                }
                                &.waitting {
                                    background-color: #409EFF;
                                }
                                &.end {
                                    background-color: #666;
                                }
                                &.success {
                                    background-color: #67C23A;
                                }
                                &.warning {
                                    background-color: #F56C6C;
                                }
                            }
                            &.name {
                                width: 100%;
                                height: 100px;
                                border-bottom: 1px solid #ddd;
                                position: relative;
                                text-align: right;
                                > b {
                                    display: block;
                                    width: 100px;
                                    height: 99px;
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    z-index: 2;
                                    background-repeat: no-repeat;
                                    background-position: center;
                                    background-image: url("../../assets/images/avarat_bg.png");
                                }
                                > span {
                                    background-color: #ddd;
                                    border-radius: 5px 0 0 0;
                                    display: block;
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    z-index: 1;
                                    height: 99px;
                                    width: 100px;
                                    text-align: center;
                                    line-height: 100px;
                                    color: #ccc;
                                    font-size: 32px;
                                    background-position: center;
                                    background-repeat: no-repeat;
                                    background-size: contain;

                                    > b {
                                        font-size: 12px;
                                        background: #999;
                                        color: #fff;
                                        border-radius: 50%;
                                        display: block;
                                        position: absolute;
                                        left: 6px;
                                        top: 6px;
                                        height: 18px;
                                        width: 18px;
                                        line-height: 18px;
                                    }
                                    &.female {
                                        > b {
                                            background-color: #F56C6C;
                                            &::before {
                                                content: "\F221";
                                            }
                                        }
                                    }
                                    &.male {
                                        > b {
                                            background-color: #409EFF;
                                            &::before {
                                                content: "\F222";
                                            }
                                        }
                                    }
                                }
                                > h4 {
                                    position: relative;
                                    z-index: 3;
                                    text-align: right;
                                    padding-right: 10px;
                                    margin-top: 40px;
                                    margin-bottom: 5px;
                                    font-size: 16px;
                                    font-weight: bold;
                                    color: #444;
                                }
                                > h5 {
                                    position: relative;
                                    z-index: 3;
                                    text-align: right;
                                    padding-right: 10px;
                                    font-size: 13px;
                                    color: #999;
                                }
                                > h2.stage {
                                    position: relative;
                                    z-index: 3;
                                    padding: 4px 8px;
                                    margin: 3px 5px 5px 0;
                                    border-radius: 20px;
                                    background-color: #999;
                                    font-size: 13px;
                                    color: #fff;
                                    height: 20px;
                                    text-align: right;
                                    &.ing {
                                        background-color: #67C23A;
                                    }
                                    &.waitting {
                                        background-color: #409EFF;
                                    }
                                    &.end {
                                        background-color: #666;
                                    }
                                    &.success {
                                        background-color: #67C23A;
                                    }
                                    &.warning {
                                        background-color: #F56C6C;
                                    }
                                }
                            }
                            &.edit {
                                text-align: right;
                                font-size: 28px;
                                color: #999;
                                &:hover {
                                    color: #409EFF;
                                }
                                > a {
                                    display: inline-block;
                                    width: 30px;
                                    height: 30px;
                                    margin-left: 10px;
                                    text-align: center;
                                    line-height: 30px;
                                }
                            }
                        }
                    }
                }
            }
            > .pagination {
                border-top: 1px solid #eee;
                padding: 15px;
            }
        }
    }
}
</style>
