<template>
	<view class="map">
		<map class="map" style="width: 100%; height: 900px;" :latitude="map.latitude" :longitude="map.longitude" :markers="map.covers">
		</map>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				map:{
					latitude: 39.909,
					longitude: 116.39742,
					covers: [],
				},
			}
		},
		onLoad: function(){
		},
		onReady: function(){
			this.getMapInfo();
		},
		onShow: function(){},
		onHide: function(){},
		onUnload: function(){},
		updated: function(){},
		beforeUpdate: function(){},
		//下拉动作
		onPullDownRefresh: function(){},
		//上拉触底
		onReachBottom: function(){},
		//滚动
		onPageScroll: function(e){},
		
		methods: {
			getMapInfo: function(){
				let that = this;
				let info = that.$store.state.map.info;
				console.log(info);
				that.map.latitude = info.latitude;
				that.map.longitude = info.longitude;
				that.map.covers = info.covers;
			}
		}
	}
</script>

<style lang="scss">
</style>
