<template>
	<view class="home">
		<view class="title_bg"></view>
		<view class="title">
			<view class="tool">
				<view class="user" @click="gotoMy">
					<image class="avarat" :src='user.avarat'></image>
					<text class="name">{{user.name}}</text>
				</view>
				<view class="company">
					<picker class="picker" @change="bindPickerChange" :value="company.active" :range="company.millarray">
					    <view class="uni-input">
							{{company.millarray[company.active]}}
							<text class="iconfont">&#xe99a;</text>
						</view>
					</picker>
				</view>
			</view>
			<view class="mapContainer">
				<map class="map" style="width: 100%; height: 180px;" :latitude="map.latitude" :longitude="map.longitude" :markers="map.covers">
					<cover-image @click="gotoMap" class="mark" src="/static/image/bg/index_map_bg.png"></cover-image>
				</map>
				<view class="tool">
					<view class="text">
						<text class="h5">{{company.location[company.active]}}</text>
					</view>
					<view class="btn">
						<button class="btn btn_map iconfont" hover-class="hover" @click="gotoMap">&#xe853;</button>
						<button class="btn btn_list iconfont" hover-class="hover" @click="gotoList">&#xe872;</button>
					</view>
				</view>
			</view>
		</view>
		<!-- end .title -->
		<view class="main">
			<view class="title">
				<!-- <view class="i"></view> -->
				<text class="h5">设备总览</text>
			</view>
			<view class="content">
				<view class="team half">
					<text class="h3">1</text>
					<text class="h5">数据单元个数</text>
					<image class="icon" src="../../static/image/icon/index_sever.png"></image>
				</view>
				<view class="team half">
					<text class="h3">{{page.sb}}</text>
					<text class="h5">设备个数</text>
					<image class="icon" src="../../static/image/icon/index_machine.png"></image>
				</view>
				<!-- <view class="team">
					<text class="h2">空气温度过高</text>
					<text class="h4">空压机#100003 - 2019年01月07日</text>
					<text class="h5">最后一条报错记录</text>
					<image class="icon" src="../../static/image/icon/index_warning.png"></image>
				</view> -->
			</view>
		</view>
		<!-- end .main -->
		<view class="main">
			<view class="title">
				<!-- <view class="i"></view> -->
				<text class="h5">产出总览</text>
			</view>
			<view class="content">
				<view class="team ">
					<text class="h3">{{(page.dqzll)}}</text>
					<text class="h5">氮气总流量(m³/h)</text>
					<image class="icon" src="../../static/image/icon/index_n.png"></image>
				</view>
				<view class="team half">
					<text class="h3">{{page.dqzll_1}}</text>
					<text class="h5">氮气流量(m³/h)-制氮机#1</text>
					<image class="icon" src="../../static/image/icon/index_n.png"></image>
				</view>
				<view class="team half">
					<text class="h3">{{page.dqcd_1}}</text>
					<text class="h5">氮气纯度(PPM)-制氮机#1</text>
					<image class="icon" src="../../static/image/icon/index_o.png"></image>
				</view>
				<view class="team half">
					<text class="h3">{{page.dqzll_2}}</text>
					<text class="h5">氮气流量(m³/h)-制氮机#2</text>
					<image class="icon" src="../../static/image/icon/index_n.png"></image>
				</view>
				<view class="team half">
					<text class="h3">{{page.dqcd_2}}</text>
					<text class="h5">氮气纯度(PPM)-制氮机#2</text>
					<image class="icon" src="../../static/image/icon/index_o.png"></image>
				</view>
				<view class="team">
					<text class="h3">{{page.kqzll}}</text>
					<text class="h5">空气流量(m³/h)</text>
					<image class="icon" src="../../static/image/icon/index_k.png"></image>
				</view>
				<view class="team half">
					<text class="h3">{{page.kqdzdj}}</text>
					<text class="h5">空气到制氮机(m³/h)</text>
					<image class="icon" src="../../static/image/icon/index_k.png"></image>
				</view>
				<view class="team half">
					<text class="h3">{{page.kqdcj}}</text>
					<text class="h5">空气到车间(m³/h)</text>
					<image class="icon" src="../../static/image/icon/index_k.png"></image>
				</view>
			</view>
		</view>
		<!-- end .main -->
		<view class="main">
			<view class="title">
				<!-- <view class="i"></view> -->
				<text class="h5">能耗总览</text>
			</view>
			<view class="content">
				<view class="team">
					<text class="h3">{{page.zhzyg}}</text>
					<text class="h5">组合总有功</text>
					<image class="icon" src="../../static/image/icon/index_power.png"></image>
				</view>
				<view class="team half">
					<text class="h3">{{page.zhzyg_1}}</text>
					<text class="h5">组合总有功-智能电表#1</text>
				</view>
				<view class="team half">
					<text class="h3">{{page.zhzyg_2}}</text>
					<text class="h5">组合总无功-智能电表#2</text>
				</view>
			</view>
		</view>
		<!-- end .main -->
		<text class="serve">盛智技术提供支持</text>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				
				user:{
					name: this.$store.state.user.nickName,
					avarat: this.$store.state.user.avatarUrl
				},
				company: {
					active: [],
					mill: [],
					millarray: [],
					location: [],
					dtu: [],
					iconPath: '/static/image/icon/location.png'
				},
				map:{
					latitude: 39.909,
					longitude: 116.39742,
					covers: [],
				},
				page: {
					dqzll: 0,
					dqzll_1: 0,
					dqcd_1: 0,
					dqzll_2: 0,
					dqcd_2: 0,
					zhzyg: 0,
					zhzyg_1: 0,
					zhzyg_2: 0,
					sjdy: 0,
					kqll: 0,
					kqdzdj: 0,
					kqdcj: 0,
					sb: 0,
				}
			}
		},
		onLoad: function(){
			let that = this;
			setTimeout(function(){
				that.onSocket();			
				that.getList();
				that.getLocation();	
			},800)	
			wx.getUserInfo({
				success(res) {
					that.$store.state.user.nickName = res.userInfo.nickName;
					that.$store.state.user.avatarUrl = res.userInfo.avatarUrl;
				}
			});
			
		},
		onReady: function(){
		},
		onShow: function(){
			this.onSocket();
		},
		onHide: function(){
			uni.closeSocket();
		},
		onUnload: function(){
			uni.closeSocket();
		},
		updated: function(){},
		beforeUpdate: function(){},
		//下拉动作
		onPullDownRefresh: function(){
			let that = this;
			uni.closeSocket();
			setTimeout(function(){
				that.onSocket();			
				that.getList();
				that.getLocation();	
				uni.stopPullDownRefresh();
				uni.showToast({
					title: '刷新成功',
					duration: 2000,
					icon: "success",
				});
			},2000)	
		},
		//上拉触底
		onReachBottom: function(){},
		//滚动
		onPageScroll: function(e){},
		methods: {
			onSocket: function(){
				let that = this;
				uni.connectSocket({
					url: 'wss://38798879.xyz/Extension/GSocket/WSHandler.ashx'
				});
				uni.onSocketOpen(function (res) {
					console.log('首页WebSocket连接已打开！');
					that.getProperty();
					that.sendProperty();
				});
				uni.onSocketClose(function (res) {
					console.log('首页WebSocket 已关闭！');
				});
			},
			gotoMap: function(){
				uni.navigateTo({
					url: '../map'
				});
			},
			gotoList: function(){
				uni.switchTab({
					url: '../tabBar/device'
				});
			},
			gotoMy: function(){
				uni.switchTab({
					url: '../tabBar/my'
				});
			},
			
			getList: function(){
				let that = this;
				wx.request({
					url: 'https://38798879.xyz/api/Machine/GetIOTList', 
					data: {},
					method: 'GET',
					success: (res_list) => {
						// console.log(that.$store.state.IOT.data);
						that.page.sb = that.$store.state.IOT.data.Machines.length;
						that.$store.state.IOT.data = res_list.data;
						that.$store.state.IOT.state = true;
					},
					fail: (res_list) => {
						console.log(res_list);
					}
				});
			},
			getLocation: function(){
				let that = this;
				wx.request({
					url: 'https://38798879.xyz/api/Machine/GetMapLocation', 
					data: {},
					method: 'GET',
					success: (res_map) => {
						that.$store.state.map.data = res_map.data;
						that.$store.state.map.state = true;
						that.getPageInfo(res_map.data);
					},
					fail: (res_map) => {
						console.log(res_map);
					}
				});
			},
			getPageInfo: function(data){
				let that = this;
				that.company = that.$store.state.company;
				let mills = data.Mills;
				// console.log(that.company);
				that.page.sjdy = that.company.dtu.length;
				for(let i in mills){
					that.company.mill.push({
						MillName: mills[i].MillName,
						MillId: mills[i].MillId,
						MillAddress: mills[i].MillAddress,
					});
					that.company.millarray.push(mills[i].MillName);
					that.company.location.push(mills[i].MillAddress);
					// console.log(mills[i].DTUs);
					for(let n in mills[i].DTUs){
						that.company.dtu.push(mills[i].DTUs[n]);
						// console.log(that.company.dtu)
						that.map.covers.push({
							id: mills[i].DTUs[n].DTUStatus,
							status: mills[i].DTUs[n].DTUId,
							latitude: mills[i].DTUs[n].Latitude,
							longitude:mills[i].DTUs[n].Longitude,
							iconPath:'/static/image/icon/location.png',
						});
					}
				}
				that.map.latitude = that.map.covers[0].latitude;
				that.map.longitude = that.map.covers[0].longitude;
				that.$store.state.company = that.company;
				that.$store.state.map.info = that.map;
// 				console.log(that.map);
// 				console.log(that.$store.state.map);
// 				console.log(that.company);
			},
			bindPickerChange: function(e) {
// 				console.log(e)
// 				console.log(parseInt(e.detail.value));
				this.$store.state.company.active = parseInt(e.detail.value);
			},
			sendProperty: function(){
				let data = {
					Key:1,
					Data:{
						Tags: [
							{MachineId:1,TagId:1},
							{MachineId:1,TagId:4},
							{MachineId:2,TagId:1},
							{MachineId:2,TagId:4},
							{MachineId:6,TagId:42},
							{MachineId:7,TagId:42},
							{MachineId:3,TagId:16},
							{MachineId:4,TagId:16},
						],
					},
				};
				console.log(JSON.stringify(data));
				uni.sendSocketMessage({
					data: JSON.stringify(data)
				});
			},
			getProperty: function(){
				let that = this;
				uni.onSocketMessage(function (res) {
					// console.log(res);
					let re = JSON.parse(res.data);
					console.log(re);
					let data = re.Data;
					if(data.TagId==1 && data.MachineId == 1){
						that.page.dqcd_1 = data.FValue.toFixed(2);
					}else if(data.TagId == 4 && data.MachineId == 1){
						that.page.dqzll_1 = data.FValue.toFixed(2);
					}else if(data.TagId == 1 && data.MachineId == 2){
						that.page.dqcd_2 = data.FValue.toFixed(2);
					}else if(data.TagId == 4 && data.MachineId == 2){
						that.page.dqzll_2 = data.FValue.toFixed(2);
					}else if(data.TagId == 42 && data.MachineId == 6){
						that.page.zhzyg_1 = data.FValue.toFixed(2);
					}else if(data.TagId == 42 && data.MachineId == 7){
						that.page.zhzyg_2 = data.FValue.toFixed(2);
					}else if(data.TagId == 16 && data.MachineId == 3){
						that.page.kqdzdj = data.FValue.toFixed(2);
					}else if(data.TagId == 16 && data.MachineId == 4){
						that.page.kqdcj = data.FValue.toFixed(2);
					}
					that.page.kqzll = (parseFloat(that.page.kqdzdj) + parseFloat(that.page.kqdcj)).toFixed(2);
					that.page.dqzll = (parseFloat(that.page.dqzll_1)+parseFloat(that.page.dqzll_2)).toFixed(2);
					that.page.zhzyg = (parseFloat(that.page.zhzyg_1)+parseFloat(that.page.zhzyg_2)).toFixed(2);
				})
			},
		}
	}
