<template>
<div class="questionnaireEditBox">
  <el-page-header @back="gotoQuestionnaire" :content="'ID:'+ id">
  </el-page-header>
  <div class="info">
    <h5>基础信息</h5>
    <ul>
      <div class="btnContainer">
        <button class="edit" @click="infoDialog.dialog = true"><i class="el-icon-edit"></i></button>
        <button @click="questionnaire_del(id)"><i class="el-icon-delete"></i></button>
      </div>
      <li class="title">
        <h5>{{questionnaire.info.title}}</h5>
        <h6>{{questionnaire.info.mintitle}}</h6>
      </li>
      <li class="item">
        <h5>{{questionnaire.info.code}}</h5>
        <h6>问卷编号</h6>
      </li>
      <li class="item">
        <h5>{{questionnaire.info.treatment}}</h5>
        <h6>疗程名</h6>
      </li>
      <li class="item">
        <h5>{{questionnaire.info.cycle}}</h5>
        <h6>周期(天数)</h6>
      </li>
      <li class="item">
        <h5>{{questionnaire.info.hospital}}</h5>
        <h6>所属医院</h6>
      </li>
      <li class="item">
        <h5>{{questionnaire.info.subject}}</h5>
        <h6>所属科室</h6>
      </li>

      <li class="footer" v-if="questionnaire.info.remark != ''">
        <h6>备注信息</h6>
        <h5>{{questionnaire.info.remark}}</h5>
      </li>
      <li class="tipper">
        <h6>创建者</h6>
        <h5>{{questionnaire.info.createMan}} | {{questionnaire.info.createTime}}</h5>
      </li>
      <li class="tipper">
        <h6>最后编辑者</h6>
        <h5>{{questionnaire.info.editMan}} | {{questionnaire.info.editTime}}</h5>
      </li>

    </ul>
  </div>
  <div class="main">
    <ul class="path continue">
      <h5>流程模块</h5>
      <h6 v-show="questionnaire.model_line.length==0">暂无流程模块</h6>
      <!-- style="background: rgb(140, 190, 255);" -->
      <li v-for="(item,index) in questionnaire.model_line" :class="[item.active?'active':'']" style="border-color:rgb(120, 170, 255);">
        <div class="btnContainer">
          <button @click="editModel(item, index, 1)" class="edit"><i class="el-icon-edit"></i></button>
          <button v-show="item.questions.length>0" @click="showModelQuestion('model_line',index)"><i :class="[item.active?'el-icon-minus':'el-icon-full-screen']"></i></button>
        </div>
        <h5><span>{{item.title}}</span><i>
          <template v-if="item.start===item.end">Day{{item.end}}</template>
          <template v-else>Day{{item.start}} - Day{{item.end}}</template>
        </i></h5>
        <div class="title">
          <h6><span>{{item.questions.length}}</span><i>问题个数</i></h6>
          <h6><span>{{item.interval}}</span><i>提醒间隔</i></h6>
          <h6><span>{{item.time}}</span><i>提醒时间</i></h6>
        </div>
        <ul class="questions animated fadeIn">
          <li v-for="(kid, length) in item.questions" :key="length">
            <h5><span>{{length}} - {{kid.title}}</span>
              <template v-if="kid.type===1"><i>单选</i></template>
              <template v-else-if="kid.type===2"><i>多选</i></template>
              <template v-else><i>填空</i></template>
            </h5>
            <h6 v-if="kid.options.length>0" v-for="(option,nik) in kid.options">
              <span>{{option.option}}</span>
              <i v-if="option.score!=null">{{option.score}}</i>
              <b v-if="option.goto!=null">{{option.goto}}</b>
            </h6>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="path continue">
      <h5>普通模块与医生模块</h5>
      <h6 v-show="questionnaire.model.length==0">暂无普通模块与医生模块</h6>
      <li v-for="(item,index) in questionnaire.model" :class="[item.active?'active':'']" :style="[item.for==1?'border-color:#F56C6C':'border-color:#E6A23C']">
        <div class="btnContainer">
          <button @click="editModel(item, index, 2)" class="edit"><i class="el-icon-edit"></i></button>
          <button v-show="item.questions.length>0" @click="showModelQuestion('model',index)"><i :class="[item.active?'el-icon-minus':'el-icon-full-screen']"></i></button>
        </div>
        <h5><span>{{item.title}}</span><i>
          <template v-if="item.start===item.end"></template>
          <template v-else>Day{{item.start}} - Day{{item.end}}</template>
        </i></h5>
        <div class="title">
          <h6><span>{{item.questions.length}}</span><i>问题个数</i></h6>
          <h6><span>{{item.interval}}</span><i>提醒间隔</i></h6>
          <h6><span>{{item.time}}</span><i>提醒时间</i></h6>
        </div>
        <ul class="questions animated fadeIn">
          <li v-for="(kid, length) in item.questions" :key="length">
            <h5><span>{{parseInt(length+1)}} - {{kid.title}}</span>
              <template v-if="kid.type===1"><i>单选</i></template>
              <template v-else-if="kid.type===2"><i>多选</i></template>
              <template v-else><i>填空</i></template>
            </h5>
            <h6 v-if="kid.options.length>0" v-for="(option,nik) in kid.options">
              <span>{{option.option}}</span>
              <i v-if="option.score!=null && option.score!=0 && option.score!=0.00">{{option.score}}</i>
              <b v-if="option.goto!=null">{{option.goto}}</b>
            </h6>
          </li>
        </ul>
      </li>
    </ul>
  </div>

  <el-dropdown trigger="click" @command="newModel">
    <button class="add">添加新模块</button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="a">流程模块</el-dropdown-item>
      <el-dropdown-item command="b">普通模块</el-dropdown-item>
      <el-dropdown-item command="c">医生模块</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

  <el-dialog title="编辑基础信息" :visible.sync="infoDialog.dialog" width="640px" :before-close="handleCloseDialog">
    <div class="main">
      <ul>
        <li>
          <span>问卷ID</span>
          <div>
            <el-input :value="id" disabled></el-input>
          </div>
        </li>
        <li>
          <span>问卷编号</span>
          <div>
            <el-input v-model="questionnaire.info.code" placeholder="输入问卷编号"></el-input>
          </div>
        </li>
        <li>
          <span>问卷标题</span>
          <div>
            <el-input v-model="questionnaire.info.title" placeholder="输入问卷标题"></el-input>
          </div>
        </li>
        <li>
          <span>问卷副标题</span>
          <div>
            <el-input v-model="questionnaire.info.mintitle" placeholder="输入问卷副标题"></el-input>
          </div>
        </li>
        <li>
          <span>周期(天)</span>
          <div>
            <el-input-number v-model="questionnaire.info.cycle" size="medium"></el-input-number>
          </div>
        </li>
        <li>
          <span>所属治疗</span>
          <div>
            <el-select v-model="questionnaire.info.hospitalID" placeholder="请选择医院" @change="chooseHospital">
              <el-option label="选择医院" value="选择医院"></el-option>
              <el-option v-for="(item,index) in infoDialog.util.hospitals" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="questionnaire.info.subjectID" placeholder="请选择科室">
              <el-option label="选择科室" value="选择科室"></el-option>
              <el-option v-for="(item,index) in infoDialog.subjects" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="questionnaire.info.treatmentID" placeholder="请选择治疗">
              <el-option label="选择治疗" value="选择治疗"></el-option>
              <el-option v-for="(item,index) in infoDialog.util.treatments" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </div>
        </li>
        <li>
          <span>备注信息</span>
          <div>
            <el-input v-model="questionnaire.info.remark" type="textarea" :rows="4" placeholder="请输入备注信息">
            </el-input>
          </div>
        </li>
      </ul>
    </div>

    <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button :loading="infoDialog.loading" type="primary" @click="questionnaire_put()">确 定</el-button>
      </span>
  </el-dialog>


  <el-dialog class="modelEdit" :title="'编辑'+ modelDialog.type + '信息'" :visible.sync="modelDialog.dialog" width="1000px" :before-close="handleCloseDialog">
    <div class="main">
      <ul>
        <li>
          <span>模块类型</span>
          <div>
            <el-input v-model="modelDialog.type" disabled></el-input>
          </div>
        </li>
        <li v-if="!modelDialog.creatMode">
          <span>模块ID</span>
          <div>
            <el-input v-model="modelDialog.json.id" disabled></el-input>
          </div>
        </li>
        <li>
          <span>模块名</span>
          <div>
            <el-input v-model="modelDialog.json.title" placeholder="输入模块名称"></el-input>
          </div>
        </li>
        <li>
          <span>日期(从开始治疗当天算起)</span>
          <div>
            <el-input-number size="medium" v-model="modelDialog.json.start" :precision="0" :step="1"></el-input-number>
            <el-input-number size="medium" v-model="modelDialog.json.end" :precision="0" :step="1"></el-input-number>
          </div>
        </li>
        <li v-if="modelDialog.json.for!=1">
          <span>提醒间隔</span>
          <div>
            <el-input-number size="medium" v-model="modelDialog.json.interval" :precision="0" :step="1"></el-input-number>
          </div>
        </li>
        <li v-if="modelDialog.json.for!=1">
          <span>提醒时间(推送时间)</span>
          <div>
            <el-time-select v-model="modelDialog.json.time" :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '23:50'
            }" placeholder="选择时间">
            </el-time-select>
          </div>
        </li>
        <li v-if="modelDialog.json.for!=1">
          <span>选项计分统计</span>
          <div>
            <el-switch v-model="modelDialog.json.scoreSwitch" style="display: block" active-color="#13ce66" active-text="选项计分" inactive-text="不计分">
            </el-switch>
          </div>
        </li>
        <li>
          <span>备注信息</span>
          <div>
            <el-input type="textarea" :rows="4" v-model="modelDialog.json.remark" placeholder="请输入备注信息">
            </el-input>
          </div>
        </li>
      </ul>
    </div>
    <div class="questions">
      <h6>问题设置</h6>
      <ul>
        <li v-for="(item,indexs) in modelDialog.json.questions" :key="indexs">
          <h5>{{item.title}}
            <span>
              <template v-if="item.type==1">单选</template>
              <template v-else-if="item.type==2">多选</template>
              <template v-else>填空</template>
            </span>
            <el-switch v-if="item.type==1" v-model="item.active" active-color="#67C23A" inactive-color="#ccc"></el-switch>
            <a @click="questionDel(indexs)"><i class="el-icon-close"></i></a>
          </h5>
          <ol>
            <li v-for="(option ,index) in item.options" :key="index">
              <h5>{{option.option}}</h5>
              <div v-show="modelDialog.json.scoreSwitch">
                <span>分数设置</span>
                <el-input-number size="mini" v-model="option.score" :precision="3" :step="0.001"></el-input-number>
              </div>
              <div v-show="item.active">
                <span>跳转设置</span>
                <el-select v-model="option.goto" size="small" placeholder="请选择跳转阶段">
                  <el-option label="不跳转" value=""></el-option>
                  <el-option v-for="(model, index_line) in questionnaire.model_line" :label="model.title" :value="model.id" :key="index_line"></el-option>
                </el-select>
              </div>
            </li>
          </ol>
        </li>
        <el-button type="primary" @click="openQuestionChoose" plain>添加问题</el-button>
      </ul>
    </div>

    <span slot="footer" class="dialog-footer">
          <el-button @click="handleCloseDialog">取 消</el-button>
          <el-button :loading="modelDialog.loading" type="primary" @click="submit_info()">确 定</el-button>
        </span>
  </el-dialog>

  <el-dialog class="questionDialog" title="添加问题" :visible.sync="qusetionDialog.dialog" width="400px">
    <div>
      <!-- <span>问题</span> -->
      <el-select v-model="qusetionDialog.question" placeholder="请选择问题">
        <el-option v-for="(item, index) in qusetionDialog.list" :key="index" :label="item.title" :value="item.id"><template v-if="item.type==1">单选</template><template v-else-if="item.type==2">多选</template><template v-else="item.type==3">填空</template>-{{item.title}}</el-option>
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="qusetionDialog.dialog = false">取 消</el-button>
      <el-button type="primary" @click="questionAdd()">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import 'assets/styles/questionnaireEditBox.scss'
