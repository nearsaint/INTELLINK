<template>
	<view class="home">
		<view class="topList">
			<button v-for="(item,index) in msgList" class="tiper grace-bg-blue" hover-class="active" @click="goto_question(item.id,item.moduleID)">
				<text>{{item.name}}</text>
				<text>{{item.time}}</text>
				<text class="iconfont">&#xe856;</text> 
			</button>
		</view>
		<treatCard class="treatCard" ref="treatCard"></treatCard>
		<image class="bg" mode="aspectFill" src="../../static/update/bg.png"></image>
		<image class="logo" mode="aspectFit" src="../../static/images/logo/logo.png"></image>
	</view>
</template>
<script>
	import treatCard from 'components/index/card.vue'
	export default {
		data() {
			return {
				msgList: [],
			}
		},
		onLoad: function(){
		},
		onReady: function(){
			this.getMsgList();
		},
		onShow: function(){
			this.getMsgList();
			this.$refs.treatCard.getList();
		},
		onHide: function(){
		},
		onUnload: function(){
		},
		updated: function(){},
		beforeUpdate: function(){},
		//下拉动作
		onPullDownRefresh: function(){
			this.getMsgList();
			this.$refs.treatCard.getList();
		},
		//上拉触底
		onReachBottom: function(){},
		//滚动
		onPageScroll: function(e){},
		methods: {
			goto_question: function(e,d){
				console.log(d);
				uni.navigateTo({
					url: '/pages/treat/question?id='+e+'&moduleID='+d
				});
			},
			getMsgList: function(){
				let that = this;
				let cookie = wx.getStorageSync('lelejianCookie');//取出Cookie
				let header = { 'Content-Type': 'application/x-www-form-urlencoded'};
				if (cookie) {
				     header.Cookie = cookie;
				};
				uni.request({
					url: 'https://www.lele.fit/api01/questionnaire',
					method: 'GET',
					header: header,
					success: (res) => {
						console.log(res);
						that.msgList = res.data.today;
						uni.stopPullDownRefresh();
					},
					fail: (res) => {
						console.log(res);
						uni.showToast({ title: "加载失败,请重试!", icon: "none" });
						uni.stopPullDownRefresh();
					}
				});
			},
		},
		components: {//组件
			treatCard,
		},
	}
</script>

<style lang="scss">
	.home{
		min-height: 960upx;
		height: 100vh;
		background: #f5f5f5;
		padding: 0;
		position: relative;
		>.topList{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			width: 100vw;
			z-index: 9999;
			padding: 20upx;
			box-sizing: border-box;
			>.tiper{
				border-radius: 0;
				margin: 0 auto;
				box-sizing: border-box;
				border: none;
				line-height: 88upx;
				padding: 20upx 20upx 20upx 40upx;
				display: flex;
				flex-wrap: wrap;
				text-align: left;
				opacity: 0.8;
				border-radius: 10upx;
				margin-bottom: 20upx;
				&:after{
					border: none;
					outline: none;
				}
				text{
					text-align: left;
					line-height: 46upx;
					font-size: 32upx;
					display: block;
					width: 100%;
					&.iconfont{
						position: absolute;
						right: 20upx;
						text-align: right;
						top: 50%;
						transform: translateY(-50%);
					}
				}
				&.active{
					opacity: 1;
				}
			}
		}
		.treatCard{
			position: absolute;
			top: 50%;
			left: 0;
			right: 0;
			transform: translateY(-50%);
			z-index: 999;
		}
		.bg{
			position: fixed;
			z-index: 888;
			left: 0;
			right: 0;
			bottom: 0;
			width: 100vw;
			opacity: 0.21;
		}
		.logo{
			position: fixed;
			z-index: 889;
			left: 50%;
			top: 30%;
			transform: translateX(-50%) translateY(-50%);
			width: 50vw;
			opacity: 0.81;
		}
	}
</style>
