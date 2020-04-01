<template>
<div class="roles">
  <div class="titleContainer">
    <span></span>
    <h5>角色管理</h5>
  </div>
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
      <el-button type="primary" size="small" @click="openDialog" v-if="$store.state.user.jurisdiction.AddRole">添加角色</el-button>
    </div>
    <div class="title">
      <ul>
        <li class="num">序号</li>
        <li class="name">角色名称</li>
        <li class="description">角色描述</li>
        <li class="btn">操作</li>
      </ul>
    </div>
    <div class="content">
      <ul v-for="(item,index) in list.data">
        <li class="num">{{(index + 1) + (list.limit * (list.offset-1))}}</li>
        <li class="name">{{item.RoleName}}</li>
        <li class="description">{{item.Description}}</li>
        <li class="btn">
          <a class="btn_role" @click="openModel(item)" v-if="$store.state.user.jurisdiction.AuthorizeRole">设置权限</a>
          <a @click="getRole(item)" v-if="$store.state.user.jurisdiction.UpdateRole">查看编辑</a></li>
      </ul>
    </div>
    <div class="bottomtools">
      <el-button type="primary" size="small" @click="openDialog" v-if="$store.state.user.jurisdiction.AddRole">添加角色</el-button>
      <el-pagination v-if="list.total>list.limit" background layout="total, prev, pager, next" :page-size="list.limit" :total="list.total" :current-page.sync="list.offset" @current-change="getList">
      </el-pagination>
    </div>
  </div>
  <!-- end .list -->

  <div v-if="dialog.show" class="model">
    <a class="bg" @click="closeDialog"></a>
    <a class="btn" @click="closeDialog"><i class="fa fa-times" aria-hidden="true"></i></a>

    <!-- end .bg -->
    <div class="modelBox  animated fadeInDown">
      <el-button v-if="dialog.createState==false && $store.state.user.jurisdiction.DeleteRole" class="del" type="danger" round size="small" @click="delRole">删除此角色</el-button>
      <div class="title">
        <i></i>
        <h5>{{dialog.title}}</h5>
      </div>
      <div class="content">
        <div class="object">
          <div class="title">
            <hr>
            <span>角色信息</span>
          </div>
          <ul class="input">
            <li v-show="dialog.createState==false"><span>角色ID:</span>
              <div class="input">
                <el-input size="medium" :value="dialog.roleId" disabled>
                </el-input>
              </div>
            </li>
            <li><span>角色名称:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入角色名称" v-model="dialog.roleName">
                </el-input>
              </div>
            </li>
            <li><span>角色描述:</span>
              <div class="input">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入角色备注" v-model="dialog.roleDescription">
                </el-input>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer">
        <el-button type="info" plain size="medium" @click="closeDialog">取消</el-button>
        <el-button type="primary" size="medium" :loading="this.dialog.btnLoading_submit" @click="submitRole()">确定提交</el-button>
      </div>
    </div>
  </div>
  <div v-show="model.show" class="model">
    <a class="bg" @click="closeModel"></a>
    <a class="btn" @click="closeModel"><i class="fa fa-times" aria-hidden="true"></i></a>
    <div class="modelBox  animated fadeInDown">
      <div class="title">
        <i></i>
        <h5>编辑权限 - {{model.title}}</h5>
      </div>
      <div class="content">
        <div class="object">
          <div class="title">
            <hr>
            <span>模块权限信息</span>
          </div>
          <ul class="input">
            <li>
              <ul id="treeOne" class="treeOne ztree">
                <h5>无数据</h5>
              </ul>
            </li>
          </ul>
        </div>
        <div class="object">
          <div class="title">
            <hr>
            <span>监舍开门权限信息</span>
          </div>
          <ul class="input">
            <li>
              <ul id="treeTwo" class="treeTwo ztree">
                <h5>无数据</h5>
              </ul>
            </li>
          </ul>
        </div>
        <div class="object">
          <div class="title">
            <hr>
            <span>监区权限信息</span>
          </div>
          <ul class="input">
            <li>
              <ul id="treeThree" class="treeThree ztree">
                <h5>无数据</h5>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer ">
        <el-button type="info " plain size="medium " @click="closeModel">取消</el-button>
        <el-button type="primary " size="medium " :loading="this.model.btnLoading_submit " @click="setRole() ">确定提交</el-button>
      </div>
    </div>
  </div>
  <!-- end .modeBox -->
</div>
<!-- end .model -->
</template>

