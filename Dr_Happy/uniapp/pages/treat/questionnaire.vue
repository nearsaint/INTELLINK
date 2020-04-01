<template>
	<view class=" questionnaire">
		<view class="info">
			<view class="pmain">
				<text class="h1">{{getP(item.current,item.cycle)}}</text>
				<text class="h6">%</text>
			</view>
			<text class="h3">{{item.treatment}}</text>
			<text class="h5">{{item.hospital}}-{{item.subject}}</text>
			<view class="tiper">
				 <view>
					 <text class="h5">
						 <template v-if="item.state==0">等待中</template>
						 <template v-if="item.state==1">进行中</template>
						 <template v-if="item.state==2">已拒绝</template>
						 <template v-if="item.state==3">结束</template>
					 </text>
					 <text>状态</text>
				 </view>
				 <view class="line"></view>
				 <view>
					 <text class="h5">{{item.current}}</text>
					 <text>当前天</text>
				 </view>
				 <view>
					 <text class="h5">{{item.start}}</text>
					 <text>开始日期</text>
				 </view>
				 <view class="line"></view>
				 <view>
					 <text class="h5">{{item.cycle}}</text>
					 <text>周期</text>
				 </view>
			</view>
		</view>
		<view class="ucenter-line"></view>
		<!-- <text class="ucenter-line-text">回访记录</text>
		<scroll-view class="grace-scroll-x" scroll-x>
			<view class="items" 
			v-for="(item, index) in dateList" :key="index" :class="[currentIndex == index ? 'grace-scroll-day-active' : '']"
			@tap="changeDay(index)">
				<view class="date" :class="[currentIndex == index ? 'grace-scroll-day-active' : '']"> <text>第</text>{{index+1}}<text>天</text></view>
				<view class="week" :class="[currentIndex == index ? 'grace-scroll-day-active' : '']">{{item.day}} {{item.week}}</view>
			</view>
		</scroll-view>
		<view class="grace-list">
			<view class="info">
				<view class="tiper">
					 <view>
						 <text class="h5">阶段I</text>
						 <text>阶段</text>
					 </view>
					 <view class="line"></view>
					 <view>
						 <text class="h5">11</text>
						 <text>问题数</text>
					 </view>
				</view>
			</view>
			<view class="items" v-for="(item, index) in 10" :key="index">
				<text class="h5">焦虑（如紧张、担心、不安等等）/抑郁（如做事情缺乏兴趣、没乐趣、提不起精神等等）</text>
				<text class="h6">我不觉得焦虑或抑郁</text>
			</view>
		</view> -->
	</view>
</template>

