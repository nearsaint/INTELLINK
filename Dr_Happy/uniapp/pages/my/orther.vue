<template>
	<view class="my">
		<view class="grace-fixed-top top1">
					<view style="margin-top:16rpx;" class="grace-body">
						<graceNav :items="tabs" :currentIndex="swiperCurrentIndex" @change="navChange" fontSize="24rpx" :size="138"></graceNav>
					</view>
				</view>
				<view style="width:750rpx; height:90rpx;"></view>
				<!-- 选项卡 -->
				<view class="grace-tab" style="margin-top:20rpx;">
					<swiper :style="{height:tabHeight+'px'}" :current="swiperCurrentIndex" @change="swiperChange">
						<swiper-item class="grace-order-item" v-for="(swiper, index) in tabs" :key="index">
							<!-- 空数据 -->
							<view style="margin-top:150rpx;" v-if="loadingTypes[index] == 5">
								<graceEmpty text="暂无疗程数据" :iconSize="80" :iconType="4" iconColor="#999999"></graceEmpty>
							</view>
							<!-- 订单列表 -->
							<scroll-view :style="{height:tabHeight+'px'}" scroll-y @scrolltolower="scrollend">
								<view class="grace-order grace-box-shadow" v-for="(order, orderIndex) in orders[index]" :key="orderIndex">
									<view class="grace-space-between grace-flex-center">
										<text class="grace-order-number">进行中</text>
									</view>
									<!-- 以商铺为单位进行循环 -->
									<block>
										<view class="grace-title">
											<text class="title grace-black">ID:37285923</text>
										</view>
										<!-- 循环订单商品 -->
										<view class="grace-order-goods">
											<text class="grace-order-goods-name">磁疗棒(痔疮)</text>
											<view class="grace-order-goods-price"> 疗程阶段II<text class="grace-order-goods-num">32天</text></view>
										</view>
									</block>
									<!-- 订单底部 -->
									<view class="grace-order-footer grace-nowrap">
										<text class="grace-order-number">2019-09-28 16:32:21</text>
										<text class="grace-order-btn grace-order-btn-red">查看详细</text>
									</view>
								</view>
								<!-- 每个选项卡都有一个自己的加载更多  -->
								<graceLoading :loadingType="loadingTypes[index]"></graceLoading>
							</scroll-view>
						</swiper-item>
					</swiper>
				</view>
				<!-- 选项卡 -->
	</view>
</template>

