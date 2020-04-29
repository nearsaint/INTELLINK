<template>
<div class="gridstackView grid-stack">

  <!-- <gridstackItemCX></gridstackItemCX> -->
  <gridstackItem v-for="(item,index) in list" :class="[lock?'lock':'']" v-model="list[index]" ref="gsitem" :key="index"></gridstackItem>
</div>
</template>

<script>
import 'assets/plugins/gridstack/gridstack.scss'
import gridstack from 'assets/plugins/gridstack/gridstack.all.js'
import gridstackItem from 'components/dashboard/gridstackItem'
import gridstackItemCX from 'components/dashboard/gridstackItemCX'
import {
  GS_CREAT,
  GS_ADD,
  GS_ABLE,
  GS_DELET,
  GS_LOAD_STORAGE,
  GS_LOAD_SERVE,
} from 'assets/scripts/gridstack'
import {
  DASHBOARD_CONTAINER_LIST
} from 'api/api'

export default {
  data() {
    return {
      dom: '.grid-stack',
      lock: false,
      list: [],

    }
  },
  created() {},
  mounted() {
    this.item_get();
  },
  destroyed() {},
  sockets: {},
  methods: {
    item_get: function() {
      let that = this;
      GS_LOAD_SERVE().then((response) => {
        // console.log(response);
        that.list = response;
        that.$nextTick(function() {
          GS_CREAT(this.dom, this.list)
        });
      }).then(() => {
        let item = this.$refs.gsitem
        for (let i in item) {
          item[i].chartInit()
        }
      }).then(() => {
        let timer = null;
        window.onresize = () => {
          let that = this;
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(function() {
            let item = that.$refs.gsitem
            for (let i in item) {
              item[i].chartResize()
            }
            console.log("resize执行了");
          }, 1000)
        };
      })
    },
    item_lock: function() {
      GS_ABLE(this, this.lock).then((e) => {
        this.lock = e;
      }).then(() => {
        this.$emit('lock', this.lock)
      });
    },
    item_add: function() {

      // GS_ADD(this, pram).then(() => {
      //   let item = this.$refs.gsitem
      //   let i = this.$refs.gsitem.length - 1
      //   item[i].chartInit()
      // })
    },
  },
  computed: {},
  watch: {},
  components: {
    gridstackItem,
    gridstackItemCX
  },
}
</script>
<style lang="scss" scoped>
.gridstackView {
    width: 100%;
    background: #f5f5f5;
    > .add {
        position: fixed;
        z-index: 999;
        right: 0;
        bottom: 0;
    }
}
</style>
