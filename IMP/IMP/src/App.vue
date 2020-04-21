<template>
<div id="app">
  <loadingProgress></loadingProgress>
  <componentTools></componentTools>
  <div class="viewContainer">
    <componentMenu></componentMenu>
    <div class="routerView">
      <router-view class="view">
      </router-view>
    </div>
  </div>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
</div>
</template>
<script>
import loadingProgress from 'components/loading/loadingProgress'
import componentTools from 'components/menu/tools'
import componentMenu from 'components/menu/menu'
export default {
  data() {
    return {}
  },
  created() {},
  mounted() {

  },
  sockets: {
    connect: function() {
      console.log('socket.io is connected')
      console.log(this.$sockets)
      console.log(this.$socket)
    },
    disconnect: () => {
      console.log('socket.io is disconnected')
    },
    reconnect: () => {
      console.log('socket.io is reconnect')
    },
  },
  destroyed() {},
  methods: {},
  computed: {},
  watch: {},
  components: {
    loadingProgress,
    componentTools,
    componentMenu
  },
}
</script>
<style lang="scss" scoped>
#app {
    width: 100vw;
    min-height: 100vh;
    padding: 52px 0 0;
    .viewContainer {
        display: flex;
        justify-content: flex-start;
        height: calc(100vh - 52px);
        width: 100vw;
        .componentMenu {
            flex-shrink: 0;
            flex-grow: 0;
        }
        .routerView {
            flex-shrink: 1;
            flex-grow: 1;
            overflow-y: scroll;
            height: 100%;
        }
    }
}
</style>
