<template>
<div class="box reviewMessageBox">
  <div class="title">审核消息
    <div class="btnContainer">
      <a class="refresh" @click="reviewMessage_get"></a>
    </div>
  </div>
  <div class="content">
    <div class="noList" v-if="list.length==0">
      <i class="el-icon-files"></i>
      <h5>暂时没有审核信息</h5>
      <el-button type="primary" plain icon="el-icon-refresh-left" circle @click="reviewMessage_get"></el-button>
    </div>
    <ul class="list">
      <li v-for="(item, index) in list" :key="index">
        <span :class="[item.sex==1?'male':'',item.sex==2?'female':'']" :style="'background-image: url('+item.url+')'">
          <i v-if="item.url==null" class="el-icon-s-custom"></i>
          <b class="fa" aria-hidden="true"></b>
        </span>
        <h4>{{item.name}}</h4>
        <h5>{{item.treatment}} - 申请审核</h5>
        <h6>{{item.time}}</h6>
        <div>
          <a class="right" @click="acceptOpen(item)">
            <i class="el-icon-check"></i>
          </a>
          <a class="wrong" @click="refuseOpen(item)">
            <i class="el-icon-close"></i>
          </a>
        </div>
      </li>
    </ul>
  </div>

  <el-dialog class="refuseDialog" title="审核操作提示" :visible.sync="dialog.refuseVisible" width="30%" :before-close="dialogClose">
    <div class="dialogContainer">
      <span>您将拒绝以下的治疗审核</span>
      <div class="patinentInfo">
        <span :class="[dialog.sex==1?'male':'',dialog.sex==2?'female':'']" :style="'background-image: url('+dialog.url+')'">
          <i v-if="dialog.url==null||dialog.url==''" class="el-icon-s-custom"></i>
          <b class="fa" aria-hidden="true"></b>
        </span>
        <h4>{{dialog.name}}</h4>
        <h5>{{dialog.info}}</h5>
        <h6>{{dialog.time}}</h6>
      </div>
      <span>请选择拒绝理由</span>
      <el-select v-model="dialog.reasonRefusal" placeholder="拒绝理由">
        <el-option v-for="item in dialog.refuseInfo.options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogClose">取 消</el-button>
    <el-button type="warning" :loading="dialog.loading" @click="reviewMessage_post(dialog.id, false, dialog.acceptId)">拒 绝</el-button>
  </span>
  </el-dialog>

  <el-dialog class="acceptDialog" title="审核操作提示" :visible.sync="dialog.acceptVisible" width="30%" :before-close="dialogClose">
    <div class="dialogContainer">
      <span>您将接受以下的治疗审核</span>
      <div class="patinentInfo">
        <span class="male">
            <i class="el-icon-s-custom"></i>
            <b class="fa" aria-hidden="true"></b>
          </span>
        <h4>{{dialog.name}}</h4>
        <h5>{{dialog.info}}</h5>
        <h6>{{dialog.time}}</h6>
      </div>
      <span>请选择治疗问卷</span>
      <el-select placeholder="问卷选择" v-model="dialog.acceptId">
        <el-option v-for="(item, index) in treatments[treatmentIndex].questionnaires" :key="index" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="success" @click="reviewMessage_post(dialog.id, true, dialog.acceptId)" :loading="dialog.loading">接 受</el-button>
    </span>
  </el-dialog>

</div>
</template>

