<template>
<div class="questionListBox mainBox">
  <ul class="statistics">
    <li>
      <h3>{{$store.state.qusetionnaires.total}}</h3>
      <h6>问卷总数</h6>
    </li>
    <li>
      <h3>{{$store.state.qusetions.total}}</h3>
      <h6>问题池数量</h6>
    </li>
    <li>
      <h3>{{$store.state.qusetionnaires.kind}}</h3>
      <h6>涉及治疗</h6>
    </li>
  </ul>
  <div class="listBox box">
    <div class="title">
      问卷管理
      <div class="btnContainer">
        <el-tooltip content="添加新问卷" placement="top">
          <a class="fa fa-plus" @click="info.dialog = true"></a>
        </el-tooltip>
      </div>
    </div>
    <div class="content">
      <div class="filter">
        <ul class="floatLeft" hidden>
          <el-select v-model="hospital" placeholder="选择医院">
            <el-option label="全部" value="">
            </el-option>
            <el-option label="中山六院" :value="1">
            </el-option>
          </el-select>
          <el-select v-if="hospital!=''" v-model="subject" placeholder="选择科室">
            <el-option label="消化内科" :value="1">
            </el-option>
            <el-option label="消化外科" :value="2">
            </el-option>
          </el-select>
          <el-select v-if="hospital!=''&&subject!=''" v-model="treatment" placeholder="选择科室">
            <el-option label="磁疗棒(痔疮)" :value="1">
            </el-option>
          </el-select>
        </ul>
        <ul class="floatRight">
          <span class="text">总共有{{$store.state.qusetionnaires.total}}个条目</span>
        </ul>
        <div class="clr"></div>
      </div>

      <div class="tipper" v-if="list.length==0">
        <i class="el-icon-files"></i>
        <h5>暂时没有条目,请点击右上角按钮添加或者尝试下方按钮刷新</h5>
        <el-button @click="questionnaire_getList" type="primary" plain icon="el-icon-refresh-left" circle></el-button>
      </div>
      <ul class="list noList">
        <li v-for="(item,index) in list" :key="index">
          <div class="title">
            <ul>
              <li>
                <h5>{{item.title}}</h5>
                <h6>{{item.mintitle}}</h6>
              </li>
            </ul>
          </div>
          <div class="info">
            <ul>
              <li>
                <h5>{{item.code}}</h5>
                <h6>问卷编号</h6>
              </li>
              <li>
                <h5>{{item.treatment}}</h5>
                <h6>治疗</h6>
              </li>
              <li>
                <h5>{{item.hospital}}</h5>
                <h6>所属医院</h6>
              </li>
              <li>
                <h5>{{item.subject}}</h5>
                <h6>所属科室</h6>
              </li>
              <li>
                <h5>{{item.creator}}</h5>
                <h6>创建者</h6>
              </li>
              <li>
                <h5>{{item.time_creation}}</h5>
                <h6>创建时间</h6>
              </li>
              <li>
                <h5>{{item.editor}}</h5>
                <h6>最后编辑者</h6>
              </li>
              <li>
                <h5>{{item.time_edit}}</h5>
                <h6>最后编辑时间</h6>
              </li>
            </ul>
          </div>
          <div class="footer">
            <el-tooltip content="详细" placement="top">
              <a @click="gotoQuestionEdit(item.id)" class="edit"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></a>
            </el-tooltip>
          </div>
        </li>
      </ul>
      <!-- <el-pagination class="pagination" background layout="prev, pager, next" :total="1000">
      </el-pagination> -->
    </div>
  </div>


  <el-dialog title="新建问卷" :visible.sync="info.dialog" width="640px" :before-close="handleCloseDialog">
    <div class="main">
      <ul>
        <li>
          <span>问卷编号</span>
          <div>
            <el-input placeholder="输入问卷编号" v-model="info.code" ref="code"></el-input>
          </div>
        </li>
        <li>
          <span>问卷标题</span>
          <div>
            <el-input placeholder="输入问卷标题" v-model="info.title" ref="title"></el-input>
          </div>
        </li>
        <li>
          <span>问卷副标题</span>
          <div>
            <el-input placeholder="输入问卷副标题" v-model="info.mintitle" ref="mintitle"></el-input>
          </div>
        </li>
        <li>
          <span>周期(天)</span>
          <div>
            <el-input-number size="medium" v-model="info.cycle" ref="cycle" controls-position="right" :min="1" :step="1" :precision='0'></el-input-number>
          </div>
        </li>
        <li>
          <span>所属治疗</span>
          <div>
            <el-select placeholder="请选择医院" v-model="info.hospital" ref="hospital">
              <el-option label="选择医院" value="选择医院"></el-option>
              <el-option v-for="item in info.hospitals" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-select placeholder="请选择科室" v-model="info.subject" ref="subject">
              <el-option label="选择科室" value="选择科室"></el-option>
              <el-option v-for="item in info.subjects" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-select placeholder="请选择治疗" v-model="info.treatment" ref="treatment">
              <el-option label="选择治疗" value="选择治疗"></el-option>
              <el-option v-for="item in info.treatments" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </li>
        <li>
          <span>备注信息</span>
          <div>
            <el-input type="textarea" :rows="4" placeholder="请输入备注信息" v-model="info.remark">
            </el-input>
          </div>
        </li>
      </ul>
    </div>

    <span slot="footer" class="dialog-footer">
        <el-button @click="info.dialog = false">取 消</el-button>
        <el-button :loading="info.sub_loading" type="primary" @click="questionnaire_sub()">确 定</el-button>
      </span>
  </el-dialog>

