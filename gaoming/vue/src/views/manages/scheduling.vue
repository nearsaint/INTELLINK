<template>
<div class="scheduling">
  <div class="titleContainer">
    <span></span>
    <h5>排班管理</h5>
  </div>
  <div class="sifi">
    <el-date-picker v-model="date" size="small" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
    </el-date-picker>
    <el-select placeholder="全部监区" size="small" v-model="artName">
      <el-option label="全部监区" value=""></el-option>
      <el-option v-for="(item, index) in artsList" :key="index" :label=" item.Name" :value="item.Name">
      </el-option>
    </el-select>
    <el-button size="small" type="primary" round @click="getList()">筛选</el-button>
    <el-button type="primary" size="small" class="updata" @click="openModel2" v-if="$store.state.user.jurisdiction.ImportScheduling">上传班表</el-button>
    <el-button v-if="date.length!=0||artName" size="small" type="info" round @click="clearSifi()">清除条件</el-button>
  </div>
  <div class="list listContainer" style="height:calc(100% - 104px)">
    <h5 class="tiper" v-if="list.data.length==0">暂无数据</h5>
    <div class="title">
      <ul>
        <li class="time">日期</li>
        <li class="art">监区</li>
        <li class="double one">
          <h5>执勤警力</h5>
          <h5>
            <span>坐睡班(21:00-次8:00)</span>
            <span>主班(7:30-12:00,18:00-21:00)</span>
            <span>正常班(8:30-12:00,14:00-17:30)</span>
            <span>副班(12:00-18:00)</span>
          </h5></li>
        <li class="btn">操作</li>
      </ul>
    </div>
    <div class="content" style="height:calc(100% - 105px)">
      <ul v-for="(item,index) in list.data">
        <li class="time">{{item.CreationTime.slice(0,10)}}</li>
        <li class="art">{{item.ArtName}}</li>
        <li class="double one">
          <h5>
            <span>{{item.SitSleepShift}}</span>
            <span>{{item.MainShift}}</span>
            <span>{{item.NormalShift}}</span>
            <span>{{item.ViceShift}}</span>
          </h5>
        </li>
        <li class="btn">
          <a @click="openModel(item)" v-if="$store.state.user.jurisdiction.EditScheduling">查看/编辑</a>
        </li>
      </ul>
    </div>
    <div class="bottomtools">
      <el-button type="primary" size="small" @click="openModel2" v-if="$store.state.user.jurisdiction.ImportScheduling">上传班表</el-button>
      <el-pagination v-if="list.total>list.limit" background layout="total, prev, pager, next" :page-size="list.limit" :total="list.total" @current-change="getList" :current-page.sync="list.offset">
      </el-pagination>
    </div>
  </div>
  <!-- end .list -->

  <div class="model" v-show="model.show">
    <a class="bg" @click="closeModel()"></a>
    <a class="btn" @click="closeModel()"><i class="fa fa-times" aria-hidden="true"></i></a>
    <div class="modelBox animated fadeInDown">
      <el-button class="del" type="danger" round size="small" @click="delscheduling()" v-if="$store.state.user.jurisdiction.DeleteScheduling">删除排班信息</el-button>
      <div class="title">
        <i></i>
        <h5>班表详细与编辑</h5>
      </div>
      <div class="content">
        <div class="object">
          <div class="title">
            <hr>
            <span>所属监区</span>
          </div>
          <ul class="input">
            <li><span>监区名:</span>
              <div class="input">
                <el-input size="medium" :value="model.input.artName" disabled>
                </el-input>
              </div>
            </li>
            <li><span>监区ID:</span>
              <div class="input">
                <el-input size="medium" :value="model.input.artId" disabled>
                </el-input>
              </div>
            </li>
          </ul>
        </div>
        <div class="object">
          <div class="title">
            <hr>
            <span>日期</span>
          </div>
          <ul class="input">
            <li><span>条目ID:</span>
              <div class="input">
                <el-input size="medium" :value="model.input.id" disabled>
                </el-input>
              </div>
            </li>
            <li><span>日期:</span>
              <div class="input">
                <el-input size="medium" disabled :value="model.input.date.slice(0,10)">
                </el-input>
              </div>
            </li>
          </ul>
        </div>

        <div class="object">
          <div class="title">
            <hr>
            <span>执勤警力</span>
          </div>
          <ul class="input">
            <li><span>坐睡班(21:00-次8:00)</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入坐睡班警员名字" v-model="model.input.a1">
                </el-input>
              </div>
            </li>
            <li><span>主班(7:30-12:00,18:00-21:00)</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入主班警员名字" v-model="model.input.a2">
                </el-input>
              </div>
            </li>
            <li><span>正常班(8:30-12:00,14:00-17:30)</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入正常班警员名字" v-model="model.input.a3">
                </el-input>
              </div>
            </li>
            <li><span>副班(12:00-18:00)</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入副班警员名字" v-model="model.input.a4">
                </el-input>
              </div>
            </li>
          </ul>
        </div>

        <div class="object">
          <div class="title">
            <hr>
            <span>备勤警力</span>
          </div>
          <ul class="input">
            <li><span>早班(8:30-18:30)</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入早班备勤警员名字" v-model="model.input.b1">
                </el-input>
              </div>
            </li>
            <li><span>晚班(18:30-次8:30)</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入晚班备勤警员名字" v-model="model.input.b2">
                </el-input>
              </div>
            </li>
          </ul>
        </div>

        <div class="object">
          <div class="title">
            <hr>
            <span>其他警力</span>
          </div>
          <ul class="input">
            <li><span>坐睡班补休:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入坐睡班补休警员" v-model="model.input.c1">
                </el-input>
              </div>
            </li>
            <li><span>正常轮休:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入正常轮休警员" v-model="model.input.c2">
                </el-input>
              </div>
            </li>
            <li><span>请休假:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入请休假警员" v-model="model.input.c3">
                </el-input>
              </div>
            </li>
            <li><span>其他:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入警员" v-model="model.input.c4">
                </el-input>
              </div>
            </li>
          </ul>
        </div>
        <div class="object">
          <div class="title">
            <hr>
            <span>备注</span>
          </div>
          <ul class="input">
            <li><span>备注:</span>
              <div class="input">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入备注" v-model="model.input.d1">
                </el-input>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer ">
        <el-button type="info " plain size="medium " @click="closeModel">取消</el-button>
        <el-button type="primary " size="medium " :loading="this.model.btnLoading_submit" @click="putList()">确定提交</el-button>
      </div>
    </div>
  </div>

  <div v-show="model2.show" class="model">
    <a class="bg" @click="closeModel2"></a>
    <a class="btn" @click="closeModel2"><i class="fa fa-times" aria-hidden="true"></i></a>
    <div class="modelBox  animated fadeInDown">
      <div class="title">
        <i></i>
        <h5>上传班表</h5>
      </div>
      <div class="content">
        <el-select placeholder="全部监区" size="small" v-model="model2.updata_query.artName" style="width: 360px;margin-bottom: 20px;">
          <el-option label="全部监区" value=""></el-option>
          <el-option v-for="(item, index) in artsList" :key="index" :label="item.Name" :value="item.Name">
          </el-option>
        </el-select>
        <el-upload :data="model2.updata_query" class="upload-demo" drag :file-list="model2.fileList" :show-file-list="false" action="/api/scheduling/Post" :multiple="false" ref="upload" :before-upload="beforeAvatarUpload" :onError="uploadError" :onSuccess="uploadSuccess">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传.xls和.xlsx文件，且不超过1M，一次只能上传一个文件.</div>
        </el-upload>
      </div>
      <div class="footer ">
        <el-button type="primary" plain size="medium " @click="closeModel2">关闭窗口</el-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      date: [],
      artName: '',
      artsList: [],

      list: {
        data: [],
        offset: 1,
        limit: 10,
        total: 1,
        getTing: true,
        noGet: false,
      },
      model2: {
        show: false,
        updata_query: {
          artName: '',
        },
        fileList: [],
      },
      model: {
        show: false,
        btnLoading_submit: false,
        input: {
          id: '',
          date: '',
          week: '',
          artId: '',
          artName: '',

          a1: '',
          a2: '',
          a3: '',
          a4: '',

          b1: '',
          b2: '',

          c1: '',
          c2: '',
          c3: '',
          c4: '',

          d1: '',
        },
      },
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.getPrison();
    this.getList();
    this.getJurisdiction();
  },
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    getJurisdiction: function() {
      if (!this.$store.state.user.jurisdiction.QueryScheduling) {
        this.$message({
          message: "非法操作!您的账号权限等级不够,请检查账号或者联系管理者",
          type: 'warning'
        });
        this.$router.push('/');
      }
    },
    openModel: function(item) {
      this.model.show = true;
      this.model.input.id = item.Id;
      this.model.input.date = item.CreationTime;
      this.model.input.artId = item.ArtId;
      this.model.input.artName = item.ArtName;

      this.model.input.a1 = item.SitSleepShift;
      this.model.input.a2 = item.MainShift;
      this.model.input.a3 = item.NormalShift;
      this.model.input.a4 = item.ViceShift;

      this.model.input.b1 = item.SpareShiftOne;
      this.model.input.b2 = item.SpareShiftTwo;

      this.model.input.c1 = item.SitSleepSupple;
      this.model.input.c2 = item.Rotation;
      this.model.input.c3 = item.Leave;
      this.model.input.c4 = item.Other;

      this.model.input.d1 = item.Remark;
    },
    closeModel: function() {
      this.model.show = false;
      this.model.btnLoading_submit = false;
      this.model.input = {
        id: '',
        date: '',
        week: '',
        artId: '',
        artName: '',

        a1: '',
        a2: '',
        a3: '',
        a4: '',

        b1: '',
        b2: '',

        c1: '',
        c2: '',
        c3: '',
        c4: '',

        d1: '',
      };
    },
    getPrison: function() {
      let that = this;
      that.axios.get('/api/user/GetUserArts')
        .then(function(rel) {
          console.log(rel);
          if (rel.status == 200) {
            that.artsList = rel.data.Arts;
          }
        }).catch(rel => {
          console.log(rel);
        });
    },

    //列表
    getList: function() {
      let that = this;

      that.axios.post('/api/scheduling/GetSchedulings', {
        "start": that.date[0],
        "end": that.date[1],
        "name": that.artName,
        "limit": that.list.limit,
        "offset": that.list.offset - 1,
      }).then(function(rel) {
        if (rel.status == 200) {
          console.log(rel);
          that.list.data = rel.data.Data;
          that.list.total = rel.data.Total;
        }
      }).catch(rel => {
        console.log(rel);
        that.$message({
          message: '获取列表失败,请刷新',
          type: 'warning'
        });
      });
    },
    putList: function() {
      let that = this;
      that.model.btnLoading_submit = true;
      that.axios.put('/api/scheduling/put', {
        "Id": that.model.input.id,
        "ArtId": that.model.input.artId,
        "ArtName": that.model.input.artName,
        "CreationTime": that.model.input.date,
        "SitSleepShift": that.model.input.a1,
        "MainShift": that.model.input.a2,
        "NormalShift": that.model.input.a3,
        "ViceShift": that.model.input.a4,
        "SpareShiftOne": that.model.input.b1,
        "SpareShiftTwo": that.model.input.b2,
        "SitSleepSupple": that.model.input.c1,
        "Rotation": that.model.input.c2,
        "Leave": that.model.input.c3,
        "Other": that.model.input.c4,
        "Remark": that.model.input.d1,
      }).then(function(rel) {
        if (rel.status == 500) {
          that.$message({
            message: "修改班表失败,请重试",
            type: 'warning'
          });
          that.model.btnLoading_submit = false;
        } else if (rel.status == 200) {
          that.$message({
            message: rel.data.Message,
            type: 'success'
          });
          that.list.offset = 1;
          that.getList();
          that.closeModel();
        }
      }).catch(rel => {
        console.log(rel);
        that.$message({
          message: '修改班表失败,请刷新',
          type: 'warning'
        });
        that.model.btnLoading_submit = false;
      });
    },

    delscheduling: function() {
      let that = this;
      that.model.btnLoading_submit = true;
      this.$prompt('请输入"delete"', '删除确定', {
        confirmButtonText: '删除此排班信息',
        cancelButtonText: '取消',
      }).then(({
        value
      }) => {
        if (value == "delete") {
          that.axios.delete('/api/scheduling/delete?id=' + that.model.input.id).then(function(rel) {
            if (rel.status == 500) {
              that.$message({
                message: rel.data.Message,
                type: 'warning'
              });
              that.model.btnLoading_submit = false;
            } else if (rel.status == 200) {
              that.$message({
                message: rel.data.Message,
                type: 'success'
              });
              that.list.offset = 1;
              that.getList();
              that.closeModel();
            }
          }).catch(rel => {
            console.log(rel);
            that.$message({
              message: '删除排班信息失败,请重试',
              type: 'warning'
            });
            that.model.btnLoading_submit = false;
          });


        } else {
          this.$message({
            type: 'info',
            message: '请输入正确"delete"'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除已取消'
        });
      });
    },
    clearSifi: function() {
      this.date = [];
      this.artName = '';
      this.getList();
    },
    //列表结束

    //上传
    openModel2: function() {
      this.model2.show = true;
      this.model2.fileList = [];
      this.model2.updata_query.artName = '';
    },
    closeModel2: function() {
      this.model2.show = false;
      this.model2.fileList = [];
      this.model2.updata_query.artName = '';
    },
    beforeAvatarUpload: function(file) {
      if (this.model2.updata_query.artName.length == 0) {
        this.$message({
          message: '请选择监区!',
          type: 'warning'
        });
        return false
      } else {
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        const extension = testmsg === 'xls'
        const extension2 = testmsg === 'xlsx'
        const isLt2M = file.size / 1024 / 1024 < 10

        if (!extension && !extension2) {
          this.$message({
            message: '上传文件只能是 xls、xlsx格式!',
            type: 'warning'
          });
        }
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过 10MB!',
            type: 'warning'
          });
        }
        return extension || extension2 && isLt2M
      }
    }, // 上传成功后的回调
    uploadSuccess: function(rel, file, fileList) {
      // console.log('上传文件', rel)
      if (rel.StateCode == 200) {
        this.$message({
          message: rel.Message,
          type: 'success'
        });
        this.closeModel2();
        this.getList();
      } else if (rel.StateCode == 500) {
        this.$message({
          message: rel.Message,
          type: 'warning'
        });
      }
    }, // 上传错误
    uploadError: function(response, file, fileList) {
      this.$message({
        message: '上传失败，请重试！',
        type: 'warning'
      });
    },


    //上传结束
  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
