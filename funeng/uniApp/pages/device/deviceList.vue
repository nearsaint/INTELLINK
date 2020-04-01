<template>
	<view class="deviceList">
		<view class="title" style="margin-top: 20upx;">
			<view class="status" :class="[machine.Status==0? 'running':'',machine.Status==1? 'stop':'',machine.Status==2? 'offline':'',machine.Status==3? 'standby':'',machine.Status==4? 'alarm':'',machine.Status==5? 'warning':'']">
				<view class="h5">{{machine.MachineName}}</view>
				<view class="h6">状态:
					<template v-if="machine.Status == 0">运行</template>
					<template v-if="machine.Status == 1">停止</template>
					<template v-if="machine.Status == 2">离线</template>
					<template v-if="machine.Status == 3">就绪</template>
					<template v-if="machine.Status == 4">错误</template>
					<template v-if="machine.Status == 5">警告</template>
				</view>
				<text class="iconfont" v-if="machine.Status == 0">&#xe78b;</text><!-- running -->
				<text class="iconfont" v-if="machine.Status == 1">&#xe792;</text><!-- stop -->
				<text class="iconfont" v-if="machine.Status == 2">&#xe7a0;</text><!-- offline -->
				<text class="iconfont" v-if="machine.Status == 3">&#xe77d;</text><!-- standby -->
				<text class="iconfont" v-if="machine.Status == 4">&#xe796;</text><!-- alarm -->
				<text class="iconfont" v-if="machine.Status == 5">&#xe783;</text><!-- warn -->
			</view>
		</view>
		<view class="title">
			<view class="info">
				<view class="name">设备信息</view>
				<view class="ul">
					<view class="li">
						<text class="h3">设备名</text>
						<text class="h5">{{machine.MachineName}}</text>
					</view>
					<view class="li">
						<text class="h3">设备ID</text>
						<text class="h5">{{machine.MachineId}}</text>
					</view>
					<view class="li">
						<text class="h3">设备类型</text>
						<text class="h5">{{machine.MachineTypeName}}</text>
					</view>
					<view class="li">
						<text class="h3">所属区域</text>
						<text class="h5">{{machine.AreaName}}</text>
					</view>
					<view class="li">
						<text class="h3">所属数采单元</text>
						<text class="h5">{{machine.DTUName}}</text>
					</view>
					<view class="li">
						<text class="h3">设备参数个数</text>
						<text class="h5">{{machine.Tags.length}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="count">
				<!-- <view class="title">
					<text class="item">设备参数</text>
				</view> -->
				<view class="ul">
					<button v-for="(item, index) in machine.Tags" :key="index" class="li" hover-class="hover" @click="gotoTag(item)" :class="[item.RTagAlarmType==1||item.RTagAlarmType==3?'warrning':'',item.RTagAlarmType==2||item.RTagAlarmType==4?'alarm':'']">
						<view class="text">
							<view class="value">
								<text class="val blue"  v-if="item.DataType==0 && item.TagType == 0">{{item.FValue}}</text>
								<text class="val" :class="[item.FValue==1&&item.AlarmType==0?'green':'',item.FValue==1&&item.AlarmType==1?'red':'']" v-if="item.DataType==0 && item.TagType == 1">
									<template v-if="item.FValue==1 && item.AlarmType==0"><text class="iconfont">&#xe89a;</text></template>
									<template v-if="item.FValue==1 && item.AlarmType==1"><text class="iconfont">&#xe89f;</text></template>
									<template v-if="item.FValue==0"><text class="iconfont">&#xe89d;</text></template>
								</text>
								<text class="val blue2" v-if="item.DataType==0 && item.TagType == 2">{{item.FValue}}</text>
								<text class="val" v-if="item.DataType==1 && item.TagType == 0">"{{item.SValue}}"</text>
								<text class="val" v-if="item.DataType==1 && item.TagType == 1">"{{item.SValue}}"</text>
								<text class="unit">{{item.Unit}}</text>
							</view>
							<text class="tip">{{item.TagName}}</text>
						</view>
						<text class="iconfont">&#xe856;</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as echarts from '../../components/uni/echarts/echarts.simple.min.js';
	import mpvueEcharts from '../../components/uni/mpvue-echarts/src/echarts.vue';
	
	
	export default {
		data() {
			return {
				query: '',
				machine: '',
			}
		},
		onLoad: function(e){
			let that = this;
			console.log(e);
			this.query = e;
			this.machineId = e.machineId;
			this.machineName = e.machineName;
			uni.setNavigationBarTitle({
				title: e.machineName
			});
			this.getMachine();
			setTimeout(function(){
				that.onSocket();
			},800)	
		},
		onReady: function(){},
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
				uni.stopPullDownRefresh();
				that.getMachine();
				that.onSocket();
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
					console.log('设备WebSocket连接已打开！');
					that.sendMachineId();
					that.getMachineProperty();
				});
				uni.onSocketClose(function (res) {
					console.log('设备WebSocket 已关闭！');
				});
			},
			gotoTag: function(e){
				if(e.TagType == 0){
					this.gotoProperty(e);
				}else if(e.TagType == 1){
					this.gotoLog(e)
				}
			},
			gotoProperty: function(e){
				let that = this;
				uni.navigateTo({
					url: '../device/property?machineId='+that.machineId+'&propertyName='+e.TagName+ '&propertyId='+e.TagId
				});
			},
			gotoLog: function(e){
				let that = this;
				uni.navigateTo({
					url: '../device/log?machineName='+that.machineName+'&machineId='+that.machineId+'&propertyName='+e.TagName+ '&propertyId='+e.TagId
				});
			},
			
			getMachine: function(){
				let that = this;
				let list = that.$store.state.IOT.data.Machines;
				// console.log(list);
				for(let i in list){
					if(that.query.machineId == list[i].MachineId){
						that.machine = list[i];
					}
				}
				// console.log(that.machine);
			},
			
			sendMachineId : function(){
				let that = this;
				if(that.machineId){
					let data = {
						Key:0,
						Data:{
							MachineIds: [that.machineId],
						},
					};
					console.log(JSON.stringify(data));
					uni.sendSocketMessage({
						data: JSON.stringify(data)
					});
				}
			},
			getMachineProperty: function(){
				let that = this;
				uni.onSocketMessage(function (res) {
					// console.log(res);
					let data = JSON.parse(res.data);
					console.log(data);
// 					console.log(that.machine);
					if(data.Data.MachineStatus){
						that.machine.Status = data.Data.MachineStatus
					}
					if(data.Data.InitialMachineDtos){
						if(data.Data.InitialMachineDtos.length==0){
							return
						}
						that.machine.Status = data.Data.InitialMachineDtos[0].MachineStatus;
					}
					let Tags = that.machine.Tags;
					let RTags;
					if(data.Data.InitialMachineDtos){
						RTags = data.Data.InitialMachineDtos[0].RTags
					}else{
						RTags = data.Data.RTags
					}
					console.log(Tags);
					console.log(RTags);
					for(let i in RTags){
						for(let n in Tags){
							if(RTags[i].TagId == Tags[n].TagId){
								if(Tags[n].TagType==0 || Tags[n].TagType==2){
									Tags[n].FValue = RTags[i].FValue.toFixed(2);
								}else{
									Tags[n].FValue = RTags[i].FValue
								}
								Tags[n].SValue = RTags[i].SValue
							}
						}
					}
				});
			}
		},
		components: {
			mpvueEcharts
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.deviceList{
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		position: relative;
		background: #efefef;
		padding-bottom: 20upx;
		>.title{
			display: flex;
			flex-wrap: wrap;
			width: calc(100% - 40upx);
			background: #fff;
			padding: 0;
			margin: 0 20upx 20upx;
			color: #fff;
			border-radius: 10upx;
			>.status{
				background: #999;
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				padding: 20upx;
				border-radius: 10upx;
				overflow: hidden;
				position: relative;
				&.running{
					background: #09BB07;
				}
				&.standby{
					background: #00b7ee;
				}
				&.stop{
					background: #666;
				}
				&.off{
					background: #ccc;
				}
				&.warning{
					background: #FFB400;
				}
				&.alarm{
					background: #cd0615;
				}
				>.h5{
					font-size: 52upx;
					width: 100%;
				}
				>.h6{
					font-size: 26upx;
					width: 100%;
				}
				>.iconfont{
					position: absolute;
					right: 10upx;
					top: 50%;
					transform: translateY(-50%);
					font-size: 188upx;
					opacity: 0.8;
				}
			}
			>.info{
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				padding: 0;
				>.name{
					width: 100%;
					// border-bottom: 1upx #eee solid;
					line-height: 32upx;
					color: #444;
					font-size: 28upx;
					padding: 20upx 20upx;
					background: #ccc;
					border-radius: 10upx 10upx 0 0;
				}
				>.ul{
					display: flex;
					flex-wrap: wrap;
					padding: 0 0 0 20upx;
					>.li{
						width: 100%;
						border-bottom: 1upx dashed #eee;
						display: flex;
						justify-content: space-between;
						line-height: 42upx;
						color: #333;
						padding: 20upx 20upx 20upx 0;
						font-size: 26upx;
						&:last-child{
							border: none;
						}
					}
				}
			}
			>.text{
				display: flex;
				flex-wrap: wrap;
				width: 100%;
				position: fixed;
				z-index: 10;
				top: 0;
				left: 0;
				right: 0;
				padding: 20upx 0;
				background: #007AFF;
				>.name{
					padding: 0 40upx;
					font-size: 24upx;
					color: #eee;
					width: 100%;
					margin: 0;
					text-align: center;
				}
				
			}
			
		}
		>.content{
			display: flex;
			width: 100%;
			flex-wrap: wrap;
			>.count{
				display: flex;
				flex-wrap: wrap;
				// border-top: 1upx solid #ddd;
				>.title{
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					width: 100%;
					background: #f3f3f3;
					border-bottom: 1upx solid #ddd;
					padding: 20upx 40upx;
					>.item{
						width: 100%;
						font-size: 26upx;
						color: #666;
						line-height: 36upx;
					}
				}
				>.ul{
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					width: 100%;
					padding-right: 20upx;
					>.li{
						// border-bottom: 1upx solid #ddd;
						position: relative;
						transition: background-color 0.3s;
						display: flex;
						flex-wrap: wrap;
						width: calc(50% - 20upx);
						margin-left: 20upx; 
						margin-bottom: 20upx;
						outline: none;
						background: #fff;
						text-align: left;
						border-radius: 10upx;
						padding: 0 20upx;
						&::after{
							background: none;
							border:none;
						}
						&.hover{
							background-color: #f5f5f5;
							
							>.iconfont{
								right: 10upx;
								color: #666;
							}
						}
						>.text{
							padding: 20upx 10upx;
							display: flex;
							flex-wrap: wrap;
							width: 100%;
							>.value{
								line-height: 42upx;
								margin-bottom: 10upx;
								width: 100%;
								font-weight: bold;
								white-space: nowrap;
								text-overflow: ellipsis;
								>.val{
									font-size: 32upx;
									color: #999;
									max-width: 88%;
									text-overflow: ellipsis;
									white-space: nowrap;
									overflow: hidden;
									&.blue{
										color: #3498DB;
									}
									&.blue2{
										color: #8E44AD;
									}
									&.green{
										color: #27AE60;
									}
									&.red{
										color: #c70000;
									}
								}
								>.unit{
									font-size: 24upx;
									color: #999;
									margin-left: 5upx;
								}
							}
							>.tip{
								font-size: 26upx;
								line-height: 38upx;
								width: 100%;
								color: #999;
								white-space: nowrap;
							}
						}
						>.iconfont{
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
							right: 20upx;
							font-size: 36upx;
							color: #999;
							transition: color 0.3s , right 0.3s;
						}
					}
				}
			}
		}
	}
</style>