<script>
// import jQuery
import $ from 'jquery'
// import ztree
import 'assets/styles/plugin/zTreeStyle/zTreeStyle.css'
import 'assets/scripts/plugin/ztree/jquery.ztree.core.min.js'
import 'assets/scripts/plugin/ztree/jquery.ztree.excheck.min.js'

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
        roleId: '',
        roleName: '',
        roleDescription: '',
        title: '',
      },
      model: {
        id: '',
        show: false,
        title: '',
        tree: '',
        btnLoading_submit: false,
        setting: {
          check: {
            enable: true
          },
          data: {
            simpleData: {
              enable: true
            }
          }
        },
        ModulePermission: [],
        DoorPermission: [],
        ArtPermission: [],
      },
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.getList();
    this.getJurisdiction();
  },
  mounted: function() {


  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    getJurisdiction: function() {
      if (!this.$store.state.user.jurisdiction.QueryRole) {
        this.$message({
          message: "非法操作!您的账号权限等级不够,请检查账号或者联系管理者",
          type: 'warning'
        });
        this.$router.push('/');
      }
    },
    openDialog: function() {
      this.dialog.title = '添加角色';
      this.dialog.show = true;
    },
    closeDialog: function() {
      this.dialog.show = false;
      this.clearModel();
    },
    clearModel: function() {
      this.dialog.createState = true;
      this.dialog.show = false;
      this.dialog.btnLoading_submit = false;
      this.dialog.roleId = '';
      this.dialog.roleName = '';
      this.dialog.roleDescription = '';
      this.dialog.title = '';
    },
    clearModel_2: function() {
      this.model.show = false;
      this.model.tree = '';
      this.model.title = '';
      this.model.id = '';
      this.model.ModulePermission = [];
      this.model.DoorPermission = [];
      this.model.ArtPermission = [];
      this.model.btnLoading_submit = false;
    },
    openModel: function(item) {
      console.log(item);
      this.model.show = true;
      this.model.title = item.RoleName;
      this.model.id = item.Id;
      this.getTree(item.Id);
    },
    closeModel: function() {
      this.clearModel_2();
      $.fn.zTree.destroy();
    },
    //获取列表
    getList: function() {
      let that = this;
      that.axios.post('/api/role/getRoles', {
        "limit": that.list.limit,
        "offset": that.list.offset - 1,
      }).then(function(rel) {
        if (rel.status == 200) {
          console.log(rel);
          that.list.data = rel.data.rows;
          that.list.total = rel.data.total;
          that.list.getTing = false;
        }
      }).catch(rel => {
        console.log(rel);
        that.list.getTing = false;
        that.list.noGet = true;
        that.$message({
          message: '获取列表失败,请刷新',
          type: 'warning'
        });
      });
    },
    //创建角色
    addRole: function() {
      let that = this;
      that.dialog.title = '添加角色';
      that.dialog.btnLoading_submit = true;
      that.axios.post('/api/role/create', {
        "RoleName": that.dialog.roleName,
        "Description": that.dialog.roleDescription,
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
        console.log(rel);
        that.$message({
          message: '新建角色失败,请重试',
          type: 'warning'
        });
        that.dialog.btnLoading_submit = false;
      });
    },
    //查看编辑
    getRole: function(item) {
      this.openDialog();
      this.dialog.title = '编辑角色';
      this.dialog.createState = false;
      let that = this;
      that.axios.get('/api/role/get?Id=' + item.Id)
        .then(function(rel) {
          console.log('查看角色:');
          console.log(rel);
          if (rel.status == 200) {
            that.dialog.roleId = rel.data.Id;
            that.dialog.roleName = rel.data.RoleName;
            that.dialog.roleDescription = rel.data.Description;
          } else {
            that.$message({
              message: '获取角色失败,请重试',
              type: 'warning'
            });
          }
        }).catch(rel => {
          console.log(rel);
          that.$message({
            message: '获取角色失败,请重试',
            type: 'warning'
          });
        });
    },
    //操作角色
    editRole: function() {
      let that = this;
      that.dialog.btnLoading_submit = true;
      that.axios.put('/api/role/edit', {
        "Id": that.dialog.roleId,
        "RoleName": that.dialog.roleName,
        "Description": that.dialog.roleDescription,
      }).then(function(rel) {
        if (rel.status == 500) {
          that.$message({
            message: "修改角色失败,请重试",
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
        console.log(rel);
        that.$message({
          message: '修改角色失败,请重试',
          type: 'warning'
        });
        that.dialog.btnLoading_submit = false;
      });
    },
    //提交表单
    submitRole: function() {
      if (this.dialog.createState == true) {
        this.addRole();
      } else {
        this.editRole();
      }
    },
    //删除角色
    delRole: function() {
      let that = this;
      that.dialog.btnLoading_submit = true;
      this.$prompt('请输入"delete"', '删除确定', {
        confirmButtonText: '删除此角色',
        cancelButtonText: '取消',
      }).then(({
        value
      }) => {
        if (value == "delete") {
          that.axios.delete('/api/role/delete?id=' + that.dialog.roleId).then(function(rel) {
            if (rel.status == 500) {
              that.$message({
                message: "删除角色失败,请重试",
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
            console.log(rel);
            that.$message({
              message: '删除角色失败,请重试',
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
    //获取权限树
    getTree: function(id) {
      let that = this;
      that.axios.get('/api/role/GetPermission?Id=' + id)
        .then(function(rel) {
          if (rel.status == 200) {
            console.log('获取权限树');
            console.log(rel);
            that.ceartTree(rel.data.ModulePermission, rel.data.DoorPermission, rel.data.ArtPermission);
          }
        }).catch(rel => {
          console.log(rel);
          that.$message({
            message: '获取权限树失败,请刷新',
            type: 'warning'
          });
        });
    },
    //创建树
    ceartTree: function(dataOne, dataTwo, dataThree) {
      console.log(dataOne, dataTwo, dataThree);
      let treeOne = $("#treeOne");
      let treeTwo = $("#treeTwo");
      let treeThree = $("#treeThree");
      treeOne = $.fn.zTree.init(treeOne, this.model.setting, dataOne);
      treeTwo = $.fn.zTree.init(treeTwo, this.model.setting, dataTwo);
      treeThree = $.fn.zTree.init(treeThree, this.model.setting, dataThree);
    },
    //获取选中
    getChecked: function() {
      let that = this;
      let treeOneObj = $.fn.zTree.getZTreeObj("treeOne");
      let treeTwoObj = $.fn.zTree.getZTreeObj("treeTwo");
      let treeThreeObj = $.fn.zTree.getZTreeObj("treeThree");
      let treeOneChecked = treeOneObj.getCheckedNodes(true);
      let treeTwoChecked = treeTwoObj.getCheckedNodes(true);
      let treeThreeChecked = treeThreeObj.getCheckedNodes(true);
      console.log(treeOneObj);
      console.log(treeTwoObj);
      console.log(treeThreeObj);
      console.log(treeOneChecked);
      console.log(treeTwoChecked);
      console.log(treeThreeChecked);
      for (let ione = 0; ione < treeOneChecked.length; ione++) {
        if (!treeOneChecked[ione].hasOwnProperty('isParent')) {
          that.model.ModulePermission.push(treeOneChecked[ione].id);
        }
      }
      for (let itwo = 0; itwo < treeTwoChecked.length; itwo++) {
        if (!treeTwoChecked[itwo].hasOwnProperty('isParent')) {
          that.model.DoorPermission.push(treeTwoChecked[itwo].id);
        }
      }
      for (let ithree = 0; ithree < treeThreeChecked.length; ithree++) {
        if (!treeThreeChecked[ithree].hasOwnProperty('isParent')) {
          that.model.ArtPermission.push(treeThreeChecked[ithree].id);
        }
      }
      console.log(this.model.ModulePermission);
      console.log(this.model.DoorPermission);
      console.log(this.model.ArtPermission);

    },
    //编辑权限
    setRole: function() {
      this.getChecked();
      let that = this;
      that.model.btnLoading_submit = true;
      console.log(that.model.ModulePermission, that.model.DoorPermission);
      that.axios.post('/api/role/Authorize', {
        "Id": that.model.id,
        "ModulePermission": that.model.ModulePermission,
        "DoorPermission": that.model.DoorPermission,
        "ArtPermission": that.model.ArtPermission,
      }).then(function(rel) {
        console.log(rel);
        if (rel.data.StateCode == 500) {
          that.$message({
            message: rel.data.Message,
            type: 'warning'
          });
          that.model.btnLoading_submit = false;
        } else if (rel.data.StateCode == 200) {
          that.$message({
            message: rel.data.Message,
            type: 'success'
          });
          that.list.offset = 1;
          that.getList();
          that.clearModel_2();
        }
      }).catch(rel => {
        console.log(rel);
        that.$message({
          message: '编辑权限失败,请重试',
          type: 'warning'
        });
        that.model.btnLoading_submit = false;
      });
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
.description {
    width: 40%;
}
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
.ztree {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 5px;
    border: 1px solid #ddd;
    min-height: 200px;
    width: 100%;
    overflow: hidden;
    > h5 {
        line-height: 200px;
        text-align: center;
        font-size: 16px;
        color: #ccc;
    }
}
.getTing,
.noGet {
    height: calc(100% - 72px);
}
</style>
