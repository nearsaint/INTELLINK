<template>
<div class="prisons_building">
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
      <el-button type="primary" size="small" @click="openDialog" v-if="$store.state.user.jurisdiction.AddArt">添加监区</el-button>
    </div>
    <div class="title">
      <ul>
        <li class="num">序号</li>
        <li class="name">监区名称</li>
        <li class="floorQ">楼层数量</li>
        <li class="roomQ">监舍数量</li>
        <li class="btn">操作</li>
      </ul>
    </div>
    <div class="content">
      <ul v-for="(item,index) in list.data">
        <li class="num">{{(index + 1) + (list.limit * (list.offset-1))}}</li>
        <li class="name">{{item.Name}}</li>
        <li class="floorQ">{{item.FloorName}}</li>
        <li class="roomQ">{{item.DoorNum}}</li>
        <li class="btn"><a @click="getPrison(item)" v-if="$store.state.user.jurisdiction.EditArt">查看编辑</a></li>
      </ul>
    </div>
    <div class="bottomtools">
      <el-button type="primary" size="small" @click="openDialog" v-if="$store.state.user.jurisdiction.AddArt">添加监区</el-button>
      <el-pagination v-if="list.total>list.limit" background layout="total, prev, pager, next" :page-size="list.limit" :total="list.total" @current-change="getList" :current-page.sync="list.offset">
      </el-pagination>
    </div>
  </div>
  <!-- end .list -->

  <div v-if="dialog.show" class="model">
    <a class="bg" @click="closeDialog"></a>
    <a class="btn" @click="closeDialog"><i class="fa fa-times" aria-hidden="true"></i></a>

    <!-- end .bg -->
    <div class="modelBox  animated fadeInDown">
      <el-button v-if="dialog.createState==false && $store.state.user.jurisdiction.DeleteArt" class="del" type="danger" round size="small" @click="delPrison">删除此监区</el-button>
      <div class="title">
        <i></i>
        <h5>{{dialog.title}}</h5>
      </div>
      <div class="content">
        <div class="object">
          <div class="title">
            <hr>
            <span>监区信息</span>
          </div>
          <ul class="input">
            <li><span>监区ID:</span>
              <div class="input">
                <el-input size="medium" :value="dialog.prisonId" disabled>
                </el-input>
              </div>
            </li>
            <li><span>监区名称:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入监区名称" v-model="dialog.prisonName">
                </el-input>
              </div>
            </li>
            <li><span>监区描述:</span>
              <div class="input">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入监区备注" v-model="dialog.prisonDescription">
                </el-input>
              </div>
            </li>
            <li><span>摄像头绑定:</span>
              <div class="input">
                <!-- <el-select placeholder="选择摄像头" size="small" multiple v-model="dialog.roomCamera">
                  <el-option v-for="(item, index) in dialog.cameraInfo" :key="index" :label="item.ResName" :value="item.Id">
                  </el-option>
                </el-select> -->
                <div class="tagContainer">
                  <el-tag v-for="(item,index) in dialog.cam.checked" :key="index" closable @close="handleClose2(item)">
                    {{item.ResName}} id:{{item.Id}}
                  </el-tag>
                  <el-button type="primary" size="small" @click="dialog.cam.show=true">添加摄像头</el-button>
                </div>
                <div class="inputContainer2 animated fadeIn" v-show="dialog.cam.show">
                  <a class="btn_close" @click="dialog.cam.show=false">隐藏</a>
                  <el-input class="search" type="text" placeholder="搜索您要找的摄像头" v-model="cam.search" clearable @change="getCameraList">
                  </el-input>
                  <ul class="list">
                    <li v-for="(item,index) in cam.list" @click="addDialogCam(item)" :class="getDialogCamChecked(item)">{{item.ResName}}</li>
                  </ul>
                  <el-pagination v-if="cam.total>cam.limit" layout="prev, pager, next" :page-size="cam.limit" :total="cam.total" @current-change="getCameraList()" :current-page.sync="cam.offset" :pager-count="5">
                  </el-pagination>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="object">
          <div class="title">
            <hr>
            <span>楼层信息</span>
          </div>
          <ul class="input">
            <li><span>楼层管理:</span>
              <div>
                <ul class="inputBox" v-for="(item, index) in dialog.prisonFloor">
                  <!-- <li class="input">
                    <span>楼层序号</span>
                    <el-input size="medium" :value="index+1" disabled>
                    </el-input>
                  </li> -->
                  <li class="input">
                    <span>楼层ID</span>
                    <el-input size="medium" disabled v-model="item.Id">
                    </el-input>
                  </li>
                  <li class="input">
                    <span>楼层名</span>
                    <el-input size="medium" placeholder="输入楼层名" v-model="item.Name">
                    </el-input>
                  </li>
                  <li class="input">
                    <span>楼层描述</span>
                    <el-input size="medium" placeholder="输入楼层描述" v-model="item.Description">
                    </el-input>
                  </li>
                  <li class="input">
                    <span>摄像头</span>
                    <!-- <el-select placeholder="选择摄像头" size="small" multiple v-model="item.WebcamIds" style="width:100%">
                      <el-option v-for="(itemC, indexC) in dialog.cameraInfo" :key="indexC" :label="itemC.ResName" :value="itemC.Id">
                      </el-option>
                    </el-select> -->
                    <div class="tagContainer">
                      <el-tag v-for="(itemC,indexC) in item.WebcamDtos" :key="indexC" closable @close="handleClose(itemC,index)">
                        {{itemC.ResName}} id:{{itemC.Id}}
                      </el-tag>
                      <el-button type="primary" size="small" @click="openCam(item)">添加摄像头</el-button>
                    </div>
                  </li>
                </ul>
                <el-button class="btn_add" type="primary" plain @click="createFloor()">添加新楼层</el-button>
                <el-button v-show="this.dialog.prisonFloor.length!=0" class="btn_del" type="danger" size="mini" plain @click="deleteFloor" :loading="this.dialog.btnLoading_del">删除楼层</el-button>

              </div>

            </li>
          </ul>
        </div>
      </div>

      <div class="footer">
        <el-button type="info" plain size="medium" @click="closeDialog">取消</el-button>
        <el-button type="primary" size="medium" @click="submitPrison()" :loading="this.dialog.btnLoading_submit">确定提交</el-button>
      </div>
    </div>
  </div>
  <!-- end .modeBox -->

  <div class="chooseCamMask" v-show="cam.show">
    <div class="inputContainer animated fadeIn">
      <a class="btn_close" @click="closeCam">隐藏</a>
      <el-input class="search" type="text" placeholder="搜索您要找的摄像头" v-model="cam.search" clearable @change="getCameraList">
      </el-input>
      <ul class="list">
        <li v-for="(item,index) in cam.list" @click="addCam(item)" :class="getCamChecked(item)">{{item.ResName}}</li>
      </ul>
      <el-pagination v-if="cam.total>cam.limit" layout="prev, pager, next" :page-size="cam.limit" :total="cam.total" @current-change="getCameraList" :current-page.sync="cam.offset" :pager-count="5">
      </el-pagination>
    </div>
    <div class="mark"></div>
  </div>
