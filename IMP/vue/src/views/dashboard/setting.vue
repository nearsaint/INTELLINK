<template>
<div class="dashboard_setting">
  <header class="routerHeader">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/dashboard' }">驾驶舱</el-breadcrumb-item>
      <el-breadcrumb-item>配置窗口</el-breadcrumb-item>
    </el-breadcrumb>
    <el-page-header @back="$goRouter.back()" content="配置窗口">
    </el-page-header>
  </header>

  <div class="setting">
    <div class="title">
      <h3>配置窗口</h3>
      <p>{{id==''||id==null?'创建新窗口':'编辑窗口 | ID:'+id}}</p>
    </div>
    <el-tabs tab-position="top" type="card" class="">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-tickets"></i> 基础配置</span>
        <div class="view">
          <ul>
            <h5>窗口信息</h5>
            <li v-show="id!=null||id!=''">
              <span>ID</span>
              <div>
                <el-input size="medium" v-model="id" disabled>
                </el-input>
              </div>
            </li>
            <li>
              <span>标题</span>
              <div>
                <el-input size="medium" placeholder="title" v-model="title">
                </el-input>
              </div>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-coin"></i> 数据配置</span>
        <div class="view">
          <div class="line"><span>选择数据</span></div>
          <template v-for="(items,index_i) in data.data">
            <ul>
              <h5>数据分类</h5>
              <li>
                <span>分类</span>
                <div>
                  <el-select size="medium" placeholder="请选择" v-model="items.kind">
                    <el-option v-for="(kind,index_kind) in json.dataKind_options" :value="kind.value" :disabled="kind.disabled" :label="kind.label"></el-option>
                  </el-select>
                </div>
              </li>
              <li v-show="items.kind=='model'">
                <span>统计模型</span>
                <div>
                  <el-select size="medium" placeholder="请选择" v-model="items.id" :change="chooseID(items.id,items.kind,index_i)">
                    <template v-for="(m,i) in dataList" v-if="dataList[i].name=='model'">
                      <el-option v-for="(model,index_model) in dataList[i].list" :value="model.id" :label="model.name"></el-option>
                    </template>
                  </el-select>
                </div>
              </li>
            </ul>
            <ul v-show="items.id!=0||items.id!=null">
              <h5>数据信息</h5>
              <li>
                <span>数据ID</span>
                <div>
                  <el-input size="medium" disabled v-model="items.id">
                  </el-input>
                </div>
              </li>
              <li>
                <span>数据类型</span>
                <div>
                  <el-select size="medium" placeholder="请选择" v-model="items.type" disabled>
                    <el-option v-for="(type,index_type) in json.type_options" :value="type.value" :label="type.label"></el-option>
                  </el-select>
                </div>
              </li>
            </ul>
            <div class="dotline" v-show="data.data[0].id!=''||data.data[0].id!=null"></div>
          </template>


          <div class="btnline" v-show="data.data[0].id!=''||data.data[0].id!=null">
            <el-button v-show="data.data[1]" type="danger" size="small" plain @click="removeID">删除</el-button>
            <el-button type="primary" size="small" plain @click="addID">添加</el-button>
          </div>

          <div class="line" v-show="data.data[0].id!= 0"><span>配置数据需求</span></div>

          <ul v-show="data.data[0].id!=''||data.data[0].id!=null">
            <h5>配置时间性质参数</h5>
            <li>
              <span>实时性</span>
              <div>
                <el-select size="medium" placeholder="请选择" v-model="data.real">
                  <el-option v-for="(real,index_real) in json.real_options" :value="real.value" :label="real.label"></el-option>
                </el-select>
              </div>
            </li>
            <li v-show="data.real==true">
              <span>刷新时间(秒)</span>
              <div>
                <el-input-number size="medium" v-model="data.refresh">
                </el-input-number>
              </div>
            </li>
            <li v-show="data.real==false">
              <span>开始时间</span>
              <div>
                <el-date-picker size="medium" v-model="data.time.start" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </li>
            <li v-show="data.real==false">
              <span>结束时间</span>
              <div>
                <el-date-picker size="medium" v-model="data.time.end" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </li>
          </ul>
          <ul v-show="data.data[0].id!=''||data.data[0].id!=null">
            <h5>配置取值</h5>
            <li v-show="data.data[0].type==1||data.data[0].type==2">
              <span>取值方式</span>
              <div>
                <el-select size="medium" placeholder="请选择" v-model="data.interval">
                  <el-option v-for="(interval,index_interval) in json.interval_options" :value="interval.value" :label="interval.label"></el-option>
                  <el-option v-if="data.real == false" value="count" label="个数"></el-option>
                </el-select>
              </div>
            </li>
            <li v-show="data.real == false && data.interval=='diy' && (data.data[0].type==1||data.data[0].type==2)">
              <span>间隔自定义</span>
              <div>
                <el-input-number size="medium" v-model="data.interval_diy">
                </el-input-number>
              </div>
            </li>
            <li v-show="data.real == true  || (data.real == false && data.interval=='count')">
              <span>个数</span>
              <div>
                <el-input-number size="medium" v-model="data.count">
                </el-input-number>
              </div>
            </li>
            <li v-show="data.interval!='s' && (data.data[0].type==1||data.data[0].type==2)">
              <span>取样规则</span>
              <div>
                <el-select size="medium" placeholder="请选择" v-model="data.rule">
                  <el-option v-for="(rule,index_rule) in json.rule_options" :value="rule.value" :label="rule.label"></el-option>
                </el-select>
              </div>
            </li>
            <li v-show="data.data[0].type==1||data.data[0].type==2">
              <span>精度</span>
              <div>
                <el-input-number size="medium" v-model="data.accuracy">
                </el-input-number>
              </div>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-s-operation"></i> 样式配置</span>
        <div class="view">
          <ul>
            <h5>图表信息</h5>
            <li>
              <span>类型</span>
              <div>
                <el-input size="medium" v-model="id" disabled>
                </el-input>
              </div>
            </li>
          </ul>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="btnContainer">
      <el-button type="primary" @click="saveSetting">{{id==null||id==''?'创建窗口':'确认修改'}}</el-button>
      <!-- <el-button>取消</el-button> -->
    </div>
  </div>
