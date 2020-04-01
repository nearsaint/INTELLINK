<template>
<div class="prisons_room">
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
  <div class="list" v-if="!list.getTing && !list.noGet">
    <div class="toptools">
      <!-- <el-select placeholder="显示全部监区" size="small">
      </el-select> -->
      <el-button type="primary" size="small" @click="openDialog" v-if="$store.state.user.jurisdiction.AddDoor">添加监舍</el-button>
    </div>
    <div class="title">
      <ul>
        <li class="num">序号</li>
        <li class="name">监舍名</li>
        <li class="prisonF">所属监区</li>
        <li class="floorF">所属楼层</li>
        <li class="cameraQ">摄像头数量</li>
        <li class="btn">操作</li>
      </ul>
    </div>
    <div class="content">
      <ul v-for="(item,index) in list.data">
        <li class="num">{{(index + 1) + (list.limit * (list.offset-1))}}</li>
        <li class="name">{{item.Name}}</li>
        <li class="prisonF">{{item.BuildingName}}</li>
        <li class="floorF">{{item.FloorName}}</li>
        <li class="cameraQ">{{item.WebcamNum}}</li>
        <li class="btn"><a @click="getRoom(item)" v-if="$store.state.user.jurisdiction.EditDoor">查看编辑</a></li>
        </li>
      </ul>
    </div>
    <div class="bottomtools">
      <el-button type="primary" size="small" @click="openDialog" v-if="$store.state.user.jurisdiction.AddDoor">添加监舍</el-button>
      <el-pagination v-if="list.total>list.limit" background layout="prev, pager, next" :page-size="list.limit" :total="list.total" @current-change="getList" :current-page.sync="list.offset">
      </el-pagination>
    </div>
  </div>
  <!-- end .list -->


  <div v-if="dialog.show" class="model">
    <a class="bg" @click="closeDialog"></a>
    <a class="btn" @click="closeDialog"><i class="fa fa-times" aria-hidden="true"></i></a>

    <!-- end .bg -->
    <div class="modelBox  animated fadeInDown">
      <el-button v-if="dialog.createState==false && $store.state.user.jurisdiction.DeleteDoor" class="del" type="danger" round size="small" @click="delRoom">删除此监舍</el-button>
      <div class="title">
        <i></i>
        <h5>{{dialog.title}}</h5>
      </div>
      <div class="content">
        <div class="object">
          <div class="title">
            <hr>
            <span>监舍信息</span>
          </div>
          <ul class="input">
            <li><span>监舍名称:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入监区名称" v-model="dialog.roomName">
                </el-input>
              </div>
            </li>
            <li><span>监舍描述:</span>
              <div class="input">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入监舍备注" v-model="dialog.roomDescription">
                </el-input>
              </div>
            </li>
            <li><span>PLC地址:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入PLC地址" v-model="dialog.roomPlcip">
                </el-input>
              </div>
            </li>
            <li><span>所属监区:</span>
              <div class="input">
                <el-select placeholder="选择监区" size="small" @change="getFloor" v-model="dialog.prison">
                  <el-option v-for="(item, index) in dialog.prisonInfo" :key="index" :label=" item.Name" :value="item.Id">
                  </el-option>
                </el-select>
              </div>
            </li>
            <li><span>所属楼层:</span>
              <div class="input">
                <el-select placeholder="选择楼层" size="small" @change="getArt" v-model="dialog.floor">
                  <el-option v-for="(item, index) in dialog.floorInfo" :key="index" :label="item.Name" :value="item.Id">
                  </el-option>
                </el-select>
              </div>
            </li>
            <li><span>摄像头绑定:</span>
              <div class="input">
                <!-- <el-select placeholder="选择摄像头" size="small" multiple v-model="dialog.roomCamera">
                  <el-option v-for="(item, index) in dialog.cameraInfo" :key="index" :label="item.ResName" :value="item.Id">
                  </el-option>
                </el-select> -->
                <div class="tagContainer">
                  <el-tag v-for="(item,index) in cam.checked" :key="index" closable @close="handleClose(item)">
                    {{item.name}} id:{{item.id}}
                  </el-tag>
                  <el-button type="primary" size="small" @click="cam.show=true">添加摄像头</el-button>
                </div>
                <div class="inputContainer animated fadeIn" v-show="cam.show">
                  <a class="btn_close" @click="cam.show=false">隐藏</a>
                  <el-input class="search" type="text" placeholder="搜索您要找的摄像头" v-model="cam.search" clearable @change="getCameraList">
                  </el-input>
                  <ul class="list">
                    <li v-for="(item,index) in cam.list" @click="addCam(item)" :class="getCamChecked(item)">{{item.ResName}}</li>
                  </ul>
                  <el-pagination v-if="cam.total>cam.limit" layout="prev, pager, next" :page-size="cam.limit" :total="cam.total" @current-change="getCameraList" :current-page.sync="cam.offset" :pager-count="5">
                  </el-pagination>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="object">
          <div class="title">
            <hr>
            <span>排序设置</span>
          </div>
          <ul class="input">
            <li><span>排序编号:</span>
              <div class="input">
                <el-input size="medium" type="number" placeholder="请输入监舍排序编号(数字)" v-model="dialog.roomIndex">
                </el-input>
              </div>
              <span>注: 排序编号越大越后</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer">
        <el-button type="info" plain size="medium" @click="closeDialog">取消</el-button>
        <el-button type="primary" size="medium" @click="submitRoom()" :loading="this.dialog.btnLoading_submit">确定提交</el-button>
      </div>
    </div>
  </div>
  <!-- end .modeBox -->