<script>
	import graceNav from "../../graceUI/components/graceNavBar.vue";
	import graceEmpty from '../../graceUI/components/graceEmpty.vue';
	import graceLoading from "../../graceUI/components/graceLoading.vue";
	var systemInfo = require('../../graceUI/jsTools/systemInfo.js');
	var request = require('../../graceUI/jsTools/request.js');
	export default {
		data() {
			return {
				swiperCurrentIndex: 0,
				tabs: [ '全部', '进行中', '已结束', '已失效'],
				tabHeight : 200,
				// 订单数据  订单数组和订单状态数组元素一致
				orders : [[], [], [], [], []],
				// 订单页码
				pages : [1,1,1,1,1],
				// 加载状态
				loadingTypes : [0,0,0,0,0]
			}
		},
		onLoad() {
			var system = systemInfo.info();
			this.tabHeight = system.windowHeight - system.iPhoneXBottomHeightPx - uni.upx2px(110);
			this.getOrders();
		},
		onReady: function(){
			this.getList();
		},
		methods: {
			navChange: function (e) {
				this.swiperCurrentIndex = e;
			},
			swiperChange: function (e) {
				var index = e.detail.current;
				this.swiperCurrentIndex = index;
				// 如果切换时尚未读取数据则读取
				if(this.orders[this.swiperCurrentIndex].length < 1 && this.loadingTypes[this.swiperCurrentIndex] != 5){ this.getOrders(); }
			},
			scrollend : function(){
				// 避免重复加载
				if(this.loadingTypes[this.swiperCurrentIndex] == 1 || this.loadingTypes[this.swiperCurrentIndex] == 2){return ;}
				this.getOrders();
			},
			getOrders : function (){
				console.log('类型 : ' + this.tabs[this.swiperCurrentIndex] + ' 第'+ this.pages[this.swiperCurrentIndex] +'页');
				this.loadingTypes.splice(this.swiperCurrentIndex, 1, 1);
				// this.tabs[this.swiperCurrentIndex] 代表向 api 接口传递订单要求返回的订单状态
				// page 代表第几页
				// 接口地址组合
				var url = "http://grace.hcoder.net/api/index/orders/"+this.tabs[this.swiperCurrentIndex]+'/'+this.pages[this.swiperCurrentIndex];
				request.get(url,{}, res => {
					if(res.status == 'ok'){
						// 第一页
						if(this.pages[this.swiperCurrentIndex] == 1){
							this.orders.splice(this.swiperCurrentIndex, 1 , res.data);
						}
						// 之后的加载页
						else{
							this.orders[this.swiperCurrentIndex] = this.orders[this.swiperCurrentIndex].concat(res.data);
						}
						// 页码增加
						this.pages[this.swiperCurrentIndex]++;
						this.loadingTypes.splice(this.swiperCurrentIndex, 1, 6);
					}else if(res.status == 'empty'){
						console.log('empty');
						this.loadingTypes.splice(this.swiperCurrentIndex, 1, 5);
					}else if(res.status == 'nomore'){
						console.log('nomore');
						this.loadingTypes.splice(this.swiperCurrentIndex, 1, 2);
					}
				});
			},
			getList: function(){
				console.log('getlist')
				let that = this;
				let cookie = wx.getStorageSync('lelejianCookie');//取出Cookie
				let header = { 'Content-Type': 'application/x-www-form-urlencoded'};
				if (cookie) {
				     header.Cookie = cookie;
				};
				uni.request({
					url: 'http://192.168.0.69:5000/api01/user/treatment', 
					method: 'GET',
					header: header,
					success: (res) => {
						that.list = res.data.list;
						console.log(that.list.length);
						that.newIndex = that.list.length;
					},
					fail: (res) => {
						console.log(res);
						uni.showToast({ title: "提交失败,请重试!", icon: "none" });
					}
				});
			},
		},
		components:{graceNav, graceEmpty,graceLoading}
	}
	
</script>

<style lang="scss" scoped>
	.my{
		min-height: 100vh;
		background: #f5f5f5;
		.grace-common-line{background-color: #f5f5f5;}
		.grace-order-item{width:750rpx; height:auto;}
		.grace-order{background-color:#fff; padding:20rpx; margin:0 25rpx; border-radius:10rpx; margin-bottom:50rpx; width:660rpx;}
		.grace-shop{line-height:60rpx; font-size:28rpx; font-weight:bold; color:#333333;}
		.grace-order-goods{font-size:0; overflow:hidden; width:660rpx; display:flex; flex-direction:row; flex-wrap:nowrap; align-items:center; padding-bottom:20rpx;}
		.grace-order-goods-img{width:100rpx; height:100rpx;}
		.grace-order-goods-name{line-height:40rpx; width:100rpx; flex:auto; overflow:hidden; font-size:26rpx; color:#333333;}
		.grace-order-goods-price{font-size:30rpx; line-height:50rpx; color:#333333; padding-left:10rpx; font-weight:bold;}
		.grace-order-goods-num{font-size:22rpx; color:#999999; margin-left:10rpx;}
		.icon-close{font-size:28rpx; color:#999999; margin-left:30rpx;}
		.grace-order-footer{margin-top:2px;}
		.grace-order-number{line-height:50rpx; color:#999999; font-size:26rpx; width:100rpx; flex:auto;}
		.grace-order-status{line-height:50rpx; color:#999999; font-size:26rpx; width:100rpx; flex:auto; text-align:center;}
		.grace-order-btn{display:block; width:150rpx; height:50rpx; line-height:50rpx; color:#999999; font-size:22rpx; text-align:center; border-radius:60rpx; border:1px solid #999999; margin-left:20rpx;}
		.grace-order-btn-red{border-color:#FF0036; color:#FF0036;}
	}
</style>