</script>

<style lang="scss">
	.home{
		padding: 0 20upx;
		display: flex;
		flex-wrap: wrap;
		.title_bg{
			display: flex;
			flex-wrap: wrap;
			height: 300upx;
			width: 100%;
			position:absolute;
			top: 0;
			left: 0;
			right: 0;
			background: #0355e5;
			z-index: 0;
		}
		>.title{
			position: relative;
			z-index: 3;
			display: flex;
			flex-wrap: wrap;
			flex-grow: 0;
			flex-shrink: 0;
			padding-top: 10upx;
			margin-bottom: 20upx;
			width: 100%;
			>.tool{
				display: flex;
				width: 100%;
				justify-content: space-between ;
				>.user{
					display: flex;
					background: #f5f5f5;
					border-radius: 88upx;
					border: 4upx solid #f5f5f5;
					>.avarat{
						border-radius: 50%;
						overflow: hidden;
						width: 76upx;
						height: 76upx;
					}
					>.name{
						max-width: 168upx;
						line-height: 76upx;
						color: #444;
						margin-right: 40upx;
						margin-left: 20upx;
						font-size: 26upx;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
					}
				}
				>.company{
					margin: 0;
					outline: none;
					background: none;
					border: none;
					line-height: 76upx;
					color: #fff;
					font-size: 26upx;
					display: flex;
					justify-content: flex-end;
					&::after{
						border: none;
					}
					&.hover{
						color: #ccc;
					}
					>.h5{
						font-size: 26upx;
					}
					.picker{
						display: flex;
						justify-content: flex-end;
						flex-wrap: nowrap;
					}
					.iconfont{
						font-size: 24upx;
						margin-left: 10upx;
					}
				}
			}
			>.mapContainer{
				display: flex;
				border-radius: 20upx;
				margin-top: 20upx;
				width: 100%;
				padding: 10upx;
				background: #fff;
				border: 1upx solid #ddd;
				position: relative;
				flex-wrap: wrap;
				>.map{
					width: 100%;
					position: relative;
					border-radius: 20upx;
					.mark{
						position: absolute;
						z-index: 0;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
					}
				}
				>.tool{
					width: 100%;
					display: flex;
					justify-content: space-between;
					flex-wrap: nowrap;
					flex-grow: 0;
					flex-shrink: 0;
					>.text{
						width: 68%;
						overflow: hidden;
						display: flex;
						>.h5{
							display: flex;
							color: #666;
							font-size: 28upx;
							width: 100%;
							line-height: 80upx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							padding: 10upx ;
						}
					}
					>.btn{
						width: 32%;
						display: flex;
						justify-content: flex-end;
						>.btn{
							border: none;
							outline: none;
							margin: 10upx 10upx 0 0;
							background: #007AFF;
							font-size: 42upx;
							color: #fff;
							border-radius: 50%;
							width: 80upx;
							height: 80upx;
							text-align: center;
							line-height: 80upx;
							padding: 0;
							&.hover{
								background: #3498DB;
							}
						}
					}
				}
			}
		}
		>.main{
			background: #f5f5f5;
			padding: 0;
			margin: 0 -20upx;
			position: relative;
			z-index: 999;
			display: flex;
			flex-wrap: wrap;
			box-sizing: border-box;
			width: calc(100% + 40upx);
			overflow: hidden;
			border-bottom: 20upx solid #f5f5f5;
			>.title{
				display: flex;
				background: #fff;
				width: 100%;
				padding-left: 20upx;
				>.i{
					background: #007AFF;
					height: 80upx;
					width: 20upx;
					margin-right: 20upx;
				}
				>.h5{
					font-size: 28upx;
					line-height: 80upx;
				}
			}
			>.content{
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				width: 100%;
				background: #fff;
				>.team{
					border: 1upx #ddd solid;
					padding: 20upx;
					position: relative;
					display: flex;
					flex-wrap: wrap;
					width: 100%;
					box-sizing: border-box;
					border: 1upx solid #ddd;
					&.half{
						width: 50%;
					}
					>.h3{
						display: flex;
						font-size: 48upx;
						width: 80%;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
						color: #444;
						padding: 0 10upx;
					}
					>.h2{
						display: flex;
						font-size: 38upx;
						width: 80%;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
						color: #444;
						padding: 0 10upx;
					}
					>.h4{
						display: flex;
						font-size: 24upx;
						color: #999;
						width: 80%;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
						padding: 0 10upx;
					}
					>.h5{
						color: #999;
						display: flex;
						font-size: 24upx;
						width: 80%;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
						padding: 0 10upx;
					}
					>.icon{
						display: block;
						position: absolute;
						right: 20upx;
						top: 20upx;
						width: 48upx;
						height: 48upx;
					}
				}
			}
		}
		>.serve{
			display: flex;
			justify-content: center;
			width: 100%;
			padding: 20upx 0 40upx;
			text-align: center;
			font-size: 26upx;
			color: #ccc;
		}
	}
	
</style>