</div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      hospital: '',
      subject: '',
      treatment: '',
      info: {
        dialog: false,
        sub_loading: false,
        code: '',
        title: '',
        mintitle: '',
        cycle: '',
        hospital: '',
        hospitals: [],
        subject: '',
        subjects: [],
        treatment: '',
        treatments: [],
        remark: '',
      },
    }
  },
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {
    this.info.hospitals = this.$store.state.util.hospitals;
    this.info.treatments = this.$store.state.util.treatments;
    this.questionnaire_getList();
  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    handleClose_model: function() {},
    gotoQuestionEdit: function(e) {
      this.$router.push({
        path: '/questionEdit/' + e,
        query: {
          code: e,
        }
      })
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
      this.info = {
        dialog: false,
        sub_loading: false,
        code: '',
        title: '',
        mintitle: '',
        cycle: 1,
        hospital: 1,
        hospitals: [{
          value: 1,
          label: '中山六院'
        }],
        subject: '',
        subjects: [{
          value: 1,
          label: '消化外科'
        }, {
          value: 2,
          label: '消化内科'
        }],
        treatment: '',
        treatments: [{
          value: 1,
          label: '磁疗棒(痔疮)'
        }],
        remark: '',
      }
      this.questionnaire_getList();
    },
    questionnaire_post: function() {
      let that = this;
      that.$confirm('确定创建此问卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$axios.post('/api/questionnaire', {
          info: {
            code: that.info.code,
            title: that.info.title,
            mintitle: that.info.mintitle,
            cycle: that.info.cycle,
            hospitalID: that.info.hospital,
            subjectID: that.info.subject,
            treatmentID: that.info.treatment,
            remark: that.info.remark,
          },
          model_line: [],
          model: [],
        }).then(function(rel) {
          console.log(rel)
          let typeMessage = 'info';
          if (rel.data.code == 200) {
            that.clearDialog()
            typeMessage = 'success'
          } else {
            typeMessage = 'warning'
            that.info.sub_loading = false;
          }
          that.$message({
            type: typeMessage,
            message: rel.data.message
          });
        }).catch(rel => {
          console.log(rel)
          that.info.sub_loading = false;
        });
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已返回'
        });
      });
    },
    questionnaire_sub: function() {
      if (this.questionnaireCheck()) {
        this.questionnaire_post();
      }
    },
    questionnaireCheck: function() {
      let that = this;
      if (that.info.code == '') {
        that.$message({
          type: 'warning',
          message: '请设置问卷编号!'
        });
        that.$refs.code.focus()
        return false
      } else if (that.info.title == '') {
        that.$message({
          type: 'warning',
          message: '请设置问卷标题!'
        });
        that.$refs.title.focus()
        return false
      } else if (that.info.hospital == '') {
        that.$message({
          type: 'warning',
          message: '请选择所属医院!'
        });
        that.$refs.hospital.focus()
        return false
      } else if (that.info.subject == '') {
        that.$message({
          type: 'warning',
          message: '请选择所属科室!'
        });
        that.$refs.subject.focus()
        return false
      } else if (that.info.treatment == '') {
        that.$message({
          type: 'warning',
          message: '请选择所属治疗项目!'
        });
        that.$refs.treatment.focus()
        return false
      } else {
        return true
      }
    },

    questionnaire_getList: function() {
      let that = this;
      that.$axios.get('/api/questionnaire').then(function(rel) {
        console.log(rel)
        if (rel.data.code == 200) {
          that.list = rel.data.list;
          that.$store.state.qusetionnaires.kind = rel.data.kind;
          that.$store.state.qusetionnaires.total = rel.data.list.length;
        }
      }).catch(rel => {
        console.log(rel)
      });
    },
  },
  computed: {},
  watch: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.questionListBox {
    .statistics {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        margin: 0 -5px 20px;
        width: calc(100% + 10px);
        > li {
            flex-grow: 0;
            flex-shrink: 1;
            margin: 0 5px;
            padding: 10px;
            border-radius: 6px;
            color: #fff;
            width: 33.333333%;
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
            position: relative;
            min-height: 410px;
            > .filter {
                padding: 15px;
                .text {
                    line-height: 36px;
                    font-size: 14px;
                    color: #666;
                }
                .el-select {
                    margin-right: 5px;
                }
            }
            > .list.noList {
                padding: 5px;
                display: flex;
                flex-wrap: wrap;
                border-top: 1px solid #eee;

                > li {
                    border-radius: 6px;
                    margin: 10px;
                    border: 1px solid #ddd;
                    width: calc(50% - 20px);
                    flex-grow: 0;
                    flex-shrink: 1;
                    transition: margin 0.3s;
                    &:hover {
                        box-shadow: 0 0 12px #eee;
                        margin-top: 5px;
                        margin-bottom: 15px;
                        border-color: #409EFF;
                    }
                    > .title {
                        background: #409EFF;
                        color: #fff;
                        border-radius: 4px 4px 0 0;
                        padding: 15px;
                        > ul {
                            > li {
                                h5 {
                                    font-size: 24px;
                                    margin-bottom: 5px;
                                    line-height: 26px;
                                    height: 26px;
                                    display: block;
                                }
                                h6 {
                                    font-size: 12px;
                                    height: 14px;
                                    line-height: 14px;
                                    display: block;
                                }
                            }
                        }
                    }
                    > .info {
                        padding: 15px 0 0;
                        > ul {
                            display: flex;
                            justify-content: left;
                            flex-wrap: wrap;
                            > li {
                                width: 50%;
                                padding: 5px 15px;

                                h5 {
                                    font-size: 14px;
                                    margin-bottom: 5px;
                                    color: #333;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    height: 14px;
                                    line-height: 14px;
                                }
                                h6 {
                                    font-size: 12px;
                                    margin-bottom: 10px;
                                    color: #999;
                                    height: 12px;
                                    line-height: 12px;
                                }
                            }
                        }
                    }
                    > .footer {
                        text-align: right;
                        color: #999;
                        font-size: 28px;
                        padding: 15px;
                    }
                }
            }
            > .pagination {
                border-top: 1px solid #eee;
                padding: 15px;
            }
        }
    }
    .el-dialog {
        .main {
            > ul {
                > li {
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    margin-bottom: 20px;
                    flex-wrap: wrap;

                    > span {
                        display: block;
                        width: 100%;
                        line-height: 20px;
                        margin-bottom: 5px;
                        color: #999;
                        font-size: 12px;
                        flex-shrink: 0;
                        flex-grow: 0;
                    }

                    > div {
                        width: 100%;
                        display: flex;
                        flex-wrap: nowrap;
                        justify-content: space-between;

                        > .el-input {
                            width: 600px;
                        }

                        > .el-select {
                            width: 190px;
                            flex-grow: 0;
                            flex-shrink: 0;
                        }

                        > .el-input-number {
                            width: 190px;
                        }

                        > .el-textarea {
                            width: 600px;
                        }
                    }
                }
            }
        }
    }
    .tipper {
        position: absolute;
        top: 60%;
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
</style>