export default {
  data() {
    return {
      id: '',
      loading: false,
      questionnaire: {
        index: 0,
        del_loading: false,
        info: {},
        model: [],
        model_line: [],
      },
      qusetionDialog: {
        dialog: false,
        question: null,
        list: [],
      },
      modelDialog: {
        creatMode: true,
        model: 1,
        dialog: false,
        loading: false,
        scoreSwitch: false,
        type: '未知类型',
        index: null,
        json: {
          id: '',
          for: 0,
          start: 0,
          end: 1,
          time: '21:00',
          interval: 1,
          title: '',
          active: false,
          scoreSwitch: false,
          remark: '',
          questions: [],
        }
      },
      infoDialog: {
        dialog: false,
        loading: false,
        util: {},
        subjects: [],
      },
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.get_query();
    this.infoDialog.util = this.$store.state.util;
  },
  mounted: function() {
    this.questionnaire_get(this.id);
  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    get_query: function() {
      console.log(this.$route.query);
      this.id = this.$route.query.code;
    },
    gotoQuestionnaire: function() {
      this.$router.push({
        path: '/questionnaire',
      })
    },
    questionnaire_get: function(id) {
      let that = this;
      that.$store.state.loading = true;
      that.$axios.get('/api/questionnaire?id=' + id).then(function(rel) {
        console.log(rel)
        if (rel.data.code == 200) {
          that.questionnaire.info = rel.data.info;
          that.questionnaire.model = rel.data.model;
          that.questionnaire.model_line = rel.data.model_line;
          that.chooseHospital(that.questionnaire.info.hospitalID);
          that.clearDialog();
        }
      }).catch(rel => {
        console.log(rel)
      });
    },
    questionnaire_del: function(id) {
      let that = this;
      that.$confirm('确定删除此问题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.questionnaire.del_loading = true;
        that.$axios.delete('/api/questionnaire?id=' + id).then(function(rel) {
          console.log(rel)
          let typeMessage = 'info';
          if (rel.data.code == 200) {
            typeMessage = 'success'
            that.gotoQuestionnaire();
          } else {
            typeMessage = 'warning'
            that.questionnaire.del_loading = false;
          }
          that.$message({
            type: typeMessage,
            message: rel.data.message
          });
        }).catch(rel => {
          console.log(rel)
          that.questionnaire.del_loading = false;
        });
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已返回'
        });
      });
    },
    questionnaire_put: function() {
      let that = this;
      that.$store.state.loading = true;
      that.$axios.put('/api/questionnaire', {
        id: that.id,
        info: that.questionnaire.info,
        model_line: that.questionnaire.model_line,
        model: that.questionnaire.model,
      }).then(function(rel) {
        console.log(rel)
        that.questionnaire_get(that.id);
      }).catch(rel => {
        console.log(rel)
        that.$message({
          type: 'warning',
          message: '编辑失败!'
        });
        that.modelDialog.loading = false;
        that.$store.state.loading = true;
      });
    },
    clearDialog() {
      this.infoDialog.dialog = false;
      this.infoDialog.loading = false;
      this.modelDialog = {
        creatMode: true,
        model: 1,
        dialog: false,
        loading: false,
        scoreSwitch: false,
        type: '未知类型',
        index: null,
        json: {
          id: '',
          for: 0,
          start: 0,
          end: 1,
          time: '21:00',
          interval: 1,
          title: '',
          active: false,
          scoreSwitch: false,
          remark: '',
          questions: [],
        }
      }
      this.$store.state.loading = false;
    },
    handleCloseDialog() {
      let that = this;
      that.$confirm('确定未保存关闭窗口, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.infoDialog.dialog = false;
        that.modelDialog.dialog = false;
        that.questionnaire_get(that.id);
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已返回'
        });
      });
    },
    submit_info: function() {
      let that = this;
      if (that.modelDialog.json.questions.length === 0) {
        that.$message({
          type: 'warning',
          message: '请选择问题!'
        });
      } else {
        that.modelDialog.loading = true;
        that.$confirm('确定完成此次编辑, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (that.modelDialog.model == 1 && that.modelDialog.creatMode) { //model_line
            that.questionnaire.model_line.push(that.modelDialog.json);
          } else if (that.modelDialog.model == 2 && that.modelDialog.creatMode) { //model_line
            that.questionnaire.model.push(that.modelDialog.json);
          } else if (that.modelDialog.model == 1 && !that.modelDialog.creatMode) {
            that.questionnaire.model_line[that.modelDialog.index] = that.modelDialog.json;
          } else if (that.modelDialog.model == 2 && !that.modelDialog.creatMode) {
            that.questionnaire.model[that.modelDialog.index] = that.modelDialog.json;
          }
          that.questionnaire_put();
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已返回'
          });
        });
      }

    },

    openQuestionChoose: function() {
      let that = this;
      that.qusetionDialog.dialog = true;
      that.qusetionDialog.question = null;
      that.$axios.get('/api/question').then(function(rel) {
        console.log(rel)
        if (rel.data.code == 200) {
          that.qusetionDialog.list = rel.data.item;
        }
      }).catch(rel => {
        console.log(rel)
      });
    },
    questionAdd: function() {
      let that = this;
      that.$confirm('确定插入此问题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$axios.get('/api/question?id=' + that.qusetionDialog.question).then(function(rel) {
          console.log(rel)
          if (rel.data.code == 200) {
            let item = {
              id: rel.data.id,
              title: rel.data.title,
              active: false,
              type: rel.data.type,
              options: [],
            }
            for (let i in rel.data.options) {
              item.options.push({
                id: rel.data.options[i].id,
                option: rel.data.options[i].content,
                score: 0,
                goto: '',
              })
            }
            console.log(item)
            that.modelDialog.json.questions.push(item);
            that.qusetionDialog.dialog = false;
            that.qusetionDialog.question = null;
          }
        }).catch(rel => {
          console.log(rel)
        });
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已返回'
        });
      });
    },
    questionDel: function(e) {
      this.modelDialog.json.questions.splice(e, 1);
    },

    newModel: function(e) {
      console.log(e)
      let that = this;
      that.modelDialog.creatMode = true;
      that.modelDialog.model = 1;
      that.modelDialog.json.for = 0;
      if (e === "a") { //model_line
        that.modelDialog.model = 1;
        that.modelDialog.type = '流程模块';
      } else if (e === "b") {
        that.modelDialog.model = 2;
        that.modelDialog.type = '普通模块';
      } else if (e === "c") {
        that.modelDialog.model = 2;
        that.modelDialog.type = '医生模块';
        that.modelDialog.json.for = 1;
      }
      that.modelDialog.dialog = true;
    },
    showModelQuestion: function(m, e) {
      if (m === 'model_line') {
        this.questionnaire.model_line[e].active = !this.questionnaire.model_line[e].active
      } else {
        this.questionnaire.model[e].active = !this.questionnaire.model[e].active
      }
    },

    editModel: function(e, index, model) {
      console.log(e);
      let that = this;
      that.modelDialog.creatMode = false;
      that.modelDialog.dialog = true;
      that.modelDialog.json.id = e.id;
      that.modelDialog.json.start = e.start;
      that.modelDialog.json.end = e.end;
      that.modelDialog.json.time = e.time;
      that.modelDialog.json.interval = e.interval;
      that.modelDialog.json.title = e.title;
      that.modelDialog.json.remark = e.remark;
      that.modelDialog.json.questions = e.questions;
      if (e.for == 1) {
        that.modelDialog.json.for = e.for
      }
      that.modelDialog.type = '模块';
      that.modelDialog.model = model;
      that.modelDialog.index = index;
    },
    chooseHospital: function(e) {
      console.log(e);
      for (let i in this.infoDialog.util.hospitals) {
        if (e === this.infoDialog.util.hospitals[i].id) {
          this.infoDialog.subjects = this.infoDialog.util.hospitals[i].subjects;
        }
      }
    },
  },
  computed: {},
  watch: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.el-page-header {
    width: 100%;
}
</style>
