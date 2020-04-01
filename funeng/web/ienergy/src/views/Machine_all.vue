<template>
<div class="machineAll">
  <!-- <h5 class="tip" v-show="machine==undefined">暂无数据
    <span>等待加载或重新刷新</span>
  </h5> -->
  <ul>
    <h5>设备总览</h5>
    <li class="all">
      <h3>{{page.sb}}</h3>
      <h5>设备个数</h5>
    </li>
  </ul>
  <ul>
    <h5>产出总览</h5>
    <li class="all">
      <h3>{{(page.dqzll)}}<span>m³/h</span></h3>
      <h5>氮气流量</h5>
    </li>
    <li>
      <h3>{{page.dqzll_1}}<span>m³/h</span></h3>
      <h5>氮气流量-制氮机#1</h5>
    </li>
    <li>
      <h3>{{page.dqcd_1}}<span>PPM</span></h3>
      <h5>氮气纯度-制氮机#1</h5>
    </li>
    <li>
      <h3>{{page.dqzll_2}}<span>m³/h</span></h3>
      <h5>氮气流量-制氮机#2</h5>
    </li>
    <li>
      <h3>{{page.dqcd_2}}<span>PPM</span></h3>
      <h5>氮气纯度-制氮机#2</h5>
    </li>

    <li class="all">
      <h3>{{(page.kqzll)}}<span>m³/h</span></h3>
      <h5>空气流量</h5>
    </li>
    <li>
      <h3>{{page.kqdzdj}}<span>m³/h</span></h3>
      <h5>空气到制氮机</h5>
    </li>
    <li>
      <h3>{{page.kqdcj}}<span>m³/h</span></h3>
      <h5>空气到车间</h5>
    </li>
  </ul>
  <ul>
    <h5>能耗总览</h5>
    <li class="all">
      <h3>{{page.zhzyg}}<span>KWh</span></h3>
      <h5>组合总有功-总</h5>
    </li>
    <li>
      <h3>{{page.zhzyg_1}}<span>KWh</span></h3>
      <h5>组合总有功-智能电表#1</h5>
    </li>
    <li>
      <h3>{{page.zhzyg_2}}<span>KWh</span></h3>
      <h5>组合总有功-智能电表#2</h5>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  data() {
    return {
      machine: {},
      page: {
        dqzll: 0,
        dqzll_1: 0,
        dqcd_1: 0,
        dqzll_2: 0,
        dqcd_2: 0,
        zhzyg: 0,
        zhzyg_1: 0,
        zhzyg_2: 0,
        sjdy: 0,
        sb: 0,

        kqzll: 0,
        kqdzdj: 0,
        kqdcj: 0,
      }
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.initWebSocket();
  },
  mounted: function() {
    let that = this;
    this.get_data_query();
    // setTimeout(function() {
    //   that.sendProperty();
    // }, 1000)
  },
  beforeDestroy: function() {
    this.websock.close();
  },
  destroyed: function() {
    this.websock.close();
  },
  methods: {
    get_data_query: function() {
      this.machine = this.$store.state.iot.data.Machines;
      console.log(this.machine);
      this.page.sb = this.$store.state.iot.data.Machines.length;
    }, //WebSocket
    initWebSocket: function() {　
      // const link = 'ws://192.168.0.13:3150/Extension/GSocket/WSHandler.ashx';　　　　　　　
      const link = 'wss://38798879.xyz/Extension/GSocket/WSHandler.ashx';　　　　　　　
      this.websock = new WebSocket(link);　　　　　　　　
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;　　　　　　　　
      this.websock.onclose = this.websocketclose;　　　　
    },
    websocketonopen: function(data) {　　　　　　　　
      console.log("WebSocket连接成功");　
      this.sendProperty();　　　　　
    },
    websocketonerror: function(e) {
      console.log("WebSocket连接发生错误" + e);　　　　　　
    },
    websocketonmessage: function(e) {　
      let that = this;
      let re = JSON.parse(e.data);
      console.log(re);
      let data = re.Data;
      if (data.TagId == 1 && data.MachineId == 1) {
        that.page.dqcd_1 = data.FValue.toFixed(2);
      } else if (data.TagId == 4 && data.MachineId == 1) {
        that.page.dqzll_1 = data.FValue.toFixed(2);
      } else if (data.TagId == 1 && data.MachineId == 2) {
        that.page.dqcd_2 = data.FValue.toFixed(2);
      } else if (data.TagId == 4 && data.MachineId == 2) {
        that.page.dqzll_2 = data.FValue.toFixed(2);
      } else if (data.TagId == 42 && data.MachineId == 6) {
        that.page.zhzyg_1 = data.FValue.toFixed(2);
      } else if (data.TagId == 42 && data.MachineId == 7) {
        that.page.zhzyg_2 = data.FValue.toFixed(2);
      } else if (data.TagId == 16 && data.MachineId == 4) {
        that.page.kqdzdj = data.FValue.toFixed(2);
      } else if (data.TagId == 16 && data.MachineId == 3) {
        that.page.kqdcj = data.FValue.toFixed(2);
      }
      that.page.kqzll = (parseFloat(that.page.kqdzdj) + parseFloat(that.page.kqdcj)).toFixed(2);
      that.page.dqzll = (parseFloat(that.page.dqzll_1) + parseFloat(that.page.dqzll_2)).toFixed(2);
      that.page.zhzyg = (parseFloat(that.page.zhzyg_1) + parseFloat(that.page.zhzyg_2)).toFixed(2);
    },
    sendProperty: function() {
      let that = this;
      let data = {
        Key: 1,
        Data: {
          Tags: [{
              MachineId: 1,
              TagId: 1
            },
            {
              MachineId: 1,
              TagId: 4
            },
            {
              MachineId: 2,
              TagId: 1
            },
            {
              MachineId: 2,
              TagId: 4
            },
            {
              MachineId: 6,
              TagId: 42
            },
            {
              MachineId: 7,
              TagId: 42
            },
            {
              MachineId: 3,
              TagId: 16
            },
            {
              MachineId: 4,
              TagId: 16
            },
          ],
        },
      };
      console.log(JSON.stringify(data));
      that.websock.send(JSON.stringify(data), function(res) {
        console.log(res)
      })
    },
  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.tip {
    text-align: center;
    width: 100%;
    padding: 100px 0;
    font-size: 16px;
    color: #444;
    > span {
        font-size: 12px;
        display: block;
        margin-top: 10px;
        color: #999;
    }
}
.machineAll {

    padding: 20px;
    > ul {
        border-radius: 3px;
        background-color: #eee;
        padding: 30px 20px 40px 40px;
        margin: 30px;
        position: relative;
        display: flex;
        flex-wrap: wrap;
        > h5 {
            font-size: 14px;
            border-radius: 50px;
            padding: 0 10px;
            position: absolute;
            line-height: 30px;
            top: -15px;
            left: 20px;
            background-color: #6190EC;
            color: #fff;
        }
        > li {
            margin-top: 20px;
            border: 1px solid #ddd;
            border-left: 6px solid #09BB08;
            padding: 10px 20px;
            background-color: #fff;
            width: calc(50% - 20px);
            min-width: 300px;
            margin-right: 20px;
            &.all {
                min-width: 620px;
                width: 100%;
            }
            > h3 {
                font-size: 32px;
                margin-bottom: 8px;
                > span {
                    color: #999;
                    font-size: 18px;
                    margin-left: 8px;
                }
            }
            > h5 {
                font-size: 16px;
                color: #666;
            }
        }
    }
}
</style>
