<template>
	<view class="login">
		<image class="logo" src="../static/images/logo/logo.png"></image>
		<text class="title">乐乐健随访</text>
		<button :loading="loginLoading" class="btn" open-type="getUserInfo" @getuserinfo="getuserinfo"><text class="iconfont">&#xe959;</text>使用微信号登录</button>
	</view>
</template>

<script>
	const WXBizDataCrypt = require('../common/script/WXBizDataCrypt.js')
	export default {
		data() {
			return {
				canIUse: wx.canIUse('button.open-type.getUserInfo'),
				loginLoading: false,
			}
		},
		onLoad: function(){},
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
				let code;
				let openid;
				let newUser = false;
				that.loginLoading = true;
				uni.login({
					provider: 'weixin',
					timeout: 10000,
					success: function(res_login) {
						console.log(res_login);
						code = res_login.code;
						wx.showLoading({
						  title: '加载中',
						});
						wx.request({
							url: 'https://www.lele.fit/api01/wxlogin',
							data: {
								code: code,
							},
							method: 'POST',
							success: (res) => {
								if(res.statusCode==200){
									if (res && res.header && res.header['Set-Cookie']) {
										wx.setStorageSync('lelejianCookie', res.header['Set-Cookie']);   //保存Cookie到Storage
									}
									console.log(res);
									if(res.data.new){
										newUser = res.data.new;
									}
									wx.getSetting({
										success(res) {
											if (res.authSetting['scope.userInfo']) {
												// 已经授权，可以直接调用 getUserInfo 获取头像昵称
												wx.getUserInfo({
													success(res) {
														console.log(res);
														that.$store.state.user.userinfo = res.userInfo;
														if(newUser){
															uni.reLaunch({
																url: '../pages/my/info?newUser=true'
															});
														}else{
															uni.switchTab({
																url: '../pages/tabBar/home'
															});
														}
														wx.hideLoading()
														that.loginLoading = false;
														// wx.request({
														// 	url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx7469bbae33c99a3f&secret=7ea4c89226d5933d8be87e07a37dc1cc&js_code=' + code +'&grant_type=authorization_code',
														// 	success(data){
														// 		console.log(data)
														// 		var pc = new WXBizDataCrypt('wx7469bbae33c99a3f', data.data.session_key)
														// 		var data = pc.decryptData(encryptedData, iv)
														// 		console.log(data)
														// 	}
														// })
													}
												});
											}
										}
									})
								}
							},
							fail: (res) => {
								console.log(res);
								wx.hideLoading()
								that.loginLoading = false;
								wx.showToast({
									title: '登陆失败,请重试!',
									icon: 'none',
									duration: 1000
								})
							}
						})
						
						
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
				this.login();
			},
		}
	}
</script>

<style lang="scss">
	.login{
		background-color: #f5f5f5;
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
			height: 300upx;
			width: 300upx;
			z-index: 2;
		}
		>.title{
			position: absolute;
			top: 480upx;
			left: 50%;
			transform: translateX(-50%);
			color: #444;
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