</div>
</template>

<script>
import JSON from './setting_json.js'
import {
  DASHBOARD_CONTAINER_LIST,
  DASHBOARD_CONTAINER_ADD,
  DASHBOARD_CONTAINER_EDIT,
  DATA_LIST
} from 'api/api'
export default {
  data() {
    return {
      id: null,
      title: '',
      json: JSON,
      dataList: [],
      data: {
        real: 1,
        refresh: 1,
        time_choose: '',
        time: {
          start: '',
          end: '',
        },
        count: 20,
        interval: 'D',
        interval_diy: '',
        accuracy: 2,
        rule: 1,
        data: [{
          id: '',
          kind: '',
          title: '',
          type: '',
        }]
      },
      chart: {

      }
    }
  },
  created() {
    this.dataList_get();
    this.$goRouter.query(this).then((query) => {
      this.id = query.id;
    }).then(() => {
      if (this.id == '' || this.id == null) {
        // this.item_get();
      } else {
        this.item_get();
      }
    }).catch(() => {
      this.id = '';
    })
  },
  mounted() {},
  destroyed() {},
  methods: {
    item_get: function() {
      DASHBOARD_CONTAINER_LIST({
        id: this.id
      }).then((data) => {
        let res = data.data.res
        this.id = res.id;
        this.title = res.title;
        this.data.real = res.data.real;
        this.data.refresh = res.data.refresh;
        this.data.rule = res.data.rule;
        this.data.interval = res.data.interval;
        this.data.accuracy = res.data.accuracy;
        this.data.time.start = res.data.time[0];
        this.data.time.end = res.data.time[1];
        for (let i in res.data.data) {
          if (i == 0) {
            this.data.data[i].id = res.data.data[i].id;
            this.data.data[i].type = res.data.data[i].type;
            this.data.data[i].title = res.data.data[i].name;
            this.data.data[i].kind = res.data.data[i].kind;
          } else {
            this.data.data.push({
              id: res.data.data[i].id,
              type: res.data.data[i].type,
              title: res.data.data[i].name,
              kind: res.data.data[i].kind,
            })
          }
        }
      })
    },
    dataList_get: function() {
      DATA_LIST().then(data => {
        this.dataList = data.data.res
      })
    },
    chooseID: function(id, kind, index) {
      let dataList = this.dataList;
      if (id != '' && this.data.data.length == index + 1) {
        for (let i in dataList) {
          if (kind == dataList[i].name) {
            let list = dataList[i].list
            for (let n in list) {
              if (id == list[n].id) {
                let data = this.data.data
                data[index].type = list[n].type;
                return
                // TODO:
                // 限制类型不同导致数据冲突
              }
            }
          }
        }
      }
    },
    addID: function() {
      this.data.data.push({
        id: '',
        kind: '',
        title: '',
        type: '',
        typeName: '',
      })
    },
    removeID: function() {
      this.data.data.pop();
    },
    saveSetting: function() {
      let pram;
      let dataList = [];
      pram = {
        'id': this.id,
        'title': this.title,
        'data': {
          'real': this.data.real,
          'count': this.data.count,
          'refresh': this.data.refresh,
          'interval': this.data.interval,
          'rule': this.data.rule,
          'accuracy': this.data.accuracy,
          'time': {
            'startEnd': [this.data.time.start, this.data.time.end],
          },
          'data': dataList
        },
        'chart': {},
      }
      for (let i in this.data.data) {
        dataList.push({
          'id': this.data.data[i].id
        })
      }
      if (this.id == null || this.id == '') {
        DASHBOARD_CONTAINER_ADD(pram).then((res) => {
          console.log(res);
          this.$goRouter.to('/dashboard')
        })
      } else {
        DASHBOARD_CONTAINER_EDIT(pram).then((res) => {
          console.log(res);
          this.$goRouter.to('/dashboard')
        })
      }
    }
  },
  computed: {},
  watch: {},
  components: {},
}
</script>
<style lang="scss" scoped>
.dashboard_setting {
    padding: 10px;
    > .setting {
        height: 100%;
        width: 100%;
        background-color: #fff;
        padding: 10px 15px;
        > .title {
            h3 {
                font-size: 28px;
                font-weight: 400;
                color: #444;
            }
            p {
                margin: 10px 0 0;
                color: #999;
                font-size: 14px;
            }
            margin-bottom: 20px;
        }
        > .btnContainer {
            padding: 10px 0;
            display: flex;
            justify-content: flex-end;
        }
        > .el-tabs {
            .view {
                height: 100%;
                width: 100%;
                overflow-y: scroll;
                overflow-x: hidden;
                border: 1px solid #E4E7ED;
                border-top: 1px solid transparent;
                border-radius: 0 0 4px 4px;
                padding: 20px;
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;

                > .line {
                    width: 100%;
                    height: 1px;
                    margin: 20px 0;
                    background-color: #ddd;
                    > span {
                        background-color: #fff;
                        font-size: 12px;
                        color: #ccc;
                        line-height: 20px;
                        padding: 0 3px;
                        display: table;
                        // width: 4em;
                        margin: -10px 0 0 10px;
                    }
                }
                > .dotline {
                    width: 100%;
                    height: 0;
                    margin: 0;
                    border-bottom: 1px dashed #ddd;
                }
                > .btnline {
                    width: 100%;
                    margin-bottom: 10px;
                    padding: 10px 0;
                    text-align: center;
                }
                > ul {
                    padding: 10px;
                    flex-shrink: 1;
                    > h5 {
                        font-size: 13px;
                        color: #999;
                        margin: 0 0 10px;
                    }
                    > .line {
                        border: 1px dashed #ddd;
                    }
                    > li {
                        display: flex;
                        background-color: #eee;
                        justify-content: flex-end;
                        margin: 5px 0;
                        height: 40px;
                        padding: 2px;
                        width: 100%;
                        border-radius: 5px;
                        color: #444;
                        > span {
                            width: auto;
                            line-height: 36px;
                            padding: 0 20px;
                            font-size: 13px;
                            text-align: center;
                            display: block;
                            flex-grow: 1;
                        }
                        > div {
                            flex-grow: 0;
                            flex-shrink: 0;
                            width: 200px;
                            > * {
                                width: 100%;
                            }
                        }
                    }
                }
            }
        }
    }

}
</style>
<style lang="scss">
.dashboard_setting {
    .el-tabs__header.is-top {
        margin: 0 !important;
    }
}
</style>
