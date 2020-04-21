<template>
<div class="gridstackItem grid-stack-item" :data-gs-id="options.id" :data-gs-x="options.gs.gsX" :data-gs-y="options.gs.gsY" :data-gs-width="options.gs.gsW" :data-gs-height="options.gs.gsH">
  <div class="grid-stack-item-content title">
    <el-dropdown trigger="click" @command="dropdown">
      <span class="el-dropdown-link">
        {{options.title}} <i class="fa fa-caret-down"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="view"><i class="fa fa-expand"></i> 视图</el-dropdown-item>
        <el-dropdown-item command="setting"><i class="fa fa-cog"></i> 图表配置</el-dropdown-item>
        <el-dropdown-item command="excel"><i class="fa fa-file-excel-o"></i> 导出Excel</el-dropdown-item>
        <el-dropdown-item command="delet" divided><i class="fa fa-trash"></i> 删除</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
  <div class="content">
    <chartView class="chartView" v-model="options" ref="chart"></chartView>
  </div>
  <i class="iconResize fa fa-angle-down"></i>
</div>
</template>

<script>
import {
  GS_DELET
} from 'assets/scripts/gridstack'
import chartView from 'components/dashboard/chartView'
export default {
  model: {
    prop: 'options',
    event: 'change'
  },
  props: {
    options: Object,
  },
  data() {
    return {}
  },
  created: function() {},
  mounted: function() {},
  methods: {
    chartInit: function() {
      this.$refs.chart.chartInit();
    },
    chartResize: function() {
      // console.log(this.$refs.chart);
      this.$refs.chart.chartResize();
    },
    dropdown: function(command) {
      if (command == 'delet') {
        GS_DELET(this.options).then(() => {
          this.$router.go(0)
        }).catch(() => {

        })
      } else if (command == 'setting') {
        let pram = {
          id: this.options.id
        }
        this.$goRouter.to('/dashboard_setting', pram)
      }
    },

  },
  computed: {},
  watch: {},
  components: {
    chartView,
  },
  destroyed: function() {},
}
</script>
<style lang="scss">
.gridstackItem {
    padding: 0 5px !important;
    > .title {
        background-color: #fff;
        height: 28px;
        transition: background-color 0.3s, color 0.2s;
        padding: 0;
        color: #ccc;
        cursor: move;
        overflow: hidden !important;
        z-index: 2;
        left: 5px !important;
        right: 5px !important;
        text-align: center;
        > h5 {
            text-align: center;
            line-height: 28px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0 10px;
            font-size: 12px;
            color: #ccc;
        }
        > .el-dropdown {
            color: #999;
            max-width: 100%;
            padding: 0 10px;
            outline: none;
            cursor: pointer;
            span {
                font-size: 12px;
                line-height: 28px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                display: block;
                width: 100%;
            }
            i {
                color: #eee;
            }
        }
        &:hover {
            background-color: #15A8A9;
            color: #fff;
            > .el-dropdown {
                color: #fff;
            }
        }
    }
    > .content {
        background-color: #fff;
        height: 100%;
        padding: 28px 0 0;
        transition: box-shadow 0.3s;
        position: relative;
        z-index: 1;
        > .chartView {
            position: absolute;
            top: 28px;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: calc(100% - 28px);
        }
    }
    > .iconResize {
        position: absolute;
        right: 7px;
        bottom: 0;
        z-index: 3;
        transform: rotate(-45deg);
        color: #eee;
        transition: color 0.3s;
    }

    &:hover {
        > .content {
            box-shadow: 0 0 6px #ddd;
        }
        > .iconResize {
            color: #15A8A9;
        }
    }
    &.ui-draggable-dragging {
        opacity: 0.41;
        > .title {
            box-shadow: none !important;
            background-color: #15A8A9;
            color: #fff;
        }
    }
    &.ui-resizable-resizing {
        opacity: 0.41;
        > .title {
            box-shadow: none !important;
        }
        > .content {}
    }
}
</style>
<style lang="scss">
.gridstackItem {
    .ui-resizable-se,
    .ui-resizable-sw {
        background-image: none !important;
    }
}
.gridstackItem.lock {
    > .title {
        cursor: auto;
        &:hover {
            background-color: #fff;
            color: #666;
            > .el-dropdown {
                color: #666;
            }
        }
    }
    .iconResize {
        display: none;
    }
}
</style>
