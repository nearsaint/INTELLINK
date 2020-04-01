<template>
<div class="questionBox box">
  <div class="title">问题池
    <div class="btnContainer">
      <a class="fa fa-plus" @click="dialogVisible = true"></a>
    </div>
  </div>
  <div class="content">
    <div class="noList" v-if="list.length==0">
      <i class="el-icon-files"></i>
      <h5>暂时没有条目,请点击右上角按钮添加或者尝试下方按钮刷新</h5>
      <el-button @click="question_getList" type="primary" plain icon="el-icon-refresh-left" circle></el-button>
    </div>
    <ul class="list">
      <li v-for="(item,index) in list" :key="index">
        <h5>{{item.title}}</h5>
        <h4>
          <template v-if="item.type===1">
            单选
          </template>
          <template v-else-if="item.type==2">
            多选
          </template>
          <template v-else-if="item.type==3">
            填空
          </template>
        </h4>
        <a @click="question_get(item.id)"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></a>
      </li>
    </ul>
  </div>
  <el-dialog title="问题编辑" :visible.sync="dialogVisible" width="60%" :before-close="handleCloseDialog">
    <div class="questionContainer">
      <ul>
        <li v-if="!dialog.creatMode">
          <span>ID</span>
          <el-input disabled v-model="dialog.id"></el-input>
        </li>
        <li>
          <span>标题</span>
          <el-input placeholder="请输入标题" ref="titleValueDialog" v-model="dialog.titleValue"></el-input>
        </li>
        <li>
          <span>问题类型</span>
          <el-select v-model="dialog.typeValue" placeholder="请选择问题类型" @change="clearDynamicTags">
            <el-option label="单选" :value="1">
            </el-option>
            <el-option label="多选" :value="2">
            </el-option>
            <el-option label="填空" :value="3">
            </el-option>
          </el-select>
        </li>

        <li v-if="dialog.typeValue==1||dialog.typeValue==2">
          <span>答案选限</span>
          <el-tag v-for="(tag,index) in dialog.dynamicTags" :key="index" closable :disable-transitions="false" @close="handleClose(tag)">
            {{tag.content}}
          </el-tag>
          <el-input class="input-new-tag" v-if="dialog.inputVisible" v-model="dialog.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">添加选项</el-button>
        </li>
        <li>
          <span>备注(不超过80个字)</span>
          <el-input :rows="4" type="textarea" placeholder="请输入备注内容" v-model="dialog.textarea" maxlength="80" show-word-limit>
          </el-input>
        </li>
      </ul>
    </div>

    <span slot="footer" class="dialog-footer">
    <el-button @click="handleCloseDialog">取 消</el-button>
    <el-button v-if="!dialog.creatMode" type="danger" @click="question_del(dialog.id)" :loading="dialog.del_loading">删 除</el-button>
    <el-button type="primary" @click="question_sub(dialog.id)" :loading="dialog.sub_loading">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      noList: false,
      dialogVisible: false,

      dialog: {
        typeValue: 1,
        creatMode: true,
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        id: '',
        titleValue: '',
        textarea: '',
        del_loading: false,
        sub_loading: false,
        btn_disable: false,
      }
    }
  },
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {
    this.question_getList();
  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    handleClose(tag) {
      this.dialog.dynamicTags.splice(this.dialog.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.dialog.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.dialog.inputValue;
      if (inputValue) {
        this.dialog.dynamicTags.push({
          content: inputValue,
        });
      }
      this.dialog.inputVisible = false;
      this.dialog.inputValue = '';
    },
    handleCloseDialog() {
      let that = this;
      that.$confirm('确定未保存关闭窗口, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.clearDialog();
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已返回'
        });
      });
    },
    clearDialog: function() {
      this.dialogVisible = false;
      this.dialog = {
        id: '',
        titleValue: '',
        typeValue: 1,
        creatMode: true,
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        textarea: '',
        del_loading: false,
        sub_loading: false,
        btn_disable: false,
      }
      this.question_getList()
    },
    clearDynamicTags: function() {
      let that = this;
      if (that.dialog.typeValue == 3 && that.dialog.dynamicTags.length > 0) {
        that.$confirm('更换为填空题,选项将清空, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.dialog.dynamicTags = [];
        }).catch(() => {
          that.dialog.typeValue = 1;
          that.$message({
            type: 'info',
            message: '已返回'
          });
        });
      }
    },
    question_getList: function() {
      let that = this;
      that.$axios.get('/api/question').then(function(rel) {
        console.log(rel)
        if (rel.data.code == 200) {
          that.list = rel.data.item;
          that.$store.state.qusetions.total = rel.data.item.length;
        }
      }).catch(rel => {
        console.log(rel)
      });
    },
    question_get: function(id) {
      let that = this;
      that.$axios.get('/api/question?id=' + id).then(function(rel) {
        console.log(rel)
        if (rel.data.code === 200) {
          that.dialogVisible = true;
          that.dialog = {
            id: rel.data.id,
            titleValue: rel.data.title,
            typeValue: rel.data.type,
            creatMode: false,
            dynamicTags: rel.data.options,
            inputVisible: false,
            inputValue: '',
            textarea: rel.data.remark,
            del_loading: false,
            sub_loading: false,
            btn_disable: false,
          }
        }
      }).catch(rel => {
        console.log(rel)
      });
    },
    question_post: function() {
      let that = this;
      that.$confirm('确定创建此问题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.dialog.sub_loading = true;
        that.dialog.del_loading = true;
        that.$axios.post('/api/question', {
          title: that.dialog.titleValue,
          type: that.dialog.typeValue,
          options: that.dialog.dynamicTags,
          remark: that.dialog.textarea,
        }).then(function(rel) {
          console.log(rel)
          let typeMessage = 'info';
          if (rel.data.code == 200) {
            that.clearDialog()
            typeMessage = 'success'
          } else {
            typeMessage = 'warning'
            that.dialog.sub_loading = false;
            that.dialog.del_loading = false;
          }
          that.$message({
            type: typeMessage,
            message: rel.data.message
          });
        }).catch(rel => {
          console.log(rel)
          that.dialog.sub_loading = false;
          that.dialog.del_loading = false;
        });
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已返回'
        });
      });
    },
    question_put: function(id) {
      let that = this;
      that.$confirm('确定修改此问题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.dialog.sub_loading = true;
        that.dialog.del_loading = true;
        that.$axios.put('/api/question', {
          id: id,
          title: that.dialog.titleValue,
          type: that.dialog.typeValue,
          options: that.dialog.dynamicTags,
          remark: that.dialog.textarea,
        }).then(function(rel) {
          console.log(rel);
          let typeMessage = 'info';
          if (rel.data.code == 200) {
            that.clearDialog()
            typeMessage = 'success'
          } else {
            typeMessage = 'warning'
            that.dialog.sub_loading = false;
            that.dialog.del_loading = false;
          }
          that.$message({
            type: typeMessage,
            message: rel.data.message
          });
        }).catch(rel => {
          console.log(rel)
          that.dialog.sub_loading = false;
          that.dialog.del_loading = false;
        });
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已返回'
        });
      });
    },
    question_del: function(id) {
      let that = this;
      that.$confirm('确定删除此问题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.dialog.sub_loading = true;
        that.dialog.del_loading = true;
        that.$axios.delete('/api/question?id=' + id).then(function(rel) {
          console.log(rel)
          let typeMessage = 'info';
          if (rel.data.code == 200) {
            that.clearDialog()
            typeMessage = 'success'
          } else {
            typeMessage = 'warning'
            that.dialog.sub_loading = false;
            that.dialog.del_loading = false;
          }
          that.$message({
            type: typeMessage,
            message: rel.data.message
          });
        }).catch(rel => {
          console.log(rel)
          that.dialog.sub_loading = false;
          that.dialog.del_loading = false;
        });
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已返回'
        });
      });
    },
    question_sub: function(id) {
      if (this.questionCheck()) {
        if (this.dialog.creatMode) {
          this.question_post()
        } else if (!this.dialog.creatMode && id != '') {
          this.question_put(id)
        }
      }
    },
    questionCheck: function() {
      let that = this;
      if (that.dialog.titleValue == '') {
        that.$message({
          type: 'warning',
          message: '请填写问题标题!'
        });
        that.$refs.titleValueDialog.focus()
        return false
      } else if (that.dialog.typeValue == 1 && that.dialog.dynamicTags.length == 0 || that.dialog.typeValue == 2 && that.dialog.dynamicTags.length == 0) {
        that.$message({
          type: 'warning',
          message: '请填写答案选项!'
        });
        return false
      } else {
        return true
      }
    },
  },
  computed: {},
  watch: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.questionBox {

    > .content {
        height: calc(100% - 52px);
        overflow-y: scroll;
        overflow-x: visible;
        position: relative;
        > ul.list {
            // height: 200%;
            border-top: 1px solid #eee;
            > li {
                padding: 15px 60px 15px 15px;
                border-bottom: 1px dashed #ddd;
                position: relative;
                > h5 {
                    color: #999;
                    font-size: 14px;
                    line-height: 20px;
                }
                > h4 {
                    font-size: 12px;
                    color: #fff;
                    background-color: #666;
                    border-radius: 10px;
                    padding: 3px 10px;
                    margin-top: 8px;
                    display: inline-block;
                }
                > a {
                    font-size: 24px;
                    color: #999;
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    display: block;
                    height: 50px;
                    width: 50px;
                    text-align: center;
                    line-height: 50px;
                    &:hover {
                        color: #409EFF;
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
                line-height: 20px;
            }
            > .el-button {
                display: block;
                margin: 10px auto;
            }
        }
    }
}

.questionContainer {
    > ul {
        > li {
            margin-bottom: 10px;
            border-bottom: 1px dashed #ddd;
            padding: 10px 0 20px;
            > span {
                display: block;
                font-size: 13px;
                color: #999;
                margin-bottom: 8px;
                &.el-tag {
                    display: inline-block;
                    margin-right: 10px;
                }
            }
            .el-tag + .el-tag {
                margin-right: 10px;
            }
            .button-new-tag {
                margin-right: 10px;
                height: 42px;
                line-height: 40px;
                padding-top: 0;
                padding-bottom: 0;
            }
            .input-new-tag {
                width: 200px;
                height: 42px;
                line-height: 40px;
                margin-right: 10px;
                vertical-align: bottom;
            }
        }
    }
}
</style>
