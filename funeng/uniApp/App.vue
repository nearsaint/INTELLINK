<script>
	export default {
		onLaunch: function () {
			console.log('App Launch');
			this.getWidowHeight();
			this.chackLogin();
		},
		onLoad:function(options){
		},
		onShow: function () {
			console.log('App Show');
		},
		onHide: function () {
			console.log('App Hide')
		},
		methods:{
			getWidowHeight: function(){
				let that = this;
				uni.getSystemInfo({
					success: function (res) {
						that.$store.state.sys.windowHeight = res.windowHeight;
						that.$store.state.sys.windowWidth = res.windowWidth;
					}
				});
			},
			chackLogin: function(){
				let that = this;
				wx.checkSession({
				  success() {
					// session_key 未过期，并且在本生命周期一直有效
					console.log('has session, go to home page!');
					// 查看是否授权
					wx.getSetting({
					  success(res) {
						if (res.authSetting['scope.userInfo']) {
							// 已经授权，可以直接调用 getUserInfo 获取头像昵称
							wx.getUserInfo({
								success(res) {
									that.$store.state.user.nickName = res.userInfo.nickName;
									that.$store.state.user.avatarUrl = res.userInfo.avatarUrl;
									that.getList();
									uni.reLaunch({
										url: '/pages/tabBar/home'
									});
								}
							})
						}
					  }
					})
				  },
				  fail() {
					// session_key 已经失效，需要重新执行登录流程
					console.log('has not session, go to login page!')
					uni.reLaunch({
						url: '../pages/login'
					});
				  }
				})
				
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
		},
	}
</script>

<style>
	/*每个页面公共css */
</style>
