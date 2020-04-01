<template>
<div class="box commentMessageBox">
  <div class="title">待办
    <div class="btnContainer">
      <a class="refresh" @click="commentMessage_get"></a>
    </div>
  </div>
  <div class="content">
    <div class="noList" v-if="list.length==0">
      <i class="el-icon-files"></i>
      <h5>暂时没有疗程需要处理</h5>
      <el-button type="primary" plain icon="el-icon-refresh-left" circle @click="commentMessage_get"></el-button>
    </div>
    <ul class="list">
      <li v-for="(item, index) in list" :key="index">
        <span :class="[item.sex==1?'male':'',item.sex==2?'female':'']" :style="'background-image: url('+item.url+')'">
          <i v-if="item.sex==null" class="el-icon-s-custom"></i>
          <b class="fa" aria-hidden="true"></b>
        </span>
        <h4>{{item.name}}</h4>
        <h5>{{item.treatment}} - {{item.modelName}}</h5>
        <h6>{{item.time}}</h6>
        <div>
          <a class="right" @click="refuseOpen(item)">
            <i class="el-icon-edit"></i>
          </a>
        </div>
      </li>
    </ul>
  </div>

  <el-dialog class="refuseDialog" title="处理操作提示" :visible.sync="dialog.Visible" width="60%" :before-close="dialogClose">
    <div class="dialogContainer">
      <span>您将处理以下患者疗程</span>
      <div class="patinentInfo">
        <span class="male">
          <i class="el-icon-s-custom"></i>
          <b class="fa" aria-hidden="true"></b>
        </span>
        <h4>{{dialog.name}}</h4>
        <h5>{{dialog.treatment}} - {{dialog.model}}</h5>
        <h6>{{dialog.time}}</h6>
      </div>
      <ul class="questions">
        <h5>需要处理的信息</h5>
        <li v-for="(item,index) in checkList" :key="index">
          <h5>{{index+1}}. {{item.title}}</h5>
          <el-radio-group v-model="item.answer" v-if="item.type==1">
            <el-radio v-for="(option,n) in item.options" :label="option.id" :value="option.id">{{option.option}}</el-radio>
          </el-radio-group>

          <el-checkbox-group v-model="item.answer" v-if="item.type==2">
            <el-checkbox v-for="(option,n) in item.options" :label="option.id" :value="option.id">{{option.option}}</el-checkbox>
          </el-checkbox-group>

          <el-input v-model="item.text" v-if="item.type==3" type="textarea" placeholder="请输入内容" maxlength="100" rows="3" show-word-limit>
          </el-input>
        </li>
      </ul>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="postPromise()" :loading="dialog.Loading">确 定</el-button>
    </span>
  </el-dialog>

</div>
</template>

<script>
export default {
  data() {
    return {
      noList: false,
      checkList: [],
      list: [],
      dialog: {
        Visible: false,
        Loading: false,
        questions: [],
        name: '',
        sex: '',
        url: '',
        id: '',
        sid: '',
        treatment: '',
        time: '',
        model: '',
      },

    }
  },
  beforeCreate: function() {},
  created: function() {
    this.commentMessage_get();
  },
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    commentMessage_get: function() {
      let that = this;
      that.$axios.get('/api/task').then(function(rel) {
        console.log(rel)
        if (rel.data.code == 200) {
          that.list = rel.data.list
        }
      }).catch(rel => {
        console.log(rel)
      });
    },
    chackNpush: function() {
      let that = this;
      return new Promise(function(resolve, reject) {
        for (let i in that.checkList) {
          if (that.checkList[i].answer.length == 0 && that.checkList[i].text.length == 0) {
            reject()
            that.$message({
              type: 'warning',
              message: '请完整填写'
            });
            return
          } else {
            // console.log("填了")
            let answerA = [];
            if (that.checkList[i].type != 3) {
              if (Array.isArray(that.checkList[i].answer)) {
                answerA.concat(that.checkList[i].answer);
              } else {
                answerA.push(that.checkList[i].answer);
              }
            }
            that.dialog.questions.push({
              questionID: that.checkList[i].id,
              optionsID: answerA,
              text: that.checkList[i].text,
            })
          }
        }
        resolve()
      })
    },
    commentMessage_post: function() {
      let that = this;
      that.dialog.Loading = true;
      that.$axios.post('/api/task', {
        id: that.dialog.id,
        questions: that.dialog.questions,
      }).then(function(rel) {
        console.log(rel)
        that.commentMessage_get();
        that.dialogClose();
      }).catch(rel => {
        console.log(rel)
        that.dialog.questions = [];
        that.dialog.Loading = false;
      });
    },
    postPromise: function() {
      let that = this;
      that.chackNpush().then(function() {
        that.commentMessage_post();
      })
    },

    refuseOpen: function(e) {
      this.dialog.name = e.name;
      this.dialog.treatment = e.treatment;
      this.dialog.sex = e.sex;
      this.dialog.time = e.time;
      this.dialog.url = e.url;
      this.dialog.id = e.id;
      this.dialog.sid = e.sid;
      this.dialog.model = e.modelName;
      this.dialog.Visible = true;
      let that = this;
      that.$axios.get('/api/task?id=' + e.id + '&sid=' + e.sid).then(function(rel) {
        console.log(rel)
        if (rel.data.code == 200) {
          that.checkList = rel.data.questions
        }
      }).catch(rel => {
        console.log(rel)
      });
    },
    dialogClose: function() {
      this.dialog.name = '';
      this.dialog.treatment = '';
      this.dialog.sex = '';
      this.dialog.time = '';
      this.dialog.url = '';
      this.dialog.id = '';
      this.dialog.sid = '';
      this.dialog.model = '';
      this.dialog.questions = '';
      this.dialog.Visible = false;
      this.dialog.Loading = false;
      this.checkList = [];
    },
  },
  computed: {},
  watch: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.commentMessageBox {
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

    .questions {

        border: 1px solid #ddd;
        border-radius: 6px;
        > h5 {
            line-height: 32px;
            padding: 0 10px;
            background: #666;
            color: #fff;
        }
        > li {
            width: 100%;
            border-bottom: 1px solid #ddd;
            padding: 20px;
            &::after {
                border-bottom: none;
            }
            &:hover {
                background-color: #f5f5f5;
            }
            > h5 {
                font-size: 16px;
                margin-bottom: 15px;
            }
        }
    }
}
</style>
