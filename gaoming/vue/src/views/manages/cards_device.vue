<template>
<div class="cards">
  <div class="getTing" v-if="list.getTing">
    <div>
      <h5>获取数据中,请稍后</h5>
    </div>
  </div>
  <div class="noGet" v-if="list.noGet">
    <div>
      <h5>没获取到任何数据</h5>
      <a @click="getList()">刷新</a>
    </div>
  </div>

  <div class="list listContainer" v-if="!list.getTing && !list.noGet">
    <div class="toptools">
      <el-button type="primary" size="small" @click="openModel" v-if="$store.state.user.jurisdiction.AddControl">添加控制器</el-button>
    </div>
    <div class="title">
      <ul>
        <li class="num">序号</li>
        <li class="devsn">SN码</li>
        <li class="type">状态</li>
        <li class="ip">登陆IP</li>
        <li class="room">所属</li>
        <li class="btn">操作</li>
      </ul>
    </div>
    <div class="content">
      <ul v-for="(item,index) in list.data">
        <li class="num">{{(index + 1) + (list.limit * (list.offset-1))}}</li>
        <li class="devsn">{{item.DevSN}}</li>
        <li class="type">{{getControlType(item.ControlType)}}</li>
        <li class="ip">{{item.LoginIp}}</li>
        <li class="room"><template v-if="item.ArtName">{{item.ArtName +'-'+ item.FloorName +'-'+ item.DoorName}}</template></li>
        <li class="btn">
          <a @click="edit(item)" v-if="$store.state.user.jurisdiction.EditControl">编辑控制器</a></li>
        </li>
      </ul>
    </div>
    <div class="bottomtools">
      <el-button type="primary" size="small" @click="openModel" v-if="$store.state.user.jurisdiction.AddControl">添加控制器</el-button>
      <el-pagination v-if="list.total>list.limit" background layout="total, prev, pager, next" :page-size="list.limit" :total="list.total" :current-page.sync="list.offset" @current-change="getList">
      </el-pagination>
      <!-- @current-change="getList" -->
    </div>
  </div>
  <!-- end .list -->


  <div v-show="model.show" class="model">
    <a class="bg" @click="closeModel"></a>
    <a class="btn" @click="closeModel"><i class="fa fa-times" aria-hidden="true"></i></a>
    <div class="modelBox  animated fadeInDown">
      <el-button v-if="model.createState==false && $store.state.user.jurisdiction.DeleteControl" class="del" type="danger" round size="small" @click="delet" :loading="this.model.btnLoading_del">删除此控制器</el-button>
      <div class="title">
        <i></i>
        <h5>{{model.title}}</h5>
      </div>
      <div class="content">
        <div class="object">
          <ul class="input">
            <li><span>SN码:</span>
              <div class="input">
                <el-input size="medium" placeholder="SN码" v-model="model.input.devSN" ref="devSN">
                </el-input>
              </div>
            </li>
            <li><span>设备:</span>
              <div class="input">
                <el-select size="medium" v-model="model.input.type" placeholder="请状态" ref="type" @change="clearIp">
                  <el-option key="0" label="门禁控制器" :value="0"></el-option>
                  <el-option key="1" label="登陆控制器" :value="1"></el-option>
                </el-select>
              </div>
            </li>
            <li v-if="model.input.type == 1"><span>登陆IP:</span>
              <div class="input">
                <el-input size="medium" placeholder="登陆IP" v-model="model.input.ip" ref="ip">
                </el-input>
              </div>
            </li>
            <li><span>所属监区:</span>
              <div class="input">
                <el-select size="medium" v-model="model.prison" placeholder="选择监区" ref="prison" @change="getFloor">
                  <el-option v-for="(item, index) in model.prisonInfo" :key="index" :label="item.Name" :value="item.Id">
                  </el-option>
                </el-select>
              </div>
            </li>
            <li><span>所属楼层:</span>
              <div class="input">
                <el-select size="medium" v-model="model.floor" placeholder="选择楼层" ref="floor" @change="getDoor">
                  <el-option v-for="(item, index) in model.floorInfo" :key="index" :label=" item.Name" :value="item.Id">
                  </el-option>
                </el-select>
              </div>
            </li>
            <li><span>所属门:</span>
              <div class="input">
                <el-select size="medium" v-model="model.input.doorId" placeholder="选择门" ref="door">
                  <el-option v-for="(item, index) in model.roomInfo" :key="index" :label=" item.Name" :value="item.Id">
                  </el-option>
                </el-select>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer ">
        <el-button type="info " plain size="medium " @click="closeModel">取消</el-button>
        <el-button type="primary" size="medium " :loading="this.model.btnLoading_submit" @click="Submit">确定提交</el-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      list: {
        data: [],
        offset: 1,
        limit: 10,
        total: 1,
        getTing: true,
        noGet: false,
      },
      model: {
        step: 0,
        show: false,
        title: '添加控制器',
        btnLoading_writeCard: false,
        btnLoading_submit: false,
        btnLoading_del: false,
        createState: true,
        input: {
          devSN: '',
          type: '',
          ip: '',
          doorId: '',
          id: '',
        },

        prison: '',
        prisonInfo: [],

        floor: '',
        floorInfo: [],

        room: '',
        roomInfo: [],
      },
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.getList();
    this.getPrison();
    this.getJurisdiction();
  },
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    getJurisdiction: function() {
      if (!this.$store.state.user.jurisdiction.QueryControl) {
        this.$message({
          message: "非法操作!您的账号权限等级不够,请检查账号或者联系管理者",
          type: 'warning'
        });
        this.$router.push('/');
      }
    },
    // 添加编辑 弹出层
    openModel: function() {
      this.model.show = true;
      this.model.title = '添加控制器';
    },
    closeModel: function() {
      this.model.show = false;
      this.model.title = '';
      this.model.btnLoading_submit = false;
      this.model.input = {
        devSN: '',
        type: '',
        ip: '',
        doorId: '',
        id: '',
      };
      this.model.prison = '';
      this.model.floor = '';
      this.model.room = '';
      this.model.floorInfo = [];
      this.model.roomInfo = [];
    },

    //获取监区信息
    getPrison: function() {
      let that = this;
      that.axios.get('/api/art/GetArtsTree')
        .then(function(rel) {
          console.log(rel);
          if (rel.status == 200) {
            that.model.prisonInfo = rel.data.Arts;
          }
        }).catch(rel => {
          console.log(rel);
        });
    },
    //获取楼层列表
    getFloor: function(val) {
      let that = this;
      let prison = that.model.prisonInfo;
      that.model.floor = '';
      that.model.input.doorId = '';
      that.model.floorInfo = [];
      that.model.roomInfo = [];
      for (let i in prison) {
        if (val == prison[i].Id) {
          that.model.floorInfo = prison[i].Floors
        }
      }
    },
    //获取门列表
    getDoor: function(val) {
      console.log(val)
      let that = this;
      let floor = that.model.floorInfo;
      that.model.roomInfo = [];
      that.model.input.doorId = '';
      for (let i in floor) {
        if (val == floor[i].Id) {
          that.model.roomInfo = floor[i].Doors;
        }
      }
    },
    clearIp: function(val) {
      this.model.input.ip = '';
    },

    Submit: function() {
      let that = this;
      let api;
      let regexp = /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])(\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)){3}$/;
      that.model.btnLoading_submit = true;
      if (that.model.input.devSN == '' || that.model.input.type != 1 || that.model.input.type != 0 || that.model.input.doorId == '') {
        console.log(that.model.input.devSN);
        console.log(that.model.input.type);
        console.log(that.model.input.doorId);
        that.$message({
          type: 'info',
          message: '请正确填写表单,不能为空！'
        });
        that.model.btnLoading_submit = false;
      } else if (that.model.input.type == 1 && !regexp.test(that.model.input.ip)) {
        that.$message({
          type: 'info',
          message: '您填写的 IP 地址格式有误,请重新填写!'
        });
        that.model.btnLoading_submit = false;
      } else {
        if (that.model.createState == true) {
          that.axios.post('/api/control/Post', {
            "DevSN": that.model.input.devSN,
            "ControlType": that.model.input.type,
            "LoginIp": that.model.input.ip,
            "DoorId": that.model.input.doorId,
          }).then(function(rel) {
            console.log(rel);
            if (rel.data.StateCode == 200) {
              that.$message({
                type: 'success',
                message: rel.data.Message,
              });
              that.closeModel();
              that.getList();
            } else {
              that.$message({
                type: 'warning',
                message: rel.data.Message,
              });
              that.model.btnLoading_submit = false;
            }
          }).catch(rel => {
            that.$message({
              message: '获取列表失败,请刷新',
              type: 'warning'
            });
            that.model.btnLoading_submit = false;
          });
        } else {
          that.axios.put('/api/control/Put', {
            "Id": that.model.input.id,
            "DevSN": that.model.input.devSN,
            "ControlType": that.model.input.type,
            "LoginIp": that.model.input.ip,
            "DoorId": that.model.input.doorId,
          }).then(function(rel) {
            console.log(rel);
            if (rel.data.StateCode == 200) {
              that.$message({
                type: 'success',
                message: rel.data.Message,
              });
              that.closeModel();
              that.getList();
            } else {
              that.$message({
                type: 'warning',
                message: rel.data.Message,
              });
              that.model.btnLoading_submit = false;
            }
          }).catch(rel => {
            that.$message({
              message: '获取列表失败,请刷新',
              type: 'warning'
            });
            that.model.btnLoading_submit = false;
          });
        }
      }
    },

    //获取列表
    getList: function() {
      let that = this;
      that.axios.post('/api/control/GetControls', {
        "limit": that.list.limit,
        "offset": that.list.offset - 1,
      }).then(function(rel) {
        console.log(rel);
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

    getControlType: function(i) {
      if (i == 1) {
        return "登陆控制器"
      } else if (i == 0) {
        return "门禁控制器"
      }
    },
    //编辑
    edit: function(item) {
      this.model.createState = false;
      this.model.show = true;
      this.model.title = '编辑控制器';
      console.log(item);
      let that = this;
      this.model.input.id = item.Id;
      this.model.input.devSN = item.DevSN;
      this.model.input.type = item.ControlType;
      this.model.input.ip = item.LoginIp;
      this.model.prison = item.ArtId;
      this.getFloor(item.ArtId);
      this.model.floor = item.FloorId;
      this.getDoor(item.FloorId);
      this.model.input.doorId = item.DoorId;
    },
    //删除
    delet: function() {
      let that = this;
      that.model.btnLoading_del = true;
      this.$prompt('请输入"delete"', '删除确定', {
        confirmButtonText: '删除此控制器',
        cancelButtonText: '取消',
      }).then(({
        value
      }) => {
        if (value == "delete") {
          that.axios.delete('/api/control/Delete?id=' + that.model.input.id).then(function(rel) {
            if (rel.status == 500) {
              that.$message({
                message: "删除此控制器,请重试",
                type: 'warning'
              });
              that.model.btnLoading_del = false;
            } else if (rel.status == 200) {
              that.$message({
                message: rel.data.Message,
                type: 'success'
              });
              that.list.offset = 1;
              that.closeModel();
              that.getList();
            }
          }).catch(rel => {
            console.log(rel);
            that.$message({
              message: '删除此控制器,请重试',
              type: 'warning'
            });
            that.model.btnLoading_del = false;
          });
        } else {
          this.$message({
            type: 'info',
            message: '请输入正确"delete"'
          });
          that.model.btnLoading_del = false;
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除已取消'
        });
        that.model.btnLoading_del = false;
      });
    },

  },



  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.btn_role {
    margin-right: 10px;
    border: 1px solid #F56C6C !important;
    color: #F56C6C !important;
    &.touch,
    &:focus,
    &:hover {
        background: #F56C6C !important;
        color: #fff !important;
    }
}
.num {}
.devsn {
    width: 15%;
}
.type {
    width: 15%;
}
.ip {
    width: 20%;
}
.room {
    width: 15%;
}
</style>
