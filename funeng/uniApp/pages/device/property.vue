<template>
	<view class="property">
		<view class="timeInfo" v-show="historyMode">
			<button class="history" @click="chartHistory">{{date_start + ' ' +time_start}} 至 {{date_end + ' ' +time_end}}</button>
			<button class="historyclear" @click="closeHistoryMode">清除</button>
		</view>
		<view class="content">
			<view class="chart">
				<mpvue-echarts class="mpvue" :echarts="chart.echarts" :onInit="lineInit" canvasId="line" ref="lineChart" />
			</view>
			<!-- <view class="propertyList">
				<view class="ul">
					<view class="li">
						<text class="value">32°</text>
						<text class="name">实时值</text>
					</view>
					<view class="li">
						<text class="value">30°</text>
						<text class="name">平均值</text>
						<switch class="switch" @change="switch2Avg"/>
					</view>
					<view class="li">
						<text class="value">42°</text>
						<text class="name">最小值</text>
						<switch class="switch" @change="switch2Min"/>
					</view>
					<view class="li">
						<text class="value">22°</text>
						<text class="name">最大值</text>
						<switch class="switch" @change="switch2Max"/>
					</view>
				</view>
			</view> -->
		</view>
		<button class="timeBtn" hover-class="hover" @click="chartHistory" v-if="!historyMode">
			查看历史
		</button>
		<button class="timeBtn left" hover-class="hover" @click="closeHistoryMode" v-if="historyMode">
			查看实时
		</button>
		<button class="mask" v-if="history" @click="closeHistory"></button>
		<view class="timeContainer animated fadeInUp" v-if="history">
			<text class="h5">请选择时间区间</text>
			<view class="timer">
				<text>开始时间</text>
				<picker mode="date" :value="date_start" :start="startDate" :end="date_end" @change="bindDateChange_start">
					<view class="uni-input">{{date_start}}</view>
				</picker>
				<picker mode="time" :value="time_start" start="00:00" :end="time_same1" @change="bindTimeChange_start">
					<view class="uni-input">{{time_start}}</view>
				</picker>
			</view>
			<view class="timer">
				<text>结束时间</text>
				<picker mode="date" :value="date_end" :start="date_start" :end="endDate" @change="bindDateChange_end">
					<view class="uni-input">{{date_end}}</view>
				</picker>
				<picker mode="time" :value="time_end" :start="time_same2" end="23:59" @change="bindTimeChange_end">
					<view class="uni-input">{{time_end}}</view>
				</picker>
			</view>
			<view class="timer">
				<button class="button cancel" @click="closeHistory">取消</button>
				<button class="button submit" @click="openHistoryMode">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import * as echarts from '../../components/uni/echarts/echarts.simple.min.js';
	import mpvueEcharts from '../../components/uni/mpvue-echarts/src/echarts.vue';
	var chartData = [1,1];
	var chartDate = [1,1];
	let lineOption = {
			tooltip: {
			trigger: 'axis',
			position: function (pt) {
				return [pt[0], '10%'];
			},
			axisPointer: {
				type: 'cross',
				label: {
					color: '#fff',
					backgroundColor: 'rgba(0,0,0,0.5)'
				},
				lineStyle: {
					color: 'rgba(0,0,0,0.5)'
				},
				crossStyle: {
					color: 'rgba(0,0,0,0.5)'
				},
			}
		},
		grid: {
			right: 10,
			top: 10,
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: chartDate,
			axisLine: {
				lineStyle: {
					color: '#fff',
				}
			}
		},
		yAxis: {
			type: 'value',
			boundaryGap: [0, '100%'],
			axisLine: {
				lineStyle: {
					color: '#fff',
				}
			}
		},
		dataZoom: [{
			type: 'inside',
			start: 80,
			end: 100
		}, {
			start: 0,
			end: 10,
			handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
			handleSize: '80%',
			handleStyle: {
				color: '#fff',
				shadowBlur: 3,
				shadowColor: 'rgba(0, 0, 0, 0.6)',
				shadowOffsetX: 2,
				shadowOffsetY: 2
			}
		}],
		series: [
			{
				type:'line',
				smooth: true,
				symbol: 'none',
				sampling: 'average',
				animation: false,
				itemStyle: {
					color: '#fff'
				},
				data: chartData,
				markPoint: {
					label: {
						color: '#333',
					},
					data: [
						{type: 'max', name: '最大值'},
						{type: 'min', name: '最小值'}
					]
				},
				markLine: {
					lineStyle: {
						color: '#fff'
					},
					data: [
						{type: 'average', name: '平均值'}
					]
				}
			}
		]
	};
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			
			return {
				chart:{
					echarts: echarts,
				},
				propertyId: NaN,
				tagId: NaN,
				history: false,
				historyMode: false,
				scrolling:0,
				date_start: currentDate,
				time_start: '00:00',
				date_end: currentDate,
				time_end: '23:59',
				time_same1: '23:59', 
				time_same2: '00:00', 
				
			}
		},
		onLoad: function(e){
			let that = this;
			chartData = []
			chartDate = []
			lineOption.series[0].data = chartData;
			lineOption.xAxis.data = chartDate;
			console.log(e);
			this.tagId = e.propertyId;
			this.machineId = e.machineId;
			uni.setNavigationBarTitle({
				title: e.propertyName,
			});
			uni.closeSocket();
		},
		onReady: function(){
			let that = this;
			setTimeout(function(){
				that.getProperty_now();
			},500)
		},
		onShow: function(){},
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
		onPageScroll: function(e){
			console.log(e)
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			onSocket: function(){
				let that = this;
				uni.connectSocket({
					url: 'wss://38798879.xyz/Extension/GSocket/WSHandler.ashx'
				});
				uni.onSocketOpen(function (res) {
					console.log('参数WebSocket连接已打开！');
					that.getProperty_new();
					that.getNewProperty();
				});
				uni.onSocketClose(function (res) {
					console.log('参数WebSocket 已关闭！');
				});
			},
			chartHistory: function(){
				this.history = true;
			},
			closeHistory: function(){
				this.history = false;
			},
			closeHistoryMode: function(){
				this.closeHistory();
				this.historyMode = false;
				this.getProperty_now();
				// that.$refs.lineChart.init();
			},
			openHistoryMode: function(){
				this.historyMode = true;
				uni.closeSocket();
				this.getProperty_history();
				this.closeHistory();
			},
			lineInit : function(canvas, width, height) {
				let lineChart = echarts.init(canvas, null, {
					width: width,
					height: height
				});
				canvas.setChart(lineChart);
				lineChart.setOption(lineOption);
				return lineChart
			},
			switch2Max : function(e){
				console.log(e)
				if(e.detail.value){
					// lineOption.series.markPoint
				}else{
					
				}
			},
			switch2Min : function(e){
				console.log(e)
			},
			switch2Avg : function(e){
				console.log(e)
			},
			bindDateChange_start: function(e) {
				this.date_start = e.target.value;
				this.time_start= '00:00',
				this.time_end= '23:59',
				this.sameDate_to_setTime();
			},
			bindTimeChange_start: function(e) {
				this.time_start = e.target.value;
				this.sameDate_to_setTime();
			},
			bindDateChange_end: function(e) {
				this.date_end = e.target.value;
				this.time_end= '23:59',
				this.sameDate_to_setTime();
			},
			bindTimeChange_end: function(e) {
				this.time_end = e.target.value;
				this.sameDate_to_setTime();
			},
			sameDate_to_setTime: function(){
				if(this.date_start == this.date_end){
					this.time_same1 = this.time_end;
					this.time_same2 = this.time_start;
				}else{
					this.time_same1 = '23:59';
					this.time_same2 = '00:00';
				}
			},
			getDate: function(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			getProperty_now: function(){
				let that = this;
				chartData = [];
				chartDate = [];
				wx.request({
					url: 'https://38798879.xyz/api/Machine/GetLatestRTTags', 
					data: {
						"Inputs": [
							{
								"GetTagsType": 0,
								"MachineId": that.machineId,
								"TagId": that.tagId,
								"QueryType": 0,
								"StatisticType": 0,
								"StartTime": '',
								"EndTime": '',
								"Count": 200
							}
						]
					},
					method: 'POST',
					success: (res) => {
						console.log(res);
						chartData = [];
						chartDate = [];
						for(let i in res.data[0].Tags){
							chartData.push(res.data[0].Tags[i].FValue.toFixed(2));
							chartDate.push(res.data[0].Tags[i].TimeStamp);
						}
						lineOption.series[0].data = chartData;
						lineOption.xAxis.data = chartDate;
						that.$refs.lineChart.init();
						that.onSocket();
					},
					fail: (res) => {
						console.log(res);
					}
				});
			},
			getProperty_history: function () {
				let that = this;
				let startTimer = that.date_start+' '+that.time_start+':00';
				let endTimer = that.date_end+' '+that.time_end+':00';
				console.log(startTimer);
				chartData = [];
				chartDate = [];
				wx.request({
					url: 'https://38798879.xyz/api/Machine/GetHtyRTTags', 
					data: {
						"Inputs": [
							{
								"GetTagsType": 0,
								"MachineId": that.machineId,
								"TagId": that.tagId,
								"QueryType": 0,
								"StatisticType": 0,
								"StartTime": startTimer,
								"EndTime": endTimer,
								"Count": 200
							}
						]
					},
					method: 'POST',
					success: (res) => {
						console.log(res);
						for(let i in res.data[0].Tags){
							chartData.push(res.data[0].Tags[i].FValue.toFixed(2));
							chartDate.push(res.data[0].Tags[i].TimeStamp);
						};
						lineOption.series[0].data = chartData;
						lineOption.xAxis.data = chartDate;
						that.$refs.lineChart.init();
					},
					fail: (res) => {
						console.log(res);
					}
				});
			},
			getProperty_new: function(e) {
				let that = this;
				uni.onSocketMessage(function (res) {
					let data = JSON.parse(res.data);
					console.log(data);
					chartData.push(data.Data.FValue.toFixed(2));
					chartDate.push(data.Data.TimeStamp);
					lineOption.series[0].data = chartData;
					lineOption.xAxis.data = chartDate;
					that.$refs.lineChart.init();
				});
			},
			getNewProperty: function(e) {
				  let that = this;
				  let machineId = parseInt(that.machineId);
				  let tagId = parseInt(that.tagId);
				  let data = {
					Key: 1,
					Data: {
					  Tags: [{
						MachineId: machineId,
						TagId: tagId
					  }],
					},
				  };
				  console.log(JSON.stringify(data));
				  if (machineId && tagId) {
					setTimeout(function() {
						uni.sendSocketMessage({
							data: JSON.stringify(data)
						});
					}, 500)
				  }
			},
		},
		components: {
			mpvueEcharts
		},
	}