<script>
export default {
  data() {
    return {
      noList: false,
      list: [],
      treatments: [{
        questionnaires: [{
          name: '未知的问卷',
          id: '未知的 ID'
        }]
      }],
      treatmentIndex: 0,
      dialog: {
        refuseVisible: false,
        refuseLoading: false,
        loading: false,
        acceptId: '',
        reasonRefusal: '',
        refuseInfo: {
          options: [{
            value: '查无此患者',
            label: '查无此患者'
          }, {
            value: '查无此次治疗',
            label: '查无此次治疗'
          }, {
            value: '其他原因,请联系医生',
            label: '其他原因,请联系医生'
          }],
          value: ''
        },
        item: {},
        id: '',
        sex: '',
        url: '',
        name: '',
        info: '',
        time: ''
      },

    }
  },
  beforeCreate: function() {},
  created: function() {
    this.reviewMessage_get();
  },
  mounted: function() {

  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    reviewMessage_get: function(id) {
      let that = this;
      that.$axios.get('/api/msg').then(function(rel) {
        console.log(rel)
        if (rel.data.code == 200) {
          that.list = rel.data.list
        }
      }).catch(rel => {
        console.log(rel)
      });
    },
    acceptOpen: function(e) {
      this.treatments = this.$store.state.util.treatments;
      for (let i in this.treatments) {
        if (this.treatments[i].name === e.treatment) {
          this.treatmentIndex = i;
        }
      }
      this.dialog.name = e.name;
      this.dialog.info = e.treatment;
      this.dialog.sex = e.sex;
      this.dialog.time = e.time;
      this.dialog.url = e.url;
      this.dialog.id = e.id;
      this.dialog.acceptId = e.qnid;
      this.dialog.acceptVisible = true
    },
    refuseOpen: function(e) {
      console.log(e);
      this.dialog.name = e.name;
      this.dialog.info = e.treatment;
      this.dialog.sex = e.sex;
      this.dialog.time = e.time;
      this.dialog.url = e.url;
      this.dialog.id = e.id;
      this.dialog.acceptId = e.qnid;
      this.dialog.refuseVisible = true
    },
    dialogClose: function() {
      console.log(1);
      this.dialog.name = '';
      this.dialog.info = '';
      this.dialog.sex = '';
      this.dialog.time = '';
      this.dialog.url = '';
      this.dialog.id = '';
      this.dialog.acceptVisible = false;
      this.dialog.refuseVisible = false;
      this.dialog.loading = false;
      this.dialog.acceptId = '';
      this.treatments = [{
        questionnaires: [{
          name: '未知的问卷',
          id: '未知的 ID'
        }]
      }];
      this.treatmentIndex = 0;
    },

    reviewMessage_post: function(id, re, qid) {
      console.log(id)
      console.log(re)
      console.log(qid)
      this.dialog.loading = true;
      let that = this;
      that.$axios.post('/api/msg', {
        id: id,
        result: re,
        questionnaireID: qid,
        reasonRefusal: that.dialog.reasonRefusal,
      }).then(function(rel) {
        console.log(rel)
        let typeMessage = 'info';
        if (rel.data.code == 200) {
          typeMessage = 'success'
        } else {
          typeMessage = 'warning'
        }
        that.$message({
          type: typeMessage,
          message: rel.data.message
        });
        that.reviewMessage_get();
        that.dialogClose();
      }).catch(rel => {
        console.log(rel)
        that.dialog.loading = false;
      });
    },
  },
  computed: {},
  watch: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.reviewMessageBox {
    > .content {
        height: calc(100% - 52px);
        overflow-y: scroll;
        overflow-x: visible;
        position: relative;
        > ul.list {
            // height: 200%;
            border-top: 1px solid #eee;
            > li {
                padding: 15px 15px 15px 82px;
                border-bottom: 1px dashed #ddd;
                position: relative;
                > span {
                    background-color: #ddd;
                    border-radius: 50%;
                    border: 2px solid #999;
                    display: block;
                    height: 52px;
                    width: 52px;
                    position: absolute;
                    top: 15px;
                    left: 15px;
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
                        bottom: -9px;
                        left: 50%;
                        transform: translateX(-50%);
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
                    color: #333;
                    font-size: 18px;
                    margin-bottom: 13px;
                    font-weight: bold;
                }
                > h5 {
                    color: #999;
                    font-size: 14px;
                    margin-bottom: 5px;
                }
                > h6 {
                    color: #ccc;
                    font-size: 14px;
                }
                > div {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: -200px;
                    transition: right 0.3s;
                    > a {
                        border-radius: 50%;
                        display: inline-block;
                        margin-left: 10px;
                        height: 32px;
                        width: 32px;
                        color: #fff;
                        text-align: center;
                        line-height: 32px;
                        opacity: 0.6;
                        &.right {
                            background-color: #67C23A;
                        }
                        &.wrong {
                            background-color: #F56C6C;
                        }
                        &:hover {
                            opacity: 1;
                        }
                    }
                }

                &:hover {
                    background-color: #f9f9f9;
                    > div {
                        right: 15px;
                    }
                }
            }
        }
        > .noList {
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
    }
}

.dialogContainer {

    > span {
        display: block;
        margin: 10px 0;
    }
    > .patinentInfo {
        padding: 15px 15px 15px 82px;
        position: relative;
        border: 1px solid #ddd;
        border-radius: 6px;
        margin: 10px 0 20px;
        > span {
            background-color: #ddd;
            border-radius: 50%;
            border: 2px solid #999;
            display: block;
            height: 52px;
            width: 52px;
            position: absolute;
            top: 15px;
            left: 15px;
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
                bottom: -9px;
                left: 50%;
                transform: translateX(-50%);
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
            color: #333;
            font-size: 18px;
            margin-bottom: 13px;
            font-weight: bold;
        }
        > h5 {
            color: #999;
            font-size: 14px;
            margin-bottom: 5px;
        }
        > h6 {
            color: #ccc;
            font-size: 14px;
        }
    }
}
</style>
