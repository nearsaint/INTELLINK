<template>
<div class="polices">
  <div class="titleContainer">
    <span></span>
    <h5>警员管理</h5>
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
      <el-button type="primary" size="small" @click="openModel" v-if="$store.state.user.jurisdiction.AddRole">添加警员</el-button>
    </div>
    <div class="title">
      <ul>
        <li class="num">序号</li>
        <li class="avarat">头像</li>
        <li class="name">账号</li>
        <li class="name">姓名</li>
        <li class="station">职务</li>
        <li class="persontype">类型</li>
        <li class="phone">手机</li>
        <li class="btn">操作</li>
      </ul>
    </div>
    <div class="content">
      <ul v-for="(item,index) in list.data">
        <li class="num">{{(index + 1) + (list.limit * (list.offset-1))}}</li>
        <!-- 图片地址修改  -->
        <li class="avarat"><i :style="'background-image:url('+ imgUrlHost + item.ImgUrl+')'"></i></li>
        <!-- 图片地址修改  -->
        <li class="name">{{item.UserName}}</li>
        <li class="name">{{item.TrueName}}</li>
        <li class="station">{{item.Station}}</li>
        <li class="persontype">{{personType(item.PersonType)}}</li>
        <li class="phone">{{item.Phone}}</li>
        <li class="btn">
          <a class="btn_role" @click="openModel_role(item)" v-if="$store.state.user.jurisdiction.AuthorizeUser">授权</a>
          <a @click="openModel_edit(item)" v-if="$store.state.user.jurisdiction.UpdateUser">查看编辑</a></li>
      </ul>
    </div>
    <div class="bottomtools">
      <el-button type="primary" size="small" @click="openModel" v-if="$store.state.user.jurisdiction.AddUser">添加警员</el-button>
      <el-pagination v-if="list.total>list.limit" background layout="total, prev, pager, next" :page-size="list.limit" :total="list.total" @current-change="getList" :current-page.sync="list.offset">
      </el-pagination>
    </div>
  </div>
  <!-- end .list -->

  <div v-show="model.show" class="model">
    <a class="bg" @click="closeModel"></a>
    <a class="btn" @click="closeModel"><i class="fa fa-times" aria-hidden="true"></i></a>
    <div class="modelBox  animated fadeInDown">
      <el-button v-if="model.createState==false && $store.state.user.jurisdiction.DeleteUser" class="del" type="danger" round size="small" @click="delPolice">删除此警员</el-button>
      <div class="title">
        <i></i>
        <h5>{{model.title}}</h5>
      </div>
      <div class="content">
        <div class="object">
          <div class="title">
            <hr>
            <span>账号信息</span>
          </div>
          <ul class="input">
            <li v-show="model.createState==false"><span>账号ID:</span>
              <div class="input">
                <el-input size="medium" :value="model.input.id" disabled>
                </el-input>
              </div>
            </li>
            <li><span>账号:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入您的账号" v-model="model.input.username" :disabled="model.createState==false">
                </el-input>
              </div>
            </li>
            <li><span>打卡限制:</span>
              <div class="input">
                <el-checkbox v-model="model.input.enabled">限制值班时间内打卡</el-checkbox>
              </div>
            </li>
            <li><span>登陆限制:</span>
              <div class="input">
                <el-select v-model="model.input.ip" multiple placeholder="请选择登陆地址">
                  <el-option v-for="(item,index) in model.ipList" :key="index" :label="item.IP" :value="item.Id">
                  </el-option>
                </el-select>
              </div>
            </li>
            <li v-if="model.createState==false && $store.state.user.jurisdiction.ResetPwdUser"><span>密码:</span>
              <div class="input" v-show="model.createState==true">
                <el-input size="medium" placeholder="默认密码'123456'" disabled>
                </el-input>
              </div>
              <el-checkbox v-show="model.createState==false" v-model="model.input.reSetPassword">重置密码</el-checkbox>
            </li>
          </ul>
        </div>
        <div class="object">
          <div class="title">
            <hr>
            <span>用户信息</span>
          </div>
          <ul class="input">
            <li><span>姓名:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入您的姓名" v-model="model.input.truename" :disabled="model.createState==false">
                </el-input>
              </div>
            </li>
            <li><span>头像:</span>
              <div class="input">
                <el-upload class="avatar-uploader" action="/api/User/UploadImg" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                  <img v-if="model.input.imgurl" :src="imgUrlHost+model.input.imgurl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </li>
          </ul>
        </div>
        <div class="object">
          <div class="title">
            <hr>
            <span>联系信息</span>
          </div>
          <ul class="input">
            <li><span>手机:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入警员手机" v-model="model.input.phone">
                </el-input>
              </div>
            </li>
          </ul>
        </div>
        <div class="object">
          <div class="title">
            <hr>
            <span>其他信息</span>
          </div>
          <ul class="input">
            <li><span>职务:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入警员职务" v-model="model.input.station">
                </el-input>
              </div>
            </li>
            <li><span>单位:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入单位" v-model="model.input.unit">
                </el-input>
              </div>
            </li>
            <li><span>类型:</span>
              <div class="input">
                <el-select size="medium" v-model="model.input.personType" placeholder="请选择警员类型">
                  <el-option key="0" label="警员" :value="0">
                  </el-option>
                  <el-option key="1" label="职工" :value="1">
                  </el-option>
                </el-select>
              </div>
            </li>
            <li><span>备注:</span>
              <div class="input">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入备注" v-model="model.input.description">
                </el-input>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer ">
        <el-button type="info " plain size="medium " @click="closeModel">取消</el-button>
        <el-button type="primary " size="medium " :loading="this.model.btnLoading_submit " @click="submitModel">确定提交</el-button>
      </div>
    </div>
  </div>
  <div v-show="model2.show" class="model">
    <a class="bg" @click="closeModel2"></a>
    <a class="btn" @click="closeModel2"><i class="fa fa-times" aria-hidden="true"></i></a>
    <div class="modelBox  animated fadeInDown">
      <div class="title">
        <i></i>
        <h5>授权 - {{model2.title}}</h5>
      </div>
      <div class="content">
        <div class="object">
          <div class="title">
            <hr>
            <span>警员信息</span>
          </div>
          <ul class="input">
            <li><span>用户ID:</span>
              <div class="input">
                <el-input size="medium" v-model="model2.input.id" disabled>
                </el-input>
              </div>
            </li>
            <li><span>姓名:</span>
              <div class="input">
                <el-input size="medium" v-model="model2.input.username" disabled>
                </el-input>
              </div>
            </li>
          </ul>
        </div>
        <div class="object">
          <div class="title">
            <hr>
            <span>权限角色</span>
          </div>
          <ul class="input">
            <li><span>选择角色:</span>
              <div class="input">
                <el-checkbox-group v-model="model2.input.roleChecked" @change="getChecked" size="small">
                  <el-checkbox border v-for="(item,index) in model2.input.roleList" :label="item.Value" :checked="item.IsChecked">{{item.Description}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </li>

          </ul>
        </div>
      </div>
      <div class="footer ">
        <el-button type="info " plain size="medium " @click="closeModel2">取消</el-button>
        <el-button type="primary " size="medium " :loading="this.model2.btnLoading_submit " @click="submitModel2">确定提交</el-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      modelShow: false,
      imgUrlHost: 'http://10.43.63.55:5001',
      //list
      list: {
        data: [],
        offset: 1,
        limit: 10,
        total: 1,
        getTing: true,
        noGet: false,
      },
      model: {
        show: false,
        title: '',
        btnLoading_submit: false,
        createState: true,
        ipList: [],
        input: {
          id: '',
          username: '',
          truename: '',
          reSetPassword: false,

          imgurl: '',
          img: '',

          phone: '',
          unit: '',
          station: '',
          personType: '',
          description: '',

          enabled: '',
          ip: [],
        },
      },

      model2: {
        show: false,
        title: '',
        btnLoading_submit: false,
        input: {
          id: '',
          username: '',
          roleList: [],
          roleChecked: [],
        },
      },
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.getJurisdiction();
    this.getIpList();
  },
  mounted: function() {
    this.getList();
  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    openModel: function() {
      this.model.show = true;
      this.model.title = '添加警员';
    },
    closeModel: function() {
      this.clearModel();
    },
    clearModel: function() {
      this.model.show = false;
      this.model.title = '';
      this.model.btnLoading_submit = false;
      this.model.createState = true;
      this.model.input = {
        id: '',
        username: '',
        truename: '',
        reSetPassword: false,
        imgurl: '',
        phone: '',
        unit: '',
        station: '',
        personType: '',
        description: '',
        img: '',
        enabled: '',
        ip: [],
      };
    },

    openModel2: function() {
      this.model2.show = true;
    },
    closeModel2: function() {
      this.clearModel2();
    },
    clearModel2: function() {
      this.model2.show = false;
      this.model2.title = '';
      this.model2.btnLoading_submit = false;
      this.model2.input = {
        id: '',
        username: '',
        roleList: [],
        roleChecked: [],
      };
    },
    handleAvatarSuccess: function(res, file) {
      // console.log(res);
      // console.log(file);
      this.model.input.img = URL.createObjectURL(file.raw);
      this.model.input.imgurl = res;
    },
    beforeAvatarUpload: function(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },

    submitModel: function() {
      if (this.model.createState == true) {
        this.addPolice();
      } else {
        this.editPolice();
      }
    },
    addPolice: function() {
      let that = this;
      let reg = /^[0-9a-zA-Z]+$/;

      if (that.model.input.username == '') {
        that.$message({
          message: '请填写登陆账号',
          type: 'warning'
        });
        return
      } else if (!reg.test(that.model.input.username)) {
        that.$message({
          message: '登陆账号必须是字母或者数字',
          type: 'warning'
        });
        return
      } else if (that.model.input.truename == '') {
        that.$message({
          message: '请填写用户姓名',
          type: 'warning'
        });
        return
      } else {
        that.model.title = '添加警员';
        that.model.btnLoading_submit = true;
        that.axios.post('/api/user/create', {
          "UserName": that.model.input.username,
          "Phone": that.model.input.phone,
          "Unit": that.model.input.unit,
          "PersonType": that.model.input.personType,
          "Station": that.model.input.station,
          "ImgUrl": that.model.input.imgurl,
          "Description": that.model.input.description,
          "Enabled": that.model.input.enabled,
          "IPIds": that.model.input.ip,
          "TrueName": that.model.input.truename
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
            that.clearModel();
          }
        }).catch(rel => {
          console.log(rel);
          that.$message({
            message: '新建警员失败,请重试',
            type: 'warning'
          });
          that.model.btnLoading_submit = false;
        });
      }

    },
    editPolice: function() {
      let that = this;
      that.model.btnLoading_submit = true;
      that.axios.put('/api/user/edit', {
        "Id": that.model.input.id,
        "UserName": that.model.input.username,
        "TrueName": that.model.input.truename,
        "ImgUrl": that.model.input.imgurl,
        "Phone": that.model.input.phone,
        "Unit": that.model.input.unit,
        "Station": that.model.input.station,
        "Description": that.model.input.description,
        "PersonType": that.model.input.personType,
        "IsReset": that.model.input.reSetPassword,
        "Enabled": that.model.input.enabled,
        "IPIds": that.model.input.ip
      }).then(function(rel) {
        if (rel.status == 500) {
          that.$message({
            message: "修改警员失败,请重试",
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
          that.clearModel();
        }
      }).catch(rel => {
        console.log(rel);
        that.$message({
          message: '修改警员失败,请重试',
          type: 'warning'
        });
        that.model.btnLoading_submit = false;
      });
    },
    //删除角色
    delPolice: function() {
      let that = this;
      that.model.btnLoading_submit = true;
      this.$prompt('请输入"delete"', '删除确定', {
        confirmButtonText: '删除此警员',
        cancelButtonText: '取消',
      }).then(({
        value
      }) => {
        if (value == "delete") {
          that.axios.delete('/api/user/delete?id=' + that.model.input.id).then(function(rel) {
            if (rel.status == 500) {
              that.$message({
                message: "删除警员失败,请重试",
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
              that.clearModel();
            }
          }).catch(rel => {
            console.log(rel);
            that.$message({
              message: '删除警员失败,请重试',
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
    //打开编辑
    openModel_edit: function(item) {
      console.log("获取警员参数");
      console.log(item);
      this.openModel();
      this.model.createState = false;
      this.model.title = '编辑警员' + item.UserName;
      this.model.btnLoading_submit = false;
      this.model.input.id = item.Id;
      this.model.input.username = item.UserName;
      this.model.input.truename = item.TrueName;
      this.model.input.imgurl = item.ImgUrl;
      this.model.input.phone = item.Phone;
      this.model.input.unit = item.Unit;
      this.model.input.station = item.Station;
      this.model.input.personType = item.PersonType;
      this.model.input.description = item.Description;
      this.model.input.enabled = item.Enabled;
      this.model.input.ip = item.IPIds;
    },
    //获取列表
    getList: function() {
      let that = this;
      that.axios.post('/api/user/getUsers', {
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

    //返回职务
    personType: function(i) {
      if (i == 0) {
        return '警员';
      } else if (i == 1) {
        return '职员';
      }
    },

    //授权
    getRole: function(id) {
      let that = this;
      that.axios.get('/api/user/getUserRoles?Id=' + id)
        .then(function(rel) {
          if (rel.status == 200) {
            console.log('获取警员权限');
            console.log(rel);
            that.model2.input.roleList = rel.data.Data;
          }
        }).catch(rel => {
          console.log(rel);
          that.$message({
            message: '获取警员权限失败,请刷新',
            type: 'warning'
          });
        });
    },
    openModel_role: function(item) {
      this.model2.title = item.UserName;
      this.openModel2();
      this.model2.input.id = item.Id;
      this.getRole(item.Id);
      this.model2.input.username = item.UserName;
    },
    submitModel2: function() {
      let that = this;
      that.model2.btnLoading_submit = true;
      that.axios.post('/api/user/setUserRoles', {
        "userId": that.model2.input.id,
        "roleIds": that.model2.input.roleChecked,
      }).then(function(rel) {
        console.log(rel);
        if (rel.data.StateCode == 500) {
          that.$message({
            message: rel.data.Message,
            type: 'warning'
          });
          that.model2.btnLoading_submit = false;
        } else if (rel.data.StateCode == 200) {
          that.$message({
            message: rel.data.Message,
            type: 'success'
          });
          that.list.offset = 1;
          that.getList();
          that.clearModel2();
        }
      }).catch(rel => {
        console.log(rel);
        that.$message({
          message: '编辑权限失败,请重试',
          type: 'warning'
        });
        that.model2.btnLoading_submit = false;
      });
    },
    getChecked: function() {
      // console.log(this.model2.input.roleChecked);
    },
    getJurisdiction: function() {
      if (!this.$store.state.user.jurisdiction.QueryUser) {
        this.$message({
          message: "非法操作!您的账号权限等级不够,请检查账号或者联系管理者",
          type: 'warning'
        });
        this.$router.push('/');
      }
    },
    getIpList: function() {
      let that = this;
      that.axios.get('/api/user/GetIPList').then(function(rel) {
        console.log(rel);
        that.model.ipList = rel.data.rows;
      }).catch(rel => {
        console.log(rel);
      });
    }

  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 126px;
    height: 126px;
    padding: 2px;
}
.avatar-uploader:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}
.avatar {
    width: 120px;
    height: 120px;
    display: block;
    border-radius: 3px;
}
.el-select {
    width: 100%;
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
.avarat {
    width: 10%;
    text-align: center;
    > i {
        display: block;
        width: 42px;
        height: 42px;
        margin: 15px auto;
        border-radius: 50px;
        background-position: center;
        background-size: contain;
        background-color: #ddd;
    }
}
.name {
    width: 12%;
    text-align: center;
}
.station {
    width: 12%;
    text-align: center;
}
.persontype {
    width: 12%;
    text-align: center;
}
.phone {
    width: 15%;
    text-align: center;
}
.getTing,
.noGet {
    height: calc(100% - 72px);
}
.el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}
.el-checkbox {
    margin-left: 0 !important;
    margin-bottom: 10px;
    margin-right: 10px;
}
</style>
