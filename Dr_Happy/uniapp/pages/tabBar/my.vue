<template>
	<view class="my">
		<view class="grace-body">
			<view class="grace-list" style="margin-top:30rpx; margin-bottom:30rpx;">
				<view class="items">
					<view class="icons ucenter-face">
						<image :src="userinfo.avatarUrl" mode="widthFix"></image>
					</view>
					<view class="body">
						<view class="title">{{userinfo.nickName}}</view>
						<view class="desc">{{userinfo.city}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="ucenter-line"></view>
		<view class="grace-box-banner">
			<view class="garce-items">
				<view class="line1">{{all}}</view>
				<view class="line2">总治疗数</view>
			</view>
			<view class="garce-items">
				<view class="line1">{{wait}}</view>
				<view class="line2">等待中</view>
			</view>
			<view class="garce-items">
				<view class="line1">{{ing}}</view>
				<view class="line2">进行中</view>
			</view>
			<view class="garce-items">
				<view class="line1">{{end}}</view>
				<view class="line2">已结束</view>
			</view>
		</view>
		<!-- <view class="ucenter-line"></view> -->
		<!-- <view class="grace-list grace-body">
			<navigator class="items" @click="goto_orther">
				<view class="icons grace-icons icon-article grace-blue-sky"></view>
				<view class="body">
					<view class="title">全部治疗</view>
				</view>
				<view class="arrow-right"></view>
			</navigator>
			<navigator class="items">
				<view class="icons grace-icons icon-speaker grace-blue-sky"></view>
				<view class="body">
					<view class="title">待办</view>
				</view>
				<view class="arrow-right"></view>
			</navigator>
		</view> -->
		<view class="ucenter-line"></view>
		<view class="grace-list grace-body">
			<navigator class="items" @click="goto_info">
				<view class="icons grace-icons icon-set grace-blue-sky"></view>
				<view class="body">
					<view class="title">基础信息</view>
				</view>
				<view class="arrow-right"></view>
			</navigator>
			<navigator class="items"  @click="goto_contact">
				<view class="icons grace-icons icon-phone grace-blue-sky"></view>
				<view class="body">
					<view class="title">联系方式</view>
				</view>
				<view class="arrow-right"></view>
			</navigator>
		</view>
		<view class="ucenter-line">
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userinfo: this.$store.state.user.userinfo,
				
				treatmentLength: 0,
				all: this.$store.state.user.my.allTreatmentLength,
				wait: this.$store.state.user.my.waitTreatment,
				ing: this.$store.state.user.my.ingTreatment,
				end: this.$store.state.user.my.endTreatment,
			}
		},
		onLoad: function(){
		},
		onReady: function(){},
		onShow: function(){
			this.getInfo();
		},
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
			goto_contact: function(){
				uni.navigateTo({
					url: '/pages/my/contact' 
				});
			},
			goto_info: function(){
				uni.navigateTo({
					url: '/pages/my/info' 
				});
			},
			goto_orther: function(){
				uni.navigateTo({
					url: '/pages/my/orther' 
				});
			},
			getInfo: function(){
				let that = this;
				let cookie = wx.getStorageSync('lelejianCookie');//取出Cookie
				let header = { 'Content-Type': 'application/x-www-form-urlencoded'};
				if (cookie) {
				     header.Cookie = cookie;
				}
				uni.request({
					url: 'https://www.lele.fit/api01/user', 
					method: 'GET',
					header: header,
					success: (res) => {
						console.log(res);
						that.$store.state.user.info.name = res.data.name;
						that.$store.state.user.info.sex = res.data.sex;
						that.$store.state.user.info.birthday = res.data.birthday;
						that.$store.state.user.info.nation = res.data.nation;
						that.$store.state.user.info.phone = res.data.phone;
					},
					fail: (res) => {
						console.log(res);
						uni.showToast({ title: " 获取个人信息失败!", icon: "none" });
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.my{
	// display: flex;
	// flex-wrap: wrap;
	// min-height: 100vh;
	// background: #f5f5f5;
	.ucenter-face{width:120rpx !important; height:120rpx !important;}
	.ucenter-face image{width:120rpx !important; height:120rpx !important;}
	.ucenter-line{width:100%; height:10px; background:#F4F5F6; margin:8px 0;}
}
</style>
