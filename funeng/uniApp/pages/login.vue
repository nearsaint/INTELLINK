<template>
	<view class="login">
		<image class="bg" src="../static/image/bg/login_bg.jpg"></image>
		<image class="logo" src="../static/image/bg/login_logo.png"></image>
		<text class="title">智能+ 工业互联网平台</text>
		<button class="btn" open-type="getUserInfo" @getuserinfo="getuserinfo"><text class="iconfont">&#xe959;</text>使用微信号登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				canIUse: wx.canIUse('button.open-type.getUserInfo')
			}
		},
		onLoad: function(){
// 			setTimeout(function(){
// 				console.log("send");
// 				let test = {Key:0,Data:{MachineIds: [1]}};
// 				console.log(JSON.stringify(test));
// 				uni.sendSocketMessage({
// 					data: JSON.stringify(test)
// 				});
// 			}, 2000)
// 			uni.request({
// 				url: 'https://38798879.xyz/api/machine/GetHtyRTTags', 
// 				data: {
// 					 Inputs:[{
// 						GetTagsType:2,
// 						MachineId:6,
// 						TagId:42,
// 						StartTime:'2019/02/01 00:00:00',
// 						EndTime:'2019/03/28 23:59:59'
// 					 }]
// 				},
// 				method: 'POST',
// 				success: (res) => {
// 					console.log(res);
// 				},
// 				fail: (res) => {
// 					console.log(res);
// 				}
// 			});
			
// 				uni.connectSocket({
// 					url: 'wss://38798879.xyz/Extension/GSocket/WSHandler.ashx'
// 				});
// 				uni.onSocketOpen(function (res) {
// 					console.log(res)
// 					console.log('WebSocket连接已打开！');
// 				});
// 			wx.getSetting({
// 			  success(res) {
// 				if (res.authSetting['scope.userInfo']) {
// 					wx.getUserInfo({
// 						success(res) {
// 						}
// 					});
// 				}
// 			  }
// 			})
		},
		onReady: function(){},
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
			login :function(){
				let that = this;
				uni.login({
					provider: 'weixin',
					success: function(res_login) {
						console.log(res_login);
						uni.request({
							url: 'https://38798879.xyz/api/login/WXLogin', //仅为示例，并非真实接口地址。
							data: {
							  js_code: res_login.code
							},
							success: function(res_request) {
								console.log(res_request);
								wx.getSetting({
								  success(res) {
									if (res.authSetting['scope.userInfo']) {
										// 已经授权，可以直接调用 getUserInfo 获取头像昵称
										wx.getUserInfo({
											success(res) {
												console.log(res.userInfo);
												that.$store.state.user.nickName = res.userInfo.nickName;
												that.$store.state.user.avatarUrl = res.userInfo.avatarUrl;
												that.getList();
												uni.reLaunch({
													url: '../pages/tabBar/home'
												});
											}
										});
									}
								  }
								})
							}
						});
						// 查看是否授权
						
					}
				});
			},
			getList: function(){
				let that = this;
				if(!that.$store.state.IOT.state){
					wx.request({
						url: 'https://38798879.xyz/api/Machine/GetIOTList', 
						data: {},
						method: 'GET',
						success: (res) => {
							console.log(res);
							that.$store.state.IOT.data = res.data;
							that.$store.state.IOT.state = true;
						},
						fail: (res) => {
							console.log(res);
						}
					});
				}
				if(!that.$store.state.map.state){
					wx.request({
						url: 'https://38798879.xyz/api/Machine/GetMapLocation', 
						data: {},
						method: 'GET',
						success: (res) => {
							console.log(res);
							that.$store.state.map.data = res.data;
							that.$store.state.map.state = true;
						},
						fail: (res) => {
							console.log(res);
						}
					});
				}
			},
			getuserinfo: function(e) {
				// console.log(e);
				this.login();
			},
		}
	}
</script>

<style lang="scss">
	.login{
		background-color: #0355e5;
		width: 100%;
		height: 100%;
		display: block;
		position: fixed;
		top: 0 ;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 40upx;
		box-sizing: border-box;
		>.bg{
			position: absolute;
			z-index: 1;
			top: 60upx;
			left: 0;
			right: 0;
			width: 100%;
		}
		>.logo{
			position: absolute;
			top: 160upx;
			left:50%;
			transform: translateX(-50%);
			height: 200upx;
			width: 200upx;
			z-index: 2;
		}
		>.title{
			position: absolute;
			top: 380upx;
			left: 50%;
			transform: translateX(-50%);
			color: #fff;
			font-size: 36upx;
			z-index: 3;
		}
		>.btn{
			font-size: 32upx;
			color: #fff;
			background: #82d303;
			position: absolute;
			bottom: 60upx;
			width: calc(100% - 80upx);
			>.iconfont{
				font-size: 36upx;
				margin-right: 10upx;
			}
		}
	}
</style>