<script>
	import graceCoupons from "../../graceUI/components/graceCoupons.vue";
	var graceDate = require("../../graceUI/jsTools/date.js");
	// 起始日期, 格式 2019-08-01
	// 例如今天
	var startDay = "2019-10-14";
	// 区间天数
	var timeRegion = 6;
	// 获取当天时间
	// function getNowFormatDate() {
		// var date = new Date();
		// var seperator1 = "-";
		// var year = date.getFullYear();
		// var month = date.getMonth() + 1;
		// var strDate = date.getDate();
		// if (month >= 1 && month <= 9) {
		// 	month = "0" + month;
		// }
		// if (strDate >= 0 && strDate <= 9) {
		// 	strDate = "0" + strDate;
		// }
		// var currentdate = year + seperator1 + month + seperator1 + strDate;
		// return currentdate;
	// }
	
	// 区间天数转换为一个数组
	var weekday=["周日","周一","周二","周三","周四","周五","周六"];
	var dateList = [];
	var todayTimer = graceDate.dateTimeToTimeStamp(startDay + ' 01:01:00');
	for(let i = 0; i < timeRegion; i++){
		var timeStamp = todayTimer + (i * 3600*24);
		var obj = {};
		obj.day = graceDate.formatDateTime(timeStamp, 'str').substring(5, 10);
		var date = new Date();
		date.setTime(timeStamp * 1000);
		obj.week    = weekday[date.getDay()];
		dateList.push(obj);
	}
	export default {
		data() {
			return {
				dateList : dateList,
				currentIndex : 0,
				item: {
					current: 1,
					cycle: 1,
					hospital: '',
					id: null,
					start: "1990-01-01",
					subject: '',
					treatment: '',
					state: 0
				},
			}
		},
		onLoad(e) {
			this.item.current = parseInt(e.current);
			this.item.cycle = parseInt(e.cycle);
			this.item.hospital = e.hospital;
			this.item.id = parseInt(e.id);
			this.item.start = e.start;
			this.item.subject = e.subject;
			this.item.treatment = e.treatment;
			this.item.state = parseInt(e.state);
			console.log(this.item);
		},
		methods: {
			changeDay : function(index){
				let selectedDay = this.dateList[index];
				console.log(selectedDay);
				this.currentIndex = index;
			},
			getP: function(current,cycle){
				let num = (current / cycle) * 100
				return num.toFixed(2)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.questionnaire{
		padding: 0;
		.info{
			width: 100vw; 
			position: relative; 
			background: #fff; 
			overflow: hidden;
			flex-wrap: wrap;
			box-sizing: border-box !important;
			border-bottom: 2upx #ddd solid;
			>.h3{
				color: #444;
				font-size: 36upx;
				text-align: center;
				margin-bottom: 10upx;
				width: 100%;
				display: block;
				line-height: 40upx;
			}
			>.h5{
				color: #999;
				font-size: 24upx;
				text-align: center;
				width: 100%;
				display: block;
				line-height: 40upx;
				margin-bottom: 100upx;
			}
			>.pmain{
				width: 100%;
				text-align: center;
				box-sizing: border-box;
				height: 320upx;
				padding: 100upx 0 20upx;
				>.h1{
					font-size: 188upx;
					line-height: 200upx;
					color: #007AFF;
					font-weight: bold;
				}
				>.h6{
					color: #999;
					font-size: 32upx;
				}
			}
			>.tiper{
				margin: 0;
				display: flex;
				flex-wrap: wrap;
				>view{
					width: calc(50% - 1upx);
					padding: 30upx;
					box-sizing: border-box;
					border-top: 2upx #ddd solid;
					&.line{
						width: 2upx;
						background: #ddd;
						padding: 0;
					}
					>text{
						display: block;
						font-size: 24upx;
						color: #999;
						line-height: 35upx;
						&.h5{
							font-size: 30upx;
							color: #444;
						}
					}
				}
				
			}
		}
		.grace-scroll-x{border-top:2upx solid #ddd; background-color:#F5F6F8;}
		.grace-scroll-x .items{width:210rpx; height:auto; margin:0; padding:12rpx 0; flex-direction:column;border-right: 1upx dashed #ddd}
		.grace-scroll-x .items .date{font-size:32rpx; width:100%; line-height:50rpx; text-align:center; 
			>text{font-size: 22upx;color: #999; margin: 0 5upx;}
		}
		.grace-scroll-x .items .week{font-size:22rpx; width:100%; line-height:36rpx; margin-bottom:10rpx; text-align:center;}
		.grace-scroll-day-active{background:#3688FF; color:#FFFFFF;>text{color: #fff !important;}}
		.grace-list {
			width: 100vw;
			padding: 0 0 0 40upx;
			box-sizing: border-box !important;
			margin: 0;
			>.info{
				margin-left: -40upx;
			}
			.items{
				position:relative; 
				width: 100%;
				border-bottom: 1upx solid #ddd;
				padding: 20upx 40upx 20upx 0;
				flex-wrap: wrap;
				box-sizing: border-box !important;
				>.h5{
					font-size: 30upx;
					color: #444;
					margin-bottom: 20upx;
					line-height: 36upx;
					display: block;
					width: 100%;
					box-sizing: border-box !important;
				}
				>.h6{
					font-size: 28upx;
					color: #999;
					line-height: 32upx;
					display: block;
					width: 100%;
					box-sizing: border-box !important;
				}
			}
		}
		.price{color: #FF9B00; margin:0 10rpx;}
		.ucenter-line{width:100%; height:40upx; background:#F4F5F6; }
		.ucenter-line-text{ box-sizing: border-box !important; display: block; padding: 0 20upx; width:100%; line-height:40upx; background:#F4F5F6; color:#666}
		.button{position:absolute; z-index:1; right:8px; bottom:8px; background:#3688FF; color:#FFFFFF; width:100rpx; height:50rpx; font-size:24rpx; line-height:50rpx; text-align:center; border-radius:50rpx;}
	}
</style>
