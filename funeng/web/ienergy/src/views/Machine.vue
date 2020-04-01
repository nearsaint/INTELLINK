<template>
<div class="machine clr">

  <div class="floatLeft_a">
    <div class="search">
      <button class="clearsearch" v-show="inhaul.searching" @click="clearSearch">清除</button>
      <h6>搜索</h6>
      <at-input class="searchInput" v-model="inhaul.search" size="large" placeholder="输入您要找的设备" @change="searching"></at-input>
      <h6>分类</h6>
      <at-select v-model="inhaul.active" size="large" @on-change="chooseInhaul">
        <at-option :value="0">设备类型分类</at-option>
        <at-option :value="1">区域分类</at-option>
        <at-option :value="2">数采单元分类</at-option>
        <at-option :value="3">工厂分类</at-option>
      </at-select>
    </div>
    <!-- <at-menu class="menu" route inline-collapsed>
      <at-menu-item :to="{ path: '/machine/machineAll' }">总览</at-menu-item>
      <at-submenu v-for="(group, index_g) in iot.group" :key="index_g" opened>
        <template slot="title">{{group.GroupName}}</template>
        <at-menu-item v-for="(machine, index_m) in group.Machine" :key="index_m" :to="{ path: '/machine/propertys/'+machine.MachineId, query: {'machineId':machine.MachineId}  }">{{machine.MachineName}}</at-menu-item>
      </at-submenu>
    </at-menu> -->
    <el-menu class="menu" router="true"background-color="#BBBBBB" text-color="#fff" active-text-color="#ffd04b" unique-opened="true" default-active="1"> 
      <el-menu-item :index="'/machine/machineAll'">总览</el-menu-item>
      <el-submenu v-for="(group, index_g) in iot.group" :key="index_g" opened>
        <template slot="title">{{group.GroupName}}</template>
        <el-menu-item v-for="(machine, index_m) in group.Machine" :key="index_m" :index="'/machine/propertys/'+machine.MachineId+'?machineId='+machine.MachineId">{{machine.MachineName}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>

  <div class="floatRight_b">
    <router-view class="routerView"></router-view>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      iot: {
        list: [],
        group: [],
      },
      GroupStatus: {
        open: true,
        all: 0,
        running: 0,
        stop: 0,
        off: 0,
        standby: 0,
        warn: 0,
        alarm: 0,
      },
      inhaul: {
        active: 0,
        search: '',
        searching: false,
      },
    }
  },
  created: function() {
    this.getMenu();
    this.getStatus();
  },
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    getMenu: function() {
      let that = this;
      that.chooseInhaul();
      if (that.iot.list == undefined) {
        that.getTree();
        that.iot.list = that.$store.state.iot.data.Machines;
        console.log(that.iot.list);
      } else {
        that.iot.list = that.$store.state.iot.data.Machines;
        console.log(that.iot.list);
        that.chooseInhaul();
      }
    },
    getTree: function(id) {
      let that = this;
      that.axios.get('/api/Machine/GetIOTList')
        .then(function(res) {
          console.log(res);
          that.$store.state.iot.data = res.data;
          // console.log(that.$store);
        }).catch(res => {
          console.log(res);
          that.$Message.error(res.statusText)
        });
    },
    getStatus: function(id) {
      let that = this;
      that.axios.get('/api/Machine/GetRTStatus')
        .then(function(res) {
          console.log(res);
          // console.log(that.$store.state.iot.data.Machines);
          for (let i in res.data) {
            for (let n in that.$store.state.iot.data.Machines) {
              if (res.data[i].MachineId == that.$store.state.iot.data.Machines[n].MachineId) {
                that.$store.state.iot.data.Machines[n].Status = res.data[i].MachineStatus;
              }
            }
          }
          that.getMenu();
        }).catch(res => {
          console.log(res);
          that.$Message.error(res.statusText)
        });
    },
    getStatus_group: function() {
      let that = this;
      for (let n in that.iot.group) {
        let array = that.iot.group[n].Machine;
        let running = 0,
          stop = 0,
          off = 0,
          standby = 0,
          warn = 0,
          alarm = 0;
        for (let i in array) {
          if (array[i].Status == 0) {
            running = running + 1;
          } else if (array[i].Status == 1) {
            stop = stop + 1
          } else if (array[i].Status == 2) {
            off = off + 1
          } else if (array[i].Status == 3) {
            standby = standby + 1
          } else if (array[i].Status == 4) {
            alarm = alarm + 1
          } else if (array[i].Status == 5) {
            warn = warn + 1
          }
        }
        that.iot.group[n].GroupStatus.all = running + stop + off + standby + alarm + warn;
        that.iot.group[n].GroupStatus.running = running;
        that.iot.group[n].GroupStatus.stop = stop;
        that.iot.group[n].GroupStatus.off = off;
        that.iot.group[n].GroupStatus.standby = standby;
        that.iot.group[n].GroupStatus.alarm = alarm;
        that.iot.group[n].GroupStatus.warn = warn;
      }

    },
    getList_Mill: function() {
      let that = this;
      let list = that.iot.list;
      let array = [];
      for (let i in list) {
        let flag = 1;
        for (let j in array) {
          if (array[j].MillId == list[i].MillId) {
            flag = 0;
            break;
          }
        }
        if (flag == 1) {
          array.push({
            MillId: list[i].MillId,
            MillName: list[i].MillName,
            GroupName: list[i].MillName,
            Machine: [],
            GroupStatus: {
              open: false,
              all: 0,
              running: 0,
              stop: 0,
              off: 0,
              standby: 0,
              warn: 0,
              alarm: 0,
            },
          });
        }
      }
      for (let i in list) {
        for (let n in array) {
          if (list[i].MillId == array[n].MillId) {
            array[n].Machine.push(list[i]);
          }
        }
      }
      that.iot.group = array;
      // that.getStatus_group();
      console.log(that.iot.group);
    },
    getList_Area: function() {
      let that = this;
      let list = that.iot.list;
      console.log(that.iot.list);
      let array = [];
      for (let i in list) {
        let flag = 1;
        for (let j in array) {
          if (array[j].AreaId == list[i].AreaId) {
            flag = 0;
            break;
          }
        }
        if (flag == 1) {
          array.push({
            AreaId: list[i].AreaId,
            AreaName: list[i].AreaName,
            GroupName: list[i].AreaName,
            Machine: [],
            GroupStatus: {
              open: false,
              all: 0,
              running: 0,
              stop: 0,
              off: 0,
              standby: 0,
              warn: 0,
              alarm: 0,
            },
          });
        }
      }
      for (let i in list) {
        for (let n in array) {
          if (list[i].AreaId == array[n].AreaId) {
            array[n].Machine.push(list[i]);
          }
        }
      }
      that.iot.group = array;
      // that.getStatus_group();
      console.log(that.iot.group);
    },
    getList_DTU: function() {
      let that = this;
      let list = that.iot.list;
      let array = [];
      for (let i in list) {
        let flag = 1;
        for (let j in array) {
          if (array[j].DTUId == list[i].DTUId) {
            flag = 0;
            break;
          }
        }
        if (flag == 1) {
          array.push({
            DTUId: list[i].DTUId,
            DTUName: list[i].DTUName,
            GroupName: list[i].DTUName,
            Machine: [],
            GroupStatus: {
              open: false,
              all: 0,
              running: 0,
              stop: 0,
              off: 0,
              standby: 0,
              warn: 0,
              alarm: 0,
            },
          });
        }
      }
      for (let i in list) {
        for (let n in array) {
          if (list[i].DTUId == array[n].DTUId) {
            array[n].Machine.push(list[i]);
          }
        }
      }
      that.iot.group = array;
      // that.getStatus_group();
      console.log(that.iot.group);
    },
    getList_machineType: function() {
      let that = this;
      let list = that.iot.list;
      // console.log(list);
      let array = [];
      for (let i in list) {
        let flag = 1;
        // console.log(list[i].MachineTypeId);
        for (let j in array) {
          if (array[j].MachineTypeId == list[i].MachineTypeId) {
            flag = 0;
            break;
          }
        }
        if (flag == 1) {
          array.push({
            MachineTypeId: list[i].MachineTypeId,
            MachineTypeName: list[i].MachineTypeName,
            GroupName: list[i].MachineTypeName,
            Machine: [],
            GroupStatus: {
              open: false,
              all: 0,
              running: 0,
              stop: 0,
              off: 0,
              standby: 0,
              warn: 0,
              alarm: 0,
            },
          });
        }
      }
      for (let i in list) {
        for (let n in array) {
          if (list[i].MachineTypeId == array[n].MachineTypeId) {
            array[n].Machine.push(list[i]);
          }
        }
      }
      that.iot.group = array;
      // that.getStatus_group();
    },
    chooseInhaul: function() {
      this.iot.group = [];
      // this.inhaul.active = parseInt(e.detail.value);
      if (this.inhaul.active == 0) {
        this.getList_machineType()
      } else if (this.inhaul.active == 1) {
        this.getList_Area();
      } else if (this.inhaul.active == 2) {
        this.getList_DTU()
      } else if (this.inhaul.active == 3) {
        this.getList_Mill()
      }
    },
    searching: function() {
      let that = this;
      let list = that.iot.list;
      if (that.inhaul.search == '') {
        that.inhaul.searching = false;
        that.getList_machineType();
      } else {
        let array = [];
        that.inhaul.searching = true;
        let keyWord = that.inhaul.search;
        array.push({
          GroupName: '查询关键字:' + keyWord,
          Machine: [],
          GroupStatus: {
            open: true,
            all: 0,
            running: 0,
            stop: 0,
            off: 0,
            standby: 0,
            warn: 0,
            alarm: 0,
          },
        });
        for (let i in list) {
          if (list[i].MachineName.indexOf(keyWord) >= 0) {
            array[0].Machine.push(list[i]);
          }
        }
        that.iot.group = array;
        that.getStatus_group();
      }
    },
    clearSearch: function() {
      this.inhaul.search = '';
      this.inhaul.searching = false;
      this.getList_machineType();
    },
  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.machine {
    min-height: 688px;
    position: relative;
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    align-items: stretch;

}
.floatLeft_a {
    width: 288px;
    background: #BBBBBB;
    border-right: 1px solid #eee;
    > .search {
        width: 100%;
        padding: 20px;
        position: relative;
        > .clearsearch {
            position: absolute;
            right: 26px;
            top: 47px;
            z-index: 99;
            font-size: 12px;
            padding: 0 10px;
            border-radius: 50px;
            background: #535353;
            color: #fff;
            display: inline-block;
            position: absolute;
            height: 20px;
            line-height: 20px;
            outline: none;
            border: none;
        }
        > h6 {
            color: #999;
            font-size: 12px;
            margin-bottom: 10px;
        }
        .searchInput {
            margin-bottom: 20px;
        }
    }
    .menu {
        width: 100% !important;
        padding-top: 20px;
        border-top: 1px solid #eee;
        border-right: none;
    }
}
.floatRight_b {
    width: calc(100% - 288px);
    > .routerView {
        width: 100%;
        height: 100%;
    }
}
</style>