div.listContainer {
    > div.title {
        height: 52px;
        padding: 0 19px;
        > ul {

            > li {
                &.time {
                    width: 10%;
                    text-align: left;
                    line-height: 52px;
                }
                &.double {
                    text-align: center;
                    border-left: 1px solid #333;
                    &.one {
                        width: 70%;
                        justify-content: flex-start;
                        display: flex;
                        flex-wrap: wrap;
                        border-right: 1px solid #333;
                        > h5 {
                            line-height: 26px;
                            border-bottom: 1px solid #333;
                            width: 100%;
                            justify-content: center;
                            display: flex;
                            text-align: center;
                            font-size: 12px;
                            > span {
                                border-right: 1px solid #333;
                                width: 25%;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                &:last-child {
                                    border-right: none;
                                }
                            }
                            &:last-child {
                                border-bottom: none;
                            }
                        }
                    }
                }
                &.btn {
                    line-height: 52px;
                }
            }
        }
    }
}

.time {
    width: 10%;
    display: flex;
    align-items: center;
}
.art {
    width: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid #444;
}
div.content {

    .btn {
        width: calc(10% + 14px);
        justify-content: center;
        align-items: center;
        display: flex;
    }
    .art {
        width: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #444;
    }
    .double.one {
        width: 70%;
        border-left: 1px solid #444;
        border-right: 1px solid #444;
        > h5 {
            line-height: 26px;
            width: 100%;
            height: 100%;
            justify-content: center;
            display: flex;
            text-align: center;
            font-size: 12px;
            > span {
                border-right: 1px solid #444;
                width: 25%;
                display: flex;
                justify-content: center;
                align-items: center;
                &:last-child {
                    border-right: none;
                }
            }
            &:last-child {
                border-bottom: none;
            }
        }
    }
}
div.object {
    ul.input {
        > li {
            > span {
                width: 210px !important;
            }
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