</div>
<!-- end .model -->
</div>
</template>

<script>
export default {
  data() {
    return {
      modelShow: false,

      //list
      list: {
        data: [],
        offset: 1,
        limit: 10,
        total: 1,
        getTing: true,
        noGet: false,
      },

      //model
      dialog: {
        show: false,
        createState: true,
        btnLoading_submit: false,
        roomId: '',
        roomName: '',
        roomDescription: '',
        roomPlcip: '',
        roomArt: '',
        roomPrison: [],
        prison: '',
        prisonInfo: [],

        roomFloor: [],
        floor: '',
        floorInfo: [],

        roomCamera: [],
        camera: [],
        cameraInfo: [],
        title: '',

        roomIndex: '',
      },

      cam: {
        search: '',
        list: [],
        checked: [],
        offset: 1,
        limit: 10,
        total: 1,
        getTing: true,
        noGet: false,
        show: false,
        camId: [],
      },
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.getList();
    this.getJurisdiction();
  },
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    getJurisdiction: function() {
      if (!this.$store.state.user.jurisdiction.QueryDoor) {
        this.$message({
          message: "非法操作!您的账号权限等级不够,请检查账号或者联系管理者",
          type: 'warning'
        });
        this.$router.push('/');
      }
    },
    openDialog: function() {
      this.dialog.title = '添加监舍';
      this.dialog.show = true;
      this.getPrison();
      this.getCameraList();
    },
    closeDialog: function() {
      this.dialog.show = false;
      this.clearModel();
    },
    //获取列表
    getList: function() {
      let that = this;
      that.axios.post('/api/Door/GetDoors', {
        "limit": that.list.limit,
        "offset": that.list.offset - 1,
      }).then(function(rel) {
        console.log(rel);
        if (rel.status == 200) {
          console.log(rel);
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
    //获取监区信息
    getPrison: function() {
      let that = this;
      that.axios.get('/api/Art/GetArtTree')
        .then(function(rel) {
          console.log(rel);
          if (rel.status == 200) {
            that.dialog.prisonInfo = rel.data;
          }
        }).catch(rel => {
          console.log(rel);
        });
    },
    //获取楼层列表
    getFloor: function(val) {
      let that = this;
      that.dialog.floorInfo = [];
      that.dialog.floor = '';
      let prison = that.dialog.prisonInfo
      for (let i in prison) {
        if (prison[i].Id == val) {
          that.dialog.floorInfo = prison[i].ChildArts;
          return;
        }
      }
    },
    getArt: function(val) {
      this.dialog.roomArt = val;
    },
    //获取摄像机列表
    // getCameraList: function() {
    //   let that = this;
    //   that.axios.get('/api/Webcam/GetWebcams').then(function(rel) {
    //     console.log('获取摄像机列表');
    //     console.log(rel);
    //     that.dialog.cameraInfo = rel.data.Data;
    //   }).catch(rel => {
    //     console.log(rel);
    //   });
    // },

    getCameraList: function() {
      let that = this;
      that.axios.post('/api/Webcam/GetWebcams', {
        "limit": that.cam.limit,
        "offset": that.cam.offset - 1,
        "name": that.cam.search,
      }).then(function(rel) {
        console.log(rel)
        if (rel.data.StateCode == 200) {
          that.cam.list = rel.data.Data;
          that.cam.total = rel.data.Total;
          that.cam.getTing = false;
        }
      }).catch(rel => {
        console.log(rel)
        that.cam.getTing = false;
        that.cam.noGet = true;
        that.$message({
          message: '获取摄像头失败,请刷新',
          type: 'warning'
        });
      });
    },
    handleClose(tag) {
      this.cam.checked.splice(this.cam.checked.indexOf(tag), 1);
      console.log(this.cam.checked);
    },
    addCam(item) {
      let checked = this.cam.checked;
      console.log(item);
      console.log(checked);
      for (let i in checked) {
        if (item.Id == checked[i].id) {
          // this.$message({
          //   message: '该摄像头已添加',
          //   type: 'info'
          // });
          this.cam.checked.splice(i, 1);
          return
        }
      }
      if (checked.length <= 7) {
        checked.push({
          'id': item.Id,
          'name': item.ResName,
          'code': item.ResCode
        });
      } else {
        this.$message({
          message: '摄像头绑定最多8个',
          type: 'warning'
        });
      }
    },
    getCamChecked(item) {
      let checked = this.cam.checked;
      // console.log(checked);
      for (let i in checked) {
        if (item.Id == checked[i].id) {
          return 'active'
        }
      }
    },
    //删除摄像机
    delCamera: function() {},
    //创建监舍
    setRoom: function() {
      let that = this;
      for (let i in that.cam.checked) {
        that.cam.camId.push(that.cam.checked[i].id)
      }
      that.dialog.title = '添加监区';
      that.dialog.btnLoading_submit = true;
      that.axios.post('/api/Door/Post', {
        "Name": that.dialog.roomName,
        "Description": that.dialog.roomDescription,
        "PlcIp": that.dialog.roomPlcip,
        "ArtId": that.dialog.roomArt,
        "WebcamIds": that.cam.camId,
        "Code": that.dialog.roomIndex,
      }).then(function(rel) {
        if (rel.data.StateCode == 500) {
          that.$message({
            message: rel.data.Message,
            type: 'warning'
          });
          that.dialog.btnLoading_submit = false;
        } else if (rel.data.StateCode == 200) {
          that.$message({
            message: rel.data.Message,
            type: 'success'
          });
          that.list.offset = 1;
          that.getList();
          that.clearModel();
        }
      }).catch(rel => {
        console.log("请求失败");
        that.$message({
          message: '请求失败,请重试',
          type: 'warning'
        });
        that.dialog.btnLoading_submit = false;
      });
    },
    //提交表单
    submitRoom: function() {
      if (this.dialog.createState == true) {
        this.setRoom();
      } else {
        this.editRoom();
      }
    },
    //查看编辑监舍
    getRoom: function(item) {
      // this.getPrison();
      // this.getCameraList();
      this.openDialog();
      this.dialog.title = '编辑监舍';
      this.dialog.createState = false;
      let that = this;
      that.axios.get('/api/Door/Get?Id=' + item.Id)
        .then(function(rel) {
          if (rel.status == 200) {
            console.log(rel);
            that.dialog.prison = rel.data.BuildingId;
            that.getFloor(that.dialog.prison);
            that.dialog.floor = rel.data.FloorId;
            that.dialog.roomId = rel.data.Id;
            that.dialog.roomName = rel.data.Name;
            that.dialog.roomDescription = rel.data.Description;
            that.dialog.roomPlcip = rel.data.PlcIp;
            that.dialog.roomIndex = rel.data.Code;
            for (let i in rel.data.WebcamDtos) {
              that.cam.checked.push({
                'id': rel.data.WebcamDtos[i].Id,
                'name': rel.data.WebcamDtos[i].ResName,
                'code': rel.data.WebcamDtos[i].ResCode
              })
              that.dialog.roomCamera.push(rel.data.WebcamDtos[i].Id)
            }
          } else if (rel.status == 500) {
            console.log("请求失败");
            that.$message({
              message: '请求失败(编辑监区),请重试',
              type: 'warning'
            });
          }
        }).catch(rel => {
          console.log(rel);
        });
    },
    //操作监区
    editRoom: function() {
      let that = this;
      console.log(that.cam.camId);
      for (let i in that.cam.checked) {
        that.cam.camId.push(that.cam.checked[i].id)
      }
      console.log(that.cam.camId);
      that.dialog.btnLoading_submit = true;
      that.axios.put('/api/Door/Put', {
        "Id": that.dialog.roomId,
        "Name": that.dialog.roomName,
        "Description": that.dialog.roomDescription,
        "PlcIp": that.dialog.roomPlcip,
        "ArtId": that.dialog.floor,
        "WebcamIds": that.cam.camId,
        "Code": that.dialog.roomIndex,
      }).then(function(rel) {
        if (rel.status == 500) {
          that.$message({
            message: "请求失败,请重试",
            type: 'warning'
          });
          that.dialog.btnLoading_submit = false;
        } else if (rel.status == 200) {
          that.$message({
            message: rel.data.Message,
            type: 'success'
          });
          that.list.offset = 1;
          that.getList();
          that.clearModel();
          that.dialog.btnLoading_submit = false;
        }
      }).catch(rel => {
        console.log("请求失败");
        that.$message({
          message: '请求失败,请重试',
          type: 'warning'
        });
        that.dialog.btnLoading_submit = false;
      });
    },
    clearModel: function() {
      this.dialog.createState = true;
      this.dialog.show = false;
      this.dialog.btnLoading_submit = false;
      this.dialog.roomName = '';
      this.dialog.roomId = '';
      this.dialog.prisonName = '';
      this.dialog.roomDescription = '';
      this.dialog.roomPlcip = '';
      this.dialog.roomArt = '';
      this.dialog.prison = '';
      this.dialog.floor = '';
      this.dialog.roomPrison = [];
      this.dialog.roomFloor = [];
      this.dialog.floorInfo = [];
      this.dialog.roomCamera = [];
      this.dialog.camera = [];
      this.dialog.roomIndex = '';
      this.cam = {
        search: '',
        list: [],
        checked: [],
        offset: 1,
        limit: 10,
        total: 1,
        getTing: true,
        noGet: false,
        show: false,
        camId: [],
      };
    },
    //删除监区
    delRoom: function() {
      let that = this;
      that.dialog.btnLoading_submit = true;
      this.$prompt('请输入"delete"', '删除确定', {
        confirmButtonText: '删除此监舍',
        cancelButtonText: '取消',
      }).then(({
        value
      }) => {
        if (value == "delete") {
          that.axios.delete('/api/Door/Delete?id=' + that.dialog.roomId).then(function(rel) {
            if (rel.status == 500) {
              that.$message({
                message: "请求失败,请重试",
                type: 'warning'
              });
              that.dialog.btnLoading_submit = false;
            } else if (rel.status == 200) {
              console.log(rel);
              that.$message({
                message: rel.data.Message,
                type: 'success'
              });
              that.list.offset = 1;
              that.getList();
              that.clearModel();
              that.dialog.btnLoading_submit = false;
            }
          }).catch(rel => {
            console.log("请求失败");
            that.$message({
              message: '请求失败,请重试',
              type: 'warning'
            });
            that.dialog.btnLoading_submit = false;
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
  },
  computed: {

  },
  components: {},
}
</script>

<style lang="scss" scoped>
.name {
    width: 20%;
}
.floorF {
    width: 10%;
    text-align: center;
}
.prisonF {
    width: 10%;
    text-align: center;
}
.cameraQ {
    width: 10%;
    text-align: center;
}
.el-select {
    width: 400px;
}
.inputContainer {
    border-radius: 6px;
    border: 1px solid #ddd;
    display: flex;
    flex-flow: wrap;
    padding: 5px;
    justify-content: flex-start;
    position: relative;
    > .search {
        width: 100%;
        font-size: 14px;
        line-height: 32px;
        outline: none;
    }
    > .btn_close {
        position: absolute;
        right: -40px;
        top: 5px;
        display: block;
        width: 40px;
        height: 40px;
        background-color: #999;
        color: #fff;
        font-size: 12px;
        line-height: 40px;
        text-align: center;
        border-radius: 0 5px 5px 0;
    }
    > ul.list {
        color: #444;
        font-size: 14px;
        line-height: 32px;
        width: 100%;
        margin: 10px auto 5px;
        > li {
            background-color: #f5f5f5;
            margin-bottom: 10px;
            cursor: pointer;
            padding: 3px 15px;
            &:focus,
            &:hover {
                background-color: #ddd;
            }
            &.active {
                background-color: #409EFF;
                color: #fff;
            }
        }
    }
}
.tagContainer {
    margin-bottom: 10px;
    min-height: 32px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    > .el-button,
    > .el-tag {
        margin-right: 6px;
        margin-bottom: 6px;
    }
}
</style>
