<template>
<div class="gridstackItem gridstackItemCX grid-stack-item" data-gs-id="gs_0" :data-gs-x="0" :data-gs-y="0" :data-gs-width="6" :data-gs-height="6" :data-gs-locked="true" :data-gs-no-move="true" :data-gs-no-resize="true">
  <div class="grid-stack-item-content title" style="cursor:">
    <el-dropdown trigger="click" @command="dropdown">
      <span class="el-dropdown-link">
        生产线概况 <i class="fa fa-caret-down"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">1号产线 SSMMS</el-dropdown-item>
        <el-dropdown-item command="b">2号产线 SMS</el-dropdown-item>
        <el-dropdown-item command="c">3号产线 SSMMS</el-dropdown-item>
        <el-dropdown-item command="d">4号产线 SSMS</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
  <div class="content">
    <cx1></cx1>
  </div>
</div>
</template>

<script>
import cx1 from 'components/dashboard/cx/cx1'
export default {
  data() {
    return {}
  },
  created: function() {},
  mounted: function() {},
  methods: {
    dropdown: function(command) {
      if (command == 'delet') {
        GS_DELET(this.options).then(() => {
          this.$router.go(0)
        })
      }
    },

  },
  computed: {},
  watch: {},
  components: {
    cx1,
  },
  destroyed: function() {},
}
</script>
<style lang="scss">
.gridstackItem.gridstackItemCX {
    padding: 0 5px !important;
    > .title {
        background-color: #fff;
        height: 28px;
        transition: background-color 0.3s, color 0.2s;
        padding: 0;
        color: #ccc;
        cursor: auto !important;
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
                transition: 0.2s color;
            }
        }
        &:hover {
            background-color: #fff !important;
            color: #15A8A9;
            > .el-dropdown {
                color: #15A8A9;
                i.fa {
                    color: #15A8A9 !important;
                }
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
