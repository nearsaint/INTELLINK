<template>
<div id="app" v-loading="$store.state.loading">
  <div class="menu" v-show="$store.state.user.logined">
    <menuComponent></menuComponent>
  </div>
  <div class="main">
    <div class="tool" v-show="$store.state.user.logined">
      <toolComponent></toolComponent>
    </div>
    <transition name="slide-fade">
      <router-view class="view">
      </router-view>
    </transition>
  </div>
</div>
</template>

<style scoped lang="scss">
#app {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    > .menu {
        width: 64px;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
    }
    > .main {
        width: calc(100% - 64px);
        margin: 0 0 0 64px;
    }
}
.slide-fade {
    position: absolute;
    left: 0;
    right: 0;
}

.slide-fade-enter-active {
    transition: all 1.2s ease;
}

.slide-fade-leave-active {
    transition: all 0.1s cubic-bezier(2.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to {
    left: 0;
    right: 0;
    transform: translateX(50px);
    opacity: 0;
}
</style>
<script>
import menuComponent from 'components/menu/menuComponent.vue'
import toolComponent from 'components/menu/toolComponent.vue'

export default {
  name: 'app',
  provide: function() {},
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {
    this.getUtil();
  },
  beforeDestroy: function() {},
  destroyed: function() {},
  sockets: {},
  methods: {
    getUtil: function() {
      let that = this;
      // let id = localStorage.id_lelejian;
      that.$axios.get('/api/util').then(function(rel) {
        console.log(rel)
        if (rel.data.code == 200) {
          that.$store.state.util.hospitals = rel.data.hospitals;
          that.$store.state.util.treatments = rel.data.treatments;
        }
      }).catch(rel => {
        console.log(rel)
      });
      // if (id != undefined || id != '') {
      //   that.$axios.post('/api/util', {
      //     id: id,
      //   }).then(function(rel) {
      //     console.log(rel)
      //   }).catch(rel => {
      //     console.log(rel)
      //   });
      // }
    },
  },
  computed: {},
  watch: {},
  components: {
    menuComponent,
    toolComponent
  },
}
</script>
