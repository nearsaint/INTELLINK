<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			this.chackLogin();
			this.getUitl();
		},
		onShow: function() {
			console.log('App Show') 
		},
		onHide: function() {
			console.log('App Hide')
		},
		onUniNViewMessage:function(e){
          console.log("App.vue收到数据")
          console.log(JSON.stringify(e.data))  
        },
		methods:{
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
									console.log(res)
									that.$store.state.user.userinfo = res.userInfo;
									that.chackStarus();
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
			getUitl : function(){
				uni.request({
					url: 'https://www.lele.fit/api01/util', 
					method: 'GET',
					success: (res) => {
						console.log(res);
						this.$store.state.uitl.hospitals = res.data.hospitals;
						this.$store.state.uitl.treatments = res.data.treatments;
					},
					fail: (res) => {
						console.log(res);
						uni.showToast({ title: "加载目录失败,请重试!", icon: "none" });
					}
				});
			},
			chackStarus: function(){
				let that = this;
				let cookie = wx.getStorageSync('lelejianCookie');//取出Cookie
				let header = { 'Content-Type': 'application/x-www-form-urlencoded'};
				if (cookie) {
				    header.Cookie = cookie;
					uni.request({
						url: 'https://www.lele.fit/api01/user/status', 
						method: 'GET',
						header: header,
						success: (res) => {
							console.log(res);
							if(res.statusCode == 200){
								if(res.data.hasSession){
									if(res.data.isNew){
										uni.reLaunch({
											url: '../pages/my/info?newUser=true'
										});
									}else{
										uni.switchTab({
											url: '../pages/tabBar/home'
										}); 
									}
								}else{
									uni.reLaunch({
										url: '../pages/login'
									});
								}
							}
						},
						fail: (res) => {
							console.log(res);
							uni.showToast({ title: "加载目录失败,请重试!", icon: "none" });
							uni.reLaunch({
								url: '../pages/login'
							});
						}
					});
				}else{
					uni.reLaunch({
						url: '../pages/login'
					});
				}
			},
		},
	}
</script>

<style>
	/*每个页面公共css */
</style>
