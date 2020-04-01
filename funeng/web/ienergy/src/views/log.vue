<template>
<div class="log">
  <button type="button" name="button" class="btn" @click="gotoBack">
    <i class="iconfont">&#xe8bd;</i>
  </button>
  <h3>{{tagName}}</h3>
  <ul class="list">
    <li v-for="(item, index) in list" :key="index">
      <div>
        <h5>
          <template v-if="item.SValue==null||item.SValue==''">
            <i class="iconfont" v-if="item.FValue==0" style="color:#999">&#xe89d;</i>
            <i class="iconfont" v-if="item.FValue==1" style="color:#27AE60">&#xe89a;</i>
          </template>
          <template v-if="item.SValue!=null||item.SValue!=''">{{item.SValue}}</template></h5>
        <h6>{{item.Name}}</h6>
      </div>
      <span>{{item.TimeStamp}}</span>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  data() {
    return {
      machineId: {},
      tagId: {},
      tagName: '',
      list: [],
    }
  },
  beforeCreate: function() {},
  created: function() {
    this.get_data_query();
  },
  mounted: function() {
    this.getProperty();
  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    getProperty: function(id) {
      let that = this;
      that.axios.post('/api/Machine/GetLatestRTTags', {
        "Inputs": [{
          "GetTagsType": 0,
          "MachineId": that.machineId,
          "TagId": that.tagId,
          "QueryType": 0,
          "StatisticType": 0,
          "StartTime": '',
          "EndTime": '',
          "Count": 200
        }]
      }).then(function(res) {
        console.log(res);
        that.list = res.data[0].Tags;
      }).catch(res => {
        console.log(res);
      });
    },
    get_data_query: function() {
      this.machineId = this.$route.query.machineId;
      this.tagId = this.$route.query.tagId;
      this.tagName = this.$route.query.tagName;
    },
    gotoBack: function() {
      this.$router.back(-1)
    },
    routeChange: function() {
      this.get_data_query();
    },
  },
  computed: {},
  components: {},
  watch: {
    '$route': 'routeChange',
  },
}
</script>

<style lang="scss" scoped>
.log {
    padding-right: 20px;
    .btn {
        border: none;
        background: none;
        outline: none;
        font-size: 32px;
        cursor: pointer;
        display: inline-block;
        margin-right: 20px;
        color: #6190E8;
        &:hover {
            opacity: 0.9;
        }
    }
    > h3 {
        display: inline-block;
        font-size: 28px;
        line-height: 32px;
    }
    .list {
        padding: 20px 40px;
        > li {
            border-top: 1px dotted #ddd;
            padding: 10px;
            transition: all 0.3s;
            border-left: 0 solid #ddd;

            &:nth-child(odd) {
                background-color: #efefef;
            }
            &:hover {
                // margin-left: -10px;
                // border-left: 20px solid #ddd;
                background-color: #666;
                color: #fff;
            }
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            > div {
                > h5 {
                    font-size: 18px;
                    line-height: 25px;
                    font-weight: bolder;
                }
                > h6 {
                    font-size: 12px;
                    line-height: 20px;
                }
            }
            > span {
                line-height: 45px;
            }
        }
    }
}
</style>
