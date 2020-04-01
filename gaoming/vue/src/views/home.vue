<template>
<div class="home">
  <div class="mainBox">
    <div class="viewTitle">
      <a class="bt" v-bind:class="[index==artsActive?'active':'']" v-for="(item, index) in prisonList.Arts" @click="chooseArt(index,item.Name, item)"><i class="fa fa-building" aria-hidden="true"></i> {{item.Name}}</a>
    </div>
    <div class="viewContainer">
      <div v-for="(items,index) in artList.Floors" :class="[]">
        <div class="title">
          <div class="text">
            <a class="floorActive">
              <h5>{{items.Name}}</h5>
              <h6></h6>
            </a>
          </div>
          <div class="btn">
            <el-button @click="websocketsend_setDoor(2, items, 2,$event)" type="danger">打开整层</el-button>
            <el-button @click="websocketsend_setDoor(2, items, 3,$event)" type="warning">停止</el-button>
            <el-button @click="websocketsend_setDoor(2, items, 1,$event)" type="success">关闭整层</el-button>
          </div>
        </div>
        <a class="btn_scroll btn_left">
          <i class="fa fa-angle-left" aria-hidden="true"></i>
        </a>
        <div class="content">
          <div class="li" v-for="(item,index) in items.Doors" :class="[item.AlarmStatus?'warning':'',getStatus_door(item.Status)]">
            <!--  -->
            <!-- <a class="cancelWarning">消除报警</a> -->
            <div class="title">
              <a @click="openModel_query(item,items)">
                <i class="fa fa-chain-broken" aria-hidden="true"></i>
                <div class="text">
                  <h5>{{item.Name}}</h5>
                  <h6></h6>
                </div>
                <span v-show="item.LockStatus==1" class="lock"></span>
              </a>
            </div>
            <div class="line">
              <div class="progress" :style="'width:'+ item.Progress+ '%'">
              </div>
            </div>
            <div class="btn">
              <el-button @click="websocketsend_setDoor(3, item, 2,$event)" type="danger" plain>打开</el-button>
              <!--:disabled="item.Status==2||item.Status==5||item.Status==6?true:false"-->
              <el-button @click="websocketsend_setDoor(3, item, 3,$event)" type="warning" plain>停止</el-button>
              <!-- :disabled="item.Status==1||item.Status==2||item.Status==5?true:false"-->
              <!--v-show="item.Status==6||item.Status==7"-->
              <el-button @click="websocketsend_setDoor(3, item, 1,$event)" type="success" plain>关闭</el-button>
              <!-- :disabled="item.Status==1||item.Status==5||item.Status==7?true:false" -->
            </div>

            <div class="setTime">
              <button type="button" class="setTime" @click="openSetTimeViwe(item)">设置开门速度</button>
            </div>
          </div>
          <div class="last li"></div>
        </div>
        <a class="btn_scroll btn_right">
          <i class="fa fa-angle-right" aria-hidden="true"></i>
        </a>
      </div>

      <div class="diyDoors">
        <div class="title">
          <div class="text">
            <a class="floorActive">
              <h5>自定义门组</h5>
            </a>
          </div>
        </div>
        <div class="content">
          <div class="li" v-for="(itemd,indexd) in diyDoors[artsActive].doors" :key="indexd">
            <div class="title">
              <h5>{{itemd.Name}}</h5>
              <a class="diy" @click="openDiyDoorsModel(indexd)"><i class="fa fa-cog" aria-hidden="true"></i></a>
            </div>
            <div class="btn">
              <el-button @click="websocketsend_setDoor(4, itemd.Id, 2,$event)" type="danger" plain>打开</el-button>
              <el-button @click="websocketsend_setDoor(4, itemd.Id, 3,$event)" type="warning" plain>停止</el-button>
              <el-button @click="websocketsend_setDoor(4, itemd.Id, 1,$event)" type="success" plain>关闭</el-button>
            </div>
          </div>

          <div class="li add">
            <div class="title">
              <a @click="addDiyDoor">
                <h5>添加新门组</h5>
              </a>
            </div>
          </div>
        </div>
        <div class="last li"></div>
      </div>

    </div>
    <div class="bottomtools">
      <div class="btn">
        <el-button v-show="prisonList.Arts[artsActive].Name!='一监区'" @click="websocketsend_setDoor(1, prisonList.Arts, 2,$event)" type="danger"><i class="fa fa-unlock" aria-hidden="true"></i> 打开整栋</el-button>
        <el-button v-show="prisonList.Arts[artsActive].Name!='一监区'" @click="websocketsend_setDoor(1, prisonList.Arts, 3,$event)" type="warning"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> 停止</el-button>
        <el-button v-show="prisonList.Arts[artsActive].Name!='一监区'" @click="websocketsend_setDoor(1, prisonList.Arts, 1,$event)" type="success"><i class="fa fa-lock" aria-hidden="true"></i> 关闭整栋</el-button>
      </div>
      <div class="serve">
        <a v-for="(item, index) in prisonList.Arts[artsActive].Panels" :class="[item.Status==2?'working':'']"><i></i>{{item.No}}F面板</a>
        <a class="working" @click="openCamera()"><i></i>大安防视频</a>
      </div>
    </div>
  </div>

  <div class="model1" v-if="model1.show">
    <a class="btn" @click="closeModel1"><i class="fa fa-times" aria-hidden="true"></i></a>
    <div class="modelbox" :class="[model1.AlarmStatus?'warning':'']">
      <div class="normal animated fadeInLeft" :class="getStatus_door(model1.status)">
        <div class="title">
          <span v-if="model1.LockStatus==1" class="lock">门锁已落锁</span>
          <i class="fa fa-chain-broken" aria-hidden="true"></i>
          <div class="text">
            <h4>{{model1.prison}}<i></i>{{model1.floor}}<i></i>{{model1.room}}</h4>
            <h6></h6>
          </div>
        </div>
        <div class="line">
          <div class="progress" :style="'width: '+ model1.progress +'%'">
          </div>
        </div>
        <div class="btn">
          <el-button type="danger" @click="websocketsend_setDoor(3, model1.item, 2,$event)"><i class="fa fa-unlock" aria-hidden="true"></i> 打开监舍门</el-button>
          <!--:disabled="model1.status==2||model1.status==5||model1.status==6?true:false"-->
          <el-button type="warning" @click="websocketsend_setDoor(3, model1.item, 3,$event)"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> 停止</el-button>
          <!-- :disabled="model1.status==1||model1.status==2||model1.status==5?true:false" -->
          <!-- v-show="model1.status==7||model1.status==6" -->
          <el-button type="success" @click="websocketsend_setDoor(3, model1.item, 1,$event)"><i class="fa fa-lock" aria-hidden="true"></i> 关闭监舍门</el-button>
          <!--  :disabled="model1.status==1||model1.status==5||model1.status==7?true:false"-->
        </div>
      </div>
      <div class="main animated fadeInRight">
        <div class="text" style="display:none;">
          <h5>监舍门数据</h5>
          <ul>
            <li>
              <span>开门百分比</span>
              <span>{{model1.progress}}</span>
            </li>
            <li>
              <span>开门速度</span>
              <span>{{model1.speed}}</span>
            </li>
            <li>
              <span>开门平均速度</span>
              <span>{{model1.averageSpeed}}</span>
            </li>
            <li>
              <span>电压</span>
              <span>{{model1.voltage}}</span>
            </li>
            <li>
              <span>电流</span>
              <span>{{model1.electric}}</span>
            </li>
          </ul>
        </div>
        <div class="log">
          <h5>近5条门开关日志 <router-link to="/log/roomLog">更多</router-link>
          </h5>
          <ul>
            <li v-show="model1.logList.length==0">
              <h5>暂无数据</h5>
            </li>
            <li v-for="(item, index) in model1.logList">
              <i class="fa" :class="getOperate_class(item.OperateType)" aria-hidden="true"></i>
              <span class="time">{{item.CreationTime}}</span>
              <h5><span>{{getOperate(item.OperateType)}}</span><span>{{getLocation(item.Location)}}</span><span v-if="item.OperatorName">{{item.OperatorName}}</span></h5>
            </li>
          </ul>
        </div>
        <div class="log">
          <h5>近5条门报警日志 <router-link to="/log/warningLog">更多</router-link>
          </h5>
          <ul>
            <li v-show="model1.warningList.length==0">
              <h5>暂无数据</h5>
            </li>
            <li v-for="(item, index) in model1.warningList">
              <i class="fa fa-warning" aria-hidden="true"></i>
              <span class="time">{{item.CreationTime}}</span>
              <h6 class="li"><span>{{item.BuildingName}}-{{item.FloorName}}-{{item.DoorName}} 门警报!</span><span>警报类型 : {{getAlarm(item.AlarmCode)}}</span></h6>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bg"><a @click="closeModel1"></a></div>
  </div>


  <div class="model1 diyDoors_model" v-if="diyDoors_model.show">
    <!-- <a class="btn" @click="closeDiyDoorsModel"><i class="fa fa-times" aria-hidden="true"></i></a> -->
    <div class="diyDoors_model_box">
      <div class="title">
        编辑{{prisonList.Arts[artsActive].Name}}门组信息
      </div>
      <div class="content">
        <div class="object">
          <div class="title">
            <hr>
            <span>门组信息</span>
          </div>
          <ul class="input">
            <li><span>门组名称:</span>
              <div class="input">
                <el-input size="medium" placeholder="请输入组名" v-model="diyDoors[artsActive].doors[diyDoor_index].Name">
                </el-input>
              </div>
            </li>
          </ul>
        </div>
        <div class="object">
          <div class="title">
            <hr>
            <span>门组选择</span>
          </div>
          <ul class="diyDoors_box">
            <li class="groupDoor">
              <div class="floor" v-for="(item,index) in diyDoors_model.list" :key="index">
                <span>{{item.FloorName}}</span>
                <el-checkbox-group v-model="diyDoors[artsActive].doors[diyDoor_index].Id" size="small">
                  <el-checkbox border v-for="(items,indexs) in item.Doors" :label="items.DoorId">{{items.DoorName}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer">
        <el-button type="danger" plain size="medium " @click="delDiyDoor">删除</el-button>
        <el-button type="primary" plain size="medium " @click="closeDiyDoorsModel">返回并保存</el-button>
      </div>
    </div>
    <div class="bg"></div>
    <!-- <a @click="closeDiyDoorsModel"></a> -->
  </div>

</div>
</template>
<style lang="scss" scoped>
.log {
    > ul {
        > li {
            > h5 {
                width: 100%;
                display: flex;
                justify-content: flex-start;
                > span {
                    display: block;
                    width: 20%;
                    margin-right: 10px;
                }
            }
            > h6 {
                width: 100%;
                display: flex;
                justify-content: flex-start;
                > span {
                    display: block;
                    width: 50%;
                    margin-right: 10px;
                }
            }
        }

    }
}
.cancelWarning {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 12px;
    line-height: 20px;
    background: red;
    border-radius: 0 0 0 8px;
    padding: 0 8px;
    z-index: 99;
}
.diyDoors {
    height: 120px !important;
    > .title {
        > .text {
            height: 100% !important;
            a {
                h5 {
                    line-height: 120px !important;
                    font-size: 18px !important;
                }
            }
        }
    }
    > .content {
        > div.li {
            height: 96px !important;
            > .title {
                height: 50px !important;
                background: #03ada5 !important;
                h5 {
                    color: #fff;
                    font-size: 18px !important;
                    line-height: 50px !important;
                    padding: 0 10px !important;
                }
                > a.diy {
                    display: block !important;
                    height: 40px !important;
                    padding: 0 !important;
                    line-height: 40px !important;
                    font-size: 23px !important;
                    text-align: center !important;
                    width: 40px !important;
                    color: #fff !important;
                    position: absolute !important;
                    top: 5px !important;
                    right: 5px !important;
                    &:hover {
                        color: #ccc !important;
                    }
                    > i.fa {
                        line-height: 40px !important;
                        font-size: 23px !important;
                        width: 100% !important;
                        height: 100% !important;
                        margin: 0 !important;
                    }
                }
            }
            &.add {
                > .title {
                    height: 90px !important;
                    background: none !important;
                    h5 {
                        color: #999 !important;
                        line-height: 70px !important;
                        text-align: center!important;
                        width: 100% !important;
                    }
                }
            }
        }
    }
}
.diyDoors_model_box {
    position: relative;
    background: #fff;
    z-index: 999;
    border-radius: 5px;
    > .title {
        padding: 0 20px;
        border-bottom: 1px solid #ddd;
        line-height: 52px;
        font-size: 18px;
    }
    > .content {

        padding: 20px;
        > div.object {
            margin-bottom: 30px;
            > div.title {
                position: relative;
                padding: 12px 0;
                margin-bottom: 10px;

                > hr {
                    width: 100%;
                    height: 1px;
                    background: #ddd;
                    border: none;
                    outline: none;
                    margin: 0;
                }

                > span {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 20px;
                    height: 25px;
                    line-height: 25px;
                    color: #666;
                    background-color: #fff;
                    font-size: 12px;
                    padding: 0 15px;
                }
            }
            > .diyDoors_box {
                > li > .floor {
                    border-radius: 5px;
                    padding: 10px;
                    border: 1px solid #ddd;
                    margin-bottom: 10px;
                    > span {
                        font-size: 16px;
                        margin-bottom: 10px;
                        display: block;
                    }
                }
            }
            ul.input {
                > li {
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: 15px;

                    > span {
                        color: #666;
                        width: 150px;
                        line-height: 36px;
                        font-size: 12px;
                        padding-right: 20px;
                        text-align: right;
                    }

                    > div.input {
                        width: 400px;
                    }

                    ul.inputBox {
                        width: 400px;
                        padding: 10px;
                        border-radius: 4px;
                        background-color: #eee;
                        position: relative;
                        margin-bottom: 20px;

                        > li {
                            display: flex;
                            margin-bottom: 10px;
                            flex-shrink: 0;
                            flex-grow: 0;

                            &:last-child {
                                margin-bottom: 0;
                            }

                            > span {
                                width: 100px;
                                line-height: 36px;
                                font-size: 12px;
                                color: #999;
                                padding-right: 10px;
                                text-align: right;
                            }
                        }

                        > .btn_del {
                            position: absolute;
                            left: calc(100% + 20px);
                            top: 50%;
                            margin-top: -14px;
                        }
                    }

                    > .el-checkbox {
                        line-height: 34px;
                        background-color: #f5f5f5;
                        padding: 0 10px;
                        border-radius: 5px;
                        border: 1px solid #ddd;
                        color: #999;
                    }

                    .btn_add {
                        width: 400px;
                    }
                }
            }
        }
    }
    .footer {
        padding: 20px;
        border-top: 1px solid #ddd;
        text-align: right;
    }
}
</style>
<script>
export default {
  data() {
    return {
      websock: null,
      markShow: false,
      model1: {
        show: false,
        prison: '未知监区',
        prisonId: '',
        floor: '未知楼层',
        floorId: '',
        room: '未知监舍',
        doorId: '',
        status: '未知',
        progress: 0,
        PLCIp: '',
        AlarmStatus: false,
        LockStatus: 1,
        Webcams:[],
        speed: 0,
        averageSpeed: 0,
        voltage: 0,
        electric: 0,
        logList: [],
        warningList: [],
        item: {},
      },

      prisonList: this.$store.state.prison.list,
      doorsIdList: [],
      artList: [],
      artsActive: 0,
      floorStatus: [],

      diyDoors_num: 3,
      diyDoor_index: null,
      diyDoors_model:{
        show: false,
        btnLoading_submit: false,
        list:[],
        checked:[],
        id:[],
        name:'',
      },
      diyDoors:[],

      openTimeDoorId: [],
      openTime: 4,
      interval: null,
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.initWebSocket();
  },
  mounted: function() {
    let this_ = this;
    $(document).on('click', 'div.allMark', function() {
      $('.viewContainer').removeClass('blur');
      $('.viewContainer>div').removeClass('active');
      $('div.allMark').fadeOut();
    });
    $(document).on('click', 'a.floorActive', function() {
      $('div.allMark').fadeIn();
      $(this).parents(".title").parent().addClass('active');
      $(this).parents(".viewContainer").addClass('blur')
    });

    $(document).on('click', 'a.btn_scroll', function() {
      // console.log($(this).parent().children('div.content'));
      var divWidth = $(this).parent().children('div.content').width()
      var child = $(this).parent().children('div.content').children().length - 1;
      var childWidth = 259;
      var childDisplay = parseInt(divWidth / childWidth);
      var x1 = parseInt($(this).parent().children('div.content').css("left").replace(/[^0-9]/ig, "")) / childWidth;
      var x2 = child - childDisplay - x1;
      if ($(this).hasClass('btn_right')) {
        if (x2 > 0) {
          $(this).parent().children('div.content').css("left", 0 - (childWidth * (x1 + 1)));
        }
      } else if ($(this).hasClass('btn_left')) {
        if (x1 > 0) {
          $(this).parent().children('div.content').css("left", 0 - (childWidth * (x1 - 1)));
        }
      }
    });
    this.refrash();
  },
  beforeDestroy: function() {
    this.websock.close();
    clearInterval(this.interval);
  },
  destroyed: function() {
    this.websock.close();
    clearInterval(this.interval);
  },
  methods: {
    refrash:function(){
      let that = this;
      this.interval = setInterval(function(){
        let unline = 0;
        let all = 0;
        for(let i in that.artList.Floors){
          for(let n in that.artList.Floors[i].Doors){
            all = all+1;
            if(that.artList.Floors[i].Doors[n].Status==5){
              unline = unline + 1;
            }
          }
        }
        let p = unline/all
        // console.log(p)
        // console.log(unline)
        // console.log(all)
        if(unline>=2||p>0.2){
          // that.websocketsend_getStatus();
          that.$router.go(0)
        }
      }, 60000);
    },
    openDiyDoorsModel: function(d){
      this.diyDoors_model.show=true;
      this.getDiyDoorsTree();
      this.diyDoor_index = d;
    },
    closeDiyDoorsModel: function(){
        this.diyDoors_model.show=false;
        this.saveDiyDoors();
    },
    delDiyDoor: function(){
      this.diyDoors[this.artsActive].doors.splice(this.diyDoor_index, 1)
        this.closeDiyDoorsModel();
    },
    getDiyDoorsTree: function() {
      let that = this;
      let list = that.prisonList.Arts[that.artsActive].Floors;
      let tempList = [];
      for(let i in list){
        tempList.push({
          FloorName: list[i].Name,
          FloorId: list[i].Id,
          Doors: [],
        })
        for(let n in list[i].Doors){
          tempList[i].Doors.push({
            DoorId: list[i].Doors[n].Id,
            DoorName: list[i].Doors[n].Name,
          })
        }
      }
      that.diyDoors_model.list = tempList;
      console.log(that.diyDoors_model.list)
    },
    // getDiyDoorsChecked :function(){
    //   console.log(this.diyDoors[this.artsActive].Doors[this.diyDoor_index].Id)
    // },
    addDiyDoor : function(){
      console.log(this.diyDoors);
      this.diyDoors[this.artsActive].doors.push({
          Id: [],
          Name: "",
      });
      this.openDiyDoorsModel(this.diyDoors[this.artsActive].doors.length-1)
    },
    getDiyDoors: function(){
      // console.log(this.diyDoors);
      // console.log(localStorage.diyDoorsList);
      let username = localStorage.userName_gaomin;
      let diyDoorsList;
      let finded = 0;
      if(localStorage.diyDoorsList){
        diyDoorsList = JSON.parse(localStorage.diyDoorsList);
      }else{
        diyDoorsList = []
      }
      for(let i in diyDoorsList){
        if(diyDoorsList[i].username == username){
          this.diyDoors = diyDoorsList[i].diyDoors;
          finded = 1;
        }
      }
      if(finded == 0){
        for(let i in this.prisonList.Arts){
          this.diyDoors.push({
            doors: [],
          });
        }
      }

    },
    saveDiyDoors: function(){
      let that = this;
      let finded = 0;
      let username = localStorage.userName_gaomin;
      let diyDoorsList;
      console.log(that.diyDoors)
      if(localStorage.diyDoorsList){
        diyDoorsList = JSON.parse(localStorage.diyDoorsList);
      }else{
        diyDoorsList = []
      }
      console.log(diyDoorsList)
      for(let i in diyDoorsList){
        if(diyDoorsList[i].username == username){
          finded = 1;
          diyDoorsList[i].diyDoors = that.diyDoors;
        }
      }
      if(finded == 0){
        diyDoorsList.push({
          username : username,
          diyDoors: that.diyDoors,
        })
      }
      localStorage.diyDoorsList = JSON.stringify(diyDoorsList);
      console.log(localStorage.diyDoorsList);
    },

    closeModel1: function() {
      this.markShow = false;
      this.model1.show = false;
    },
    openModel1: function() {
      this.markShow = true;
      this.model1.show = true;
    },

    chooseArt: function(i, name, item) {
      console.log(item)
      this.artsActive = i;
      this.artList = this.prisonList.Arts[i];
      this.model1.prison = name;
      this.model1.prisonId = item.Id;
    },
    getStatus_door: function(i) {
      if (i == 1) {
        return 'closed'
      } else if (i == 2) {
        return 'open'
      } else if (i == 3) {
        return 'stop'
      } else if (i == 4) {
        return 'on'
      } else if (i == 5) {
        return 'off'
      } else if (i == 6) {
        return 'ing openning'
      } else if (i == 7) {
        return 'ing closing'
      }
    },

    getStatus_floor: function(e) {
      // console.log(e);
      let doors = [];
      for (let i in e) {
        doors.push(e[i].Status);
      }
      if (doors.indexOf("6") != -1 || doors.indexOf("7") != -1) {
        return "ing"
      } else if (doors.indexOf("1") == -1 && doors.indexOf("2") == -1 && doors.indexOf("3") == -1 && doors.indexOf("4") == -1 && doors.indexOf("6") == -1 && doors.indexOf("7") == -1) {
        return "off"
      } else if (doors.indexOf("5") == -1 && doors.indexOf("2") == -1 && doors.indexOf("3") == -1 && doors.indexOf("4") == -1 && doors.indexOf("6") == -1 && doors.indexOf("7") == -1) {
        return "closed"
      } else if (doors.indexOf("1") == -1 && doors.indexOf("5") == -1 && doors.indexOf("3") == -1 && doors.indexOf("4") == -1 && doors.indexOf("6") == -1 && doors.indexOf("7") == -1) {
        return "open"
      }
    },
    getStatus_building: function() {

    },

    //WebSocket
    initWebSocket: function() {
      // const link = 'ws://192.168.0.22:6001/Extension/GSocket/WSHandler.ashx?user=' + this.$store.state.user.userName;　　
      // const link = 'ws://192.168.0.13:3150/Extension/GSocket/WSHandler.ashx?user=' + this.$store.state.user.userName;　　
      const link = 'ws://10.43.63.55:5001/Extension/GSocket/WSHandler.ashx?user=' + this.$store.state.user.userName;　　　　　　　　
      this.websock = new WebSocket(link);　　　　　　　　
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;　　　　　　　　
      this.websock.onclose = this.websocketclose;　　　　
    },
    websocketonopen: function(data) {　　　　　　　　
      console.log("WebSocket连接成功");　　　　　　
    },
    websocketonerror: function(e) {
      console.log("WebSocket连接发生错误" + e);　　　　　　
    },
    websocketonmessage: function(e) {　　
      let that = this;
      let jsonData = JSON.parse(e.data);
      // console.log(jsonData);
      let key = jsonData.Key;
      let data = jsonData.Data;
      // console.log(data);
      // console.log(key);
      if (key == 4) {
        that.prisonList = data.Data;
        that.$store.state.prison.list = data.Data;
        that.getDiyDoors();
        if(data.Data.Arts.length>0){
          let list = data.Data;
          that.artList = list.Arts[that.artsActive];
          that.model1.prison = list.Arts[that.artsActive].Name;
          that.model1.prisonId = list.Arts[that.artsActive].Id;
          let arts = list.Arts;
          for (let i in arts) {
            let floors = arts[i].Floors;
            for (let n in floors) {
              let doors = floors[n].Doors;
              for (let s in doors) {
                that.doorsIdList.push(doors[s].Id);
              }
            }
          }
          this.websocketsend_getStatus();
          console.log(that.artList);
          console.log(that.prisonList.Arts[that.artsActive].Id);
        }
      } else if (key == 0) {
        let building = that.prisonList.Arts;
        for (let i in building) {
          if (data.ArtId == building[i].Id) {
            // console.log(building[i]);
            let floor = building[i].Floors;
            for (let n in floor) {
              if (data.FloorId == floor[n].Id) {
                // console.log(floor[n]);
                let door = floor[n].Doors;
                for (let s in door) {
                  if (data.DoorId == door[s].Id) {
                    door[s].Status = data.DoorStatus;
                    door[s].Progress = data.Progress;
                    door[s].LockStatus = data.LockStatus;
                    door[s].AlarmStatus = data.AlarmStatus;
                    console.log(that.artList);

                    if (that.model1.show == true) {
                      if (that.model1.doorId == data.DoorId) {
                        that.model1.status = data.DoorStatus;
                        that.model1.AlarmStatus = data.AlarmStatus;
                        that.model1.LockStatus = data.LockStatus;
                        that.model1.progress = data.Progress;
                        that.model1.item = data;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else if (key == 2) {
        // console.log(data);
        // console.log(that.prisonList);
        for (let i in that.prisonList.Arts) {
          if (data.ArtId == that.prisonList.Arts[i].Id) {
            for (let n in that.prisonList.Arts[i].Panels) {
              if (data.FloorNo == that.prisonList.Arts[i].Panels[n].No) {
                that.prisonList.Arts[i].Panels[n].Status = data.Status;
              }
            }
          }
        }
      }
    },
    websocketsend_setDoor: function(prison, item, status, e) {
      console.log(item);
      // var obj = document.getElementById("cam").contentWindow;
      // obj.document.getElementById("file").style.display = "none";
      // this.closeCamera();
      let that = this;
      let doorsId = [];
      let camId = [];
      if (prison == 3) {
        doorsId.push(item.Id);
        camId = item.Webcams;
      } else if (prison == 2) {
        camId = item.Webcams;
        for (let n in item.Doors) {
          doorsId.push(item.Doors[n].Id);
        }
      } else if (prison == 1) {
        camId = item[that.artsActive].Webcams;
        let floors = item[that.artsActive].Floors;
        for (let n in floors) {
          let doors = floors[n].Doors;
          for (let s in doors) {
            doorsId.push(doors[s].Id);
          }
        }
      } else if(prison == 4){
        for(let d in item){
          doorsId.push(item[d]);
        }
      }
      console.log(doorsId);
      // console.log(camId);
      // if (camId.length > 0) {
      //   for (let i in camId) {
      //     let num = parseInt(i) + 1;
      //     console.log(num);
      //     console.log(camId[i]);
      //     console.log(item);
      //     // this.StartFrameLive(num, camId[i],item);
      //     // this.$notify.info({
      //     //   message: '第' + num + "个窗口播放! cameraID:" + camId[i] + "!",
      //     //   title: '消息',
      //     // });
      //   };
      // }
      let data = {
        "Key": 1,
        "Data": {
          "DoorIds": doorsId,
          "Status": status
        },
      };
      // console.log(e);
      // el.addClass('is-loading');
      this.websock.send(JSON.stringify(data), function(rel) {
        // console.log(rel);
      });　
      // this.openCamera();
    },
    websocketsend_getStatus: function() {
      let that = this;
      let data = {
        "Key": 0,
        "Data": {
          "DoorIds": that.doorsIdList
        },
      };
      this.websock.send(JSON.stringify(data));　　
    },

    websocketsend_setOpenTime: function(id,value) {
      let that = this;
      let data = {
        "Key": 4,
        "Data": {
          "DoorIds": [id],
          "Time": value
        },
      };
      this.websock.send(JSON.stringify(data));　　
    },
    openSetTimeViwe: function(item){
      console.log(item.Id);
      let that = this;
      that.$prompt('请输入开门速度,范围为2-6,为空视为默认值4', '设置开门速度', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[2-6]$/,
          inputErrorMessage: '请输入2至6间的整数'
        }).then(({ value }) => {
          // that.$message({
          //   type: 'success',
          //   message: '你设置的速度是: ' + value
          // });
          that.websocketsend_setOpenTime(item.Id,value);
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '取消输入'
          });
        });
    },
    websocketclose(e) {
      console.log("connection closed");　　　　　
    },

    openModel_query: function(item, items) {
      let that = this;
      console.log(that.model1.prisonId);
      that.model1.floor = items.Name;
      that.model1.floorId = items.Id;
      that.model1.room = item.Name;
      that.model1.doorId = item.Id;
      that.model1.progress = item.Progress;
      that.model1.status = item.Status;
      that.model1.PLCIp = item.PLCIp;
      that.model1.AlarmStatus = item.AlarmStatus;
      that.model1.LockStatus = item.LockStatus;
      that.model1.Webcams = item.Webcams;
      that.model1.show = true;
      that.model1.item = item;

      that.axios.post('/api/doorHty/GetDoorHties', {
        "offset": 0,
        "limit": 5,
        "ArtId": that.model1.prisonId,
        "FloorId": that.model1.floorId,
        "DoorId": that.model1.doorId,
        "StartTime": '',
        "EndTime": '',
        "PoliceName": '',
      }).then(function(rel) {
        if (rel.status == 200) {
          console.log(rel);
          that.model1.logList = rel.data.rows;
        }
      }).catch(rel => {
        console.log(rel);
        that.$message({
          message: '获取列表失败,请刷新',
          type: 'warning'
        });
      });

      that.axios.post('/api/alarmHty/GetAlarms', {
        "offset": 0,
        "limit": 5,
        "ArtId": that.model1.prisonId,
        "FloorId": that.model1.floorId,
        "DoorId": that.model1.doorId,
        "StartTime": '',
        "EndTime": '',
        "Police": '',
      }).then(function(rel) {
        if (rel.status == 200) {
          console.log(rel);
          that.model1.warningList = rel.data.rows;
        }
      }).catch(rel => {
        console.log(rel);
        that.$message({
          message: '获取列表失败,请刷新',
          type: 'warning'
        });
      });
    },
    getOperate: function(e) {
      if (e == 1) {
        return "监舍门关闭"
      } else if (e == 2) {
        return "监舍门开启"
      } else if (e == 3) {
        return "监舍门停止"
      }
    },
    getOperate_class: function(e) {
      if (e == 1) {
        return "fa-circle"
      } else if (e == 2) {
        return "fa-circle-o"
      } else if (e == 3) {
        return "fa-warning"
      }
    },
    getLocation: function(e) {
      if (e == 0) {
        return "分控室"
      } else if (e == 1) {
        return "楼层值班室"
      } else if (e == 2) {
        return "总控室"
      } else if (e == 3) {
        return "门禁打卡"
      }
    },
    getAlarm: function(e) {
      if (e == 1) {
        return "非法开门"
      } else if (e == 2) {
        return "关门超时"
      } else if (e == 3) {
        return "门未开启"
      } else if (e == 4) {
        return "门遇阻停"
      }
    },

    iframe_FunctionTest: function() {
      // console.log("iframe_FunctionTest");
      this.openCamera();
      var obj = document.getElementById("cam").contentWindow;
      obj.document.getElementById("file").style.display = "none";
      var ifmObj = obj.document.getElementById("UserNameText");
      console.log(obj.g_imosActivePlayer);
      // obj.DoGetAllCamList();
    },

    openCamera: function() {
      $('body').addClass('hasCamera');
    },
    closeCamera: function() {
      $('body').removeClass('hasCamera');
      this.StopFrameLive();
    },

    StartFrameLive: function(num, id,item) {
      let that = this;
      let obj = document.getElementById("cam").contentWindow;

      let n ;
      if(item.Webcams){
        n = item.Webcams.length;
      }else if(item[that.artsActive].Webcams){
        n = item[that.artsActive].Webcams.length;
      }
      if(n==1){
        obj.g_imosActivePlayer.IMOSAX_ChangeLayout(1);
      }else if(n>1&&n<=4){
        obj.g_imosActivePlayer.IMOSAX_ChangeLayout(4);
      }else if(n>4&&n<=6){
        obj.g_imosActivePlayer.IMOSAX_ChangeLayout(6);
      }else if(n>6&&n<=8){
        obj.g_imosActivePlayer.IMOSAX_ChangeLayout(8);
      }else if(n>8&&n<=9){
        obj.g_imosActivePlayer.IMOSAX_ChangeLayout(9);
      }else if(n>9&&n<=10){
        obj.g_imosActivePlayer.IMOSAX_ChangeLayout(10);
      }else if(n>10&&n<=13){
        obj.g_imosActivePlayer.IMOSAX_ChangeLayout(13);
      }else if(n>13&&n<=16){
        obj.g_imosActivePlayer.IMOSAX_ChangeLayout(16);
      }else if(n>16&&n<=17){
        obj.g_imosActivePlayer.IMOSAX_ChangeLayout(17);
      }else if(n>17){
        obj.g_imosActivePlayer.IMOSAX_ChangeLayout(25);
      }
      obj.g_imosActivePlayer.IMOSAX_StartFrameLive(num, id);
    },
    StartVodReplay: function(num, id, start, end) {
      let obj = document.getElementById("cam").contentWindow;
      obj.g_imosActivePlayer.IMOSAX_StartVodReplay(num, id, start, end);
    },
    StartDownMediaStream: function(id, start, end) {
      let obj = document.getElementById("cam").contentWindow;
      obj.g_imosActivePlayer.IMOSAX_StartDownMediaStream(id, start, end);
    },
    StopFrameLive: function() {
      let obj = document.getElementById("cam").contentWindow;
      let n = obj.g_imosActivePlayer.IMOSAX_GetFrameNum();
      console.log(n);
      for (let i = 1; i <= n; i++) {
        obj.g_imosActivePlayer.IMOSAX_StopFramelive(i);
      }
    },
  },
  computed: {
  },
  components: {},
}
  </script>
