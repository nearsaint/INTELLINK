<template>
<div class="cx">
  <div class="title">
    <h5>1号产线 MMSSS</h5>
  </div>
  <div class="content">
    <div class="imagess" style="">
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created: function() {},
  mounted: function() {},
  methods: {

  },
  computed: {},
  watch: {},
  components: {},
  destroyed: function() {},
}
</script>
<style lang="scss" >
.cx {
    width: 100%;
    height: 100%;
    position: relative;
    .title {
        position: absolute;
        bottom: 10px;
        right: 10px;
        h5 {
            font-size: 16px;
            font-weight: 400;
            color: #444;
            text-align: center;
        }
    }
    .content {
        width: 100%;
        height: 100%;
        .imagess {
            width: 100%;
            height: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            background-image: url("../../../assets/images/cx001.jpg");
        }
    }
}
</style>