</div>
<!-- end .model -->
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

      //model
      dialog: {
        show: false,
        createState: true,
        btnLoading_submit: false,
        btnLoading_del: false,
        prisonId: '',
        prisonName: '',
        prisonDescription: '',
        prisonFloor: [],
        prisonCamId: [],
        prisonCamDots: [],
        title: '',
        cameraInfo: [],
        camera: [],

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
    this.getCameraList();
    this.getJurisdiction();
  },
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    openDialog: function() {
      this.dialog.title = '添加监区';
      this.dialog.show = true;
    },
    closeDialog: function() {
      this.dialog.show = false;
      this.clearModel();
      this.cam.show = false
    },
    createFloor: function() {
      this.dialog.prisonFloor.push({
        'Name': '',
        'Description': '',
        'WebcamIds': [],
        'WebcamDtos': [],
      });
    },
    clearModel: function() {
      this.dialog.createState = true;
      this.dialog.show = false;
      this.dialog.btnLoading_submit = false;
      this.dialog.prisonId = '';
      this.dialog.prisonName = '';
      this.dialog.prisonDescription = '';
      this.dialog.prisonFloor = [];
      this.dialog.prisonCamDots = [];
      this.dialog.prisonCamId = [];
      this.dialog.cam = {
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
      this.cam.show = false;
      this.cam.checked = [];
    },

    //获取列表
    getList: function() {
      let that = this;
      that.axios.post('/api/Art/GetArts', {
        "limit": that.list.limit,
        "offset": that.list.offset - 1,
      }).then(function(rel) {
        console.log(rel)
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
    openCam: function(item) {
      console.log(item);
      console.log(this.cam.list);
      this.cam.show = true;
      if (item.WebcamDtos) {
        this.cam.checked = item.WebcamDtos;
      } else {
        this.cam.checked = [];
      }

    },
    closeCam: function() {
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
      }
      this.getCameraList();
    },
    handleClose(tag, index) {
      console.log(this.dialog.prisonFloor[index]);
      this.dialog.prisonFloor[index].WebcamDtos.splice(this.dialog.prisonFloor[index].WebcamDtos.indexOf(tag), 1);
    },
    handleClose2(tag) {
      this.dialog.cam.checked.splice(this.dialog.cam.checked.indexOf(tag), 1);
      console.log(this.dialog.cam.checked);
    },
    addCam(item) {
      let checked = this.cam.checked;
      console.log(item);
      console.log(checked);
      for (let i in checked) {
        if (item.Id == checked[i].Id) {
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
          'Id': item.Id,
          'ResName': item.ResName,
          'ResCode': item.ResCode
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
        if (item.Id == checked[i].Id) {
          return 'active'
        }
      }
    },
    addDialogCam(item) {
      let checked = this.dialog.cam.checked;
      console.log(item);
      console.log(checked);
      for (let i in checked) {
        if (item.Id == checked[i].Id) {
          // this.$message({
          //   message: '该摄像头已添加',
          //   type: 'info'
          // });
          this.dialog.cam.checked.splice(i, 1);
          return
        }
      }
      if (checked.length <= 7) {
        checked.push({
          'Id': item.Id,
          'ResName': item.ResName,
          'ResCode': item.ResCode
        });
      } else {
        this.$message({
          message: '摄像头绑定最多8个',
          type: 'warning'
        });
      }
    },
    getDialogCamChecked(item) {
      let checked = this.dialog.cam.checked;
      // console.log(checked);
      for (let i in checked) {
        if (item.Id == checked[i].Id) {
          return 'active'
        }
      }
    },
    //获取摄像机列表
    getCameraList: function(e) {
      let that = this;
      if (e == 14) {
        that.axios.post('/api/Webcam/GetWebcams', {
          "limit": that.cam.limit,
          "offset": that.dialog.cam.offset - 1,
          "name": that.cam.search,
        }).then(function(rel) {
          console.log(rel)
          if (rel.data.StateCode == 200) {
            that.cam.list = rel.data.Data;
            that.dialog.cam.total = rel.data.Total;
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
      } else {
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
      }
    },
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

    //创建监区
    setPrison: function() {
      let that = this;
      that.dialog.title = '添加监区';
      that.dialog.btnLoading_submit = true;
      console.log(that.dialog.prisonFloor);
      let prisonFloor = that.dialog.prisonFloor
      for (let i in prisonFloor) {
        let WebcamDtos = that.dialog.prisonFloor[i].WebcamDtos;
        let WebcamIds = that.dialog.prisonFloor[i].WebcamIds;
        for (let n in WebcamDtos) {
          WebcamIds.push(WebcamDtos[n].Id);
        }
      }

      for (let n in that.dialog.cam.checked) {
        that.dialog.prisonCamId.push(that.dialog.cam.checked[n].Id)
      }
      console.log(that.dialog.prisonCamId);
      that.axios.post('/api/Art/Post', {
        "Name": that.dialog.prisonName,
        "Description": that.dialog.prisonDescription,
        "ChildArts": that.dialog.prisonFloor,
        "WebcamIds": that.dialog.prisonCamId,
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

    //操作监区
    editPrison: function() {
      let that = this;
      // console.log(that.dialog.prisonFloor);
      let prisonFloor = that.dialog.prisonFloor
      for (let i in prisonFloor) {
        let WebcamDtos = that.dialog.prisonFloor[i].WebcamDtos;
        let WebcamIds = that.dialog.prisonFloor[i].WebcamIds;
        for (let n in WebcamDtos) {
          WebcamIds.push(WebcamDtos[n].Id);
        }
      }

      console.log(that.dialog.cam.checked);
      for (let n in that.dialog.cam.checked) {
        that.dialog.prisonCamId.push(that.dialog.cam.checked[n].Id)
      }
      console.log(that.dialog.prisonCamId);
      that.dialog.btnLoading_submit = true;
      that.axios.put('/api/Art/Put', {
        "Id": that.dialog.prisonId,
        "Name": that.dialog.prisonName,
        "Description": that.dialog.prisonDescription,
        "ChildArts": that.dialog.prisonFloor,
        "WebcamIds": that.dialog.prisonCamId,
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

    //查看编辑监区
    getPrison: function(item) {
      this.openDialog();
      this.dialog.title = '编辑监区';
      this.dialog.createState = false;
      let that = this;
      that.axios.get('/api/Art/Get?Id=' + item.Id)
        .then(function(rel) {
          console.log('查看监区:');
          console.log(rel);
          if (rel.status == 200) {
            that.dialog.prisonId = rel.data.Id;
            that.dialog.prisonName = rel.data.Name;
            that.dialog.prisonDescription = rel.data.Description;
            that.dialog.prisonFloor = rel.data.ChildArts;
            that.dialog.prisonCamId = rel.data.WebcamIds;
            that.dialog.prisonCamDots = rel.data.WebcamDtos;
            for (let i in rel.data.WebcamDtos) {
              that.dialog.cam.checked.push({
                'Id': rel.data.WebcamDtos[i].Id,
                'ResName': rel.data.WebcamDtos[i].ResName,
                'ResCode': rel.data.WebcamDtos[i].ResCode
              })
            }
            console.log(that.dialog.prisonFloor);
          } else {
            console.log("请求失败");
            that.$message({
              message: '请求失败,请重试',
              type: 'warning'
            });
          }
        }).catch(rel => {
          console.log("请求失败");
          that.$message({
            message: '请求失败,请重试',
            type: 'warning'
          });
        });
    },

    //提交表单
    submitPrison: function() {
      if (this.dialog.createState == true) {
        this.setPrison();
      } else {
        this.editPrison();
      }
    },

    //删除监区
    delPrison: function() {
      let that = this;
      that.dialog.btnLoading_submit = true;
      this.$prompt('请输入"delete"', '删除确定', {
        confirmButtonText: '删除此监舍',
        cancelButtonText: '取消',
      }).then(({
        value
      }) => {
        if (value == "delete") {
          that.axios.delete('/api/Art/Delete?id=' + that.dialog.prisonId).then(function(rel) {
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
    //删除楼层
    deleteFloor: function() {
      let that = this;
      // that.dialog.btnLoading_del = true;
      this.$prompt('请输入"delete"', '删除确定', {
        confirmButtonText: '删除此楼层',
        cancelButtonText: '取消',
      }).then(({
        value
      }) => {
        if (value == "delete") {
          let i = that.dialog.prisonFloor.length - 1;
          let id = that.dialog.prisonFloor[i].Id;
          console.log(id);
          that.axios.delete('/api/Art/Delete?id=' + id).then(function(rel) {
            if (rel.status == 500) {
              that.$message({
                message: "请求失败,请重试",
                type: 'warning'
              });
              that.dialog.btnLoading_del = false;
            } else if (rel.status == 200) {
              let last = that.dialog.prisonFloor.pop();
              that.dialog.btnLoading_del = false;
            }
          }).catch(rel => {
            console.log(rel);
            that.$message({
              message: '请求失败,请重试',
              type: 'warning'
            });
            that.dialog.btnLoading_del = false;
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

    getJurisdiction: function() {
      if (!this.$store.state.user.jurisdiction.QueryArt) {
        this.$message({
          message: "非法操作!您的账号权限等级不够,请检查账号或者联系管理者",
          type: 'warning'
        });
        this.$router.push('/');
      }
    },
  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.name {
    width: 20%;
}
.floorQ {
    width: 10%;
    text-align: center;
}
.roomQ {
    width: 10%;
    text-align: center;
}

.chooseCamMask {
    position: fixed;
    background-color: rgba(0,0,0,0.5);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    z-index: 9999;
    > .inputContainer {
        width: 500px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        background-color: #fff;
        border: 1px solid #ddd;
        display: flex;
        flex-flow: wrap;
        padding: 5px;
        justify-content: flex-start;
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
}
.tagContainer {
    margin-bottom: 10px;
    min-height: 32px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    > .el-tag,
    > .el-button {
        margin-right: 6px;
        margin-bottom: 6px;
    }
}
.inputContainer2 {
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
</style>
