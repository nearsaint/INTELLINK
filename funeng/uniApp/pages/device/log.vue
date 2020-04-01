<template>
	<view class="log">
		<view class="content">
			<!-- <view class="search">
				<view class="input">
					<text class="iconfont">&#xe9a2;</text>
					<input class="input" type="text" confirm-type="search" placeholder="搜索您要找的设备">
				</view>
				<button class="inhaul" hover-class="hover"><text class="iconfont">&#xe803;</text></button>
			</view> -->
			<view class="list ul">
				<text class="h5" v-show="list.length==0">暂无数据</text>
				<view class="li" v-for="(item,index) in list" :key="index" :class="[item.FValue==1&&item.AlarmType==0?'green':'',item.FValue==1&&item.AlarmType==1?'red':'']">
					<text class="device">
						<template v-if="item.FValue==0&&item.SValue==null"><text class="iconfont">&#xe89d;</text></template>
						<template v-if="item.FValue==1&&item.AlarmType==0"><text class="iconfont">&#xe89a;</text></template>
						<template v-if="item.FValue==1&&item.AlarmType==1"><text class="iconfont">&#xe89f;</text></template>
						<template v-if="item.FValue==0&&item.AlarmType==0&&item.SValue!==null">{{item.SValue}}</template>
					</text>
					<text class="info">{{machineName + ' ' + propertyName}}</text>
					<text class="time">{{item.TimeStamp}}</text>
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
				scrolling:0,
				count: 20,
				list: [],
				propertyId:'',
				machineId:'',
				machineName: '',
				propertyName: '',
			}
		},
		onLoad: function(e){
			let that = this;
			console.log(e);
			this.propertyId = e.propertyId;
			this.propertyName = e.propertyName;
			this.machineId = e.machineId;
			this.machineName = e.machineName;
			uni.setNavigationBarTitle({
				title: e.propertyName
			});
			this.getProperty_now();
		},
		onReady: function(){},
		onShow: function(){},
		onHide: function(){},
		onUnload: function(){},
		updated: function(){},
		beforeUpdate: function(){},
		//下拉动作
		onPullDownRefresh: function(){
			let that = this;
			setTimeout(function(){
				uni.stopPullDownRefresh();
				that.count = 20;
				that.getProperty_now();
				uni.showToast({
					title: '刷新成功',
					duration: 2000,
					icon: "success",
				});
			},2000)	
		},
		//上拉触底
		onReachBottom: function(){
			this.count = this.count + 20;
			this.getProperty_now();
		},
		//滚动
		onPageScroll: function(e){
			console.log(e)
		},
		methods: {
			getProperty_now: function(){
				let that = this;
				wx.request({
					url: 'https://38798879.xyz/api/Machine/GetLatestRTTags', 
					data: {
						"Inputs": [
							{
								"GetTagsType": 0,
								"MachineId": that.machineId,
								"TagId": that.propertyId,
								"QueryType": 0,
								"StatisticType": 0,
								"StartTime": '',
								"EndTime": '',
								"Count": that.count,
							}
						]
					},
					method: 'POST',
					success: (res) => {
						console.log(res);
						that.list = res.data[0].Tags;
					},
					fail: (res) => {
						console.log(res);
					}
				});
			},
		},
		components: {
			mpvueEcharts
		},
	}
</script>

<style lang="scss">
	.log{
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		position: relative;
		>.title{
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			background: #0355e5;
			color: #fff;
			padding-top: 50upx;
			position: relative;
			>.text{
				display: flex;
				flex-wrap: wrap;
				width: 100%;
				position: absolute;
				z-index: 10;
				top: 0;
				left: 0;
				right: 0;
				padding: 5upx 0;
				background: #007AFF;
				>.device{
					padding: 0 40upx;
					font-size: 30upx;
					color: #eee;
					width: 100%;
					margin: 0;
					text-align: center;
					transition: font-size 0.3s;
					background: #007AFF;
				}	
			}
			
		}
		>.content{
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			padding: 0;
			justify-content: flex-start;
			>.list{
				padding: 10upx;
				display: flex;
				width: 100%;
				flex-wrap: wrap;
				>.li{
					border-left: 10upx #ccc solid;
					padding: 20upx;
					background: #f5f5f5;
					margin-bottom: 10upx;
					display: flex;
					flex-wrap: wrap;
					justify-content: flex-start;
					width: 100%;
					color: #999;
					&.red{
						background: rgba(200,0,0,0.6);
						color: #fff;
						border-color: #900000;
						>.device{
							color: #fff;
						}
					}
					&.green{
						background: rgba(34,172,56,0.6);
						color: #fff;
						border-color: #b3d465;
						>.device{
							color: #fff;
						}
					}
					>.device{
						font-size: 32upx;
						color: #666;
						width: 50%;
						text-align: left;
					}
					>.info{
						font-size: 24upx;
						width: 50%;
						text-align: right;
					}
					>.time{
						font-size: 24upx;
						width: 50%;
					}
					>.tip{
						font-size: 24upx;
						width: 50%;
						text-align: right;
					}
				}
			}
		}
	}
	.search{
		height: 100upx;
		display: flex;
		width: 100%;
		background: #f5f5f5;
		box-sizing: border-box;
		padding: 14upx 10upx 14upx 20upx;
		border-bottom: 1upx solid #ddd;
		> .input{
			display: flex;
			justify-content: space-between;
			flex-wrap: nowrap;
			background: #fff;
			border: 1upx solid #ddd;
			border-radius: 50upx;
			width: calc(100% - 82upx);
			height: 72upx;
			position: relative;
			>.iconfont{
				position: absolute;
				top: 0;
				left: 10upx;
				height: 72upx;
				width: 72upx;
				line-height: 72upx;
				font-size: 42upx;
				text-align: center;
				color: #ccc;
			}
			>.input{
				padding: 10upx 10upx 10upx 94upx;
				font-size: 32upx;
				line-height: 52upx;
				height: 52upx;
			}
		}
	}.inhaul{
		border: none;
		background: none;
		outline: none;
		>.iconfont{
			line-height: 72upx;
			height: 72upx;
			width: 72upx;
			text-align: center;
			display: block;
			font-size: 48upx;
			color: #999;
			border-radius: 50%;	
		}
		
		&.hover{
			>.iconfont{
				color: #ccc;	
			}
		}
		&::after{
			border:none;
		}
	}
</style>