</script>

<style lang="scss">
	.property{
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		position: relative;
		padding: 20upx;
		box-sizing: border-box;
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
		>.timeInfo{
			border-radius: 10upx;
			padding: 0 80upx 0 0;
			height: 80upx;
			margin-bottom: 20upx;
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			position: relative;
			>button.history{
				width: 100%;
				padding: 0 20upx;
				border-radius: 0;
				border: none;
				font-size: 24upx;
				line-height: 80upx;
				height: 80upx;
				background: #666;
				color: #fff;
			}
			>button.historyclear{
				border-radius: 0;
				border-left: 1upx solid #999;
				border-right: none;
				border-top: none;
				border-bottom: none;
				background: #444;
				position: absolute;
				top: 0;
				right: 0;
				height: 80upx;
				line-height: 80upx;
				padding: 0 15upx;
				color: #fff;
				font-size: 24upx;
			}
		}
		>.content{
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			padding: 10upx 0 10upx 10upx;
			justify-content: flex-start;
			background-color: #0355e5;
			border-radius: 10upx;
			>.chart{
				height: 650upx;
				width: 100%;
				border-radius: 10upx;
				margin-right: 10upx;
			}
			>.propertyList{
				display: flex;
				flex-wrap: wrap;
				width: 100%;
				>.ul{
					display: flex;
					flex-wrap: wrap;
					width: 100%;
					justify-content: flex-start;
					>.li{
						display: flex;
						flex-wrap: wrap;
						width: calc(50% - 10upx);
						background: #fff;
						box-sizing: border-box;
						padding: 20upx;
						position: relative;
						border-radius: 10upx;
						margin-right: 10upx;
						margin-top: 10upx;
						>.value{
							width: 100%;
							font-size: 42upx;
							color: #333;
							line-height: 52upx;
							text-align: left;
						}
						>.name{
							width: 100%;
							font-size: 28upx;
							color: #666;
							line-height: 38upx;
							text-align: left;
						}
						>.switch{
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
							right: 10upx;
						}
					}
				}
			}
		}
		>.timeBtn{
			border-radius: 50upx 0 0 50upx;
			background: #0355e5;
			color: #fff;
			position: fixed;
			bottom: 40upx;
			right: 0;
			display: inline-block;
			padding: 0 20upx 0 30upx;
			font-size: 28upx;
			line-height: 72upx;
			&.hover{
				background: #007AFF;
			}
			&.left{
				right: auto;
				left: 0;
				border-radius: 0 50upx 50upx 0;
				padding: 0 30upx 0 20upx;
			}
		}
		>.mask{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			border: none;
			border-radius: 0;
			outline: none;
			background: rgba(0,0,0,0.4);
			width: 100%;
			height: 100%;
		}
		>.timeContainer{
			border-top: 1upx solid #0355e5;
			background: #fff;
			position: fixed;
			padding: 0;
			width: 100%;
			bottom: 0;
			left: 0;
			right: 0;
			>.h5{
				font-size: 24upx;
				padding: 10upx 0 ;
				text-align: center;
				display: block;
				width: 100%;
				color: #999;
			}
			>.timer{
				display: flex;
				justify-content: space-around;
				flex-wrap: nowrap;
				flex-grow: 0;
				flex-shrink: 0;
				border-top: 1upx solid #eee;
				padding: 20upx;
				line-height: 42upx;
				>text{
					font-size: 24upx;
					line-height: 52upx;
				}
				>picker{
					font-size: 28upx;
					line-height: 52upx;
					// margin-left: 40upx;
				}
				>.button{
					color: #fff;
					line-height: 62upx;
					border-radius: 10upx;
					margin: 0 10upx;
					text-align: center;
					display: inline-block;
					width: calc(50% - 20upx);
					&.hover{
						opacity: 0.8;
					}
					&.cancel{
						background-color: #999;
					}
					&.submit{
						background-color: #007AFF;
					}
				}
			}
		}
	}
		
</style>
