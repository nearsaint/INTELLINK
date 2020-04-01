<template name="treatCard">
	<view class="treatCard">
		<swiper class="swiper" 
			previous-margin="100rpx"
			next-margin="100rpx" :current="currentIndex" @change="change" indicator-dots 
			indicator-color="rgba(0, 0, 0, 0.5)" 
			indicator-active-color="#007AFF" >
			<swiper-item class="swiper-item" v-for="(item,index) in list" :key="index">
				<view class="box" :class="[index == currentIndex ? '' : 'opacity']">
					<view class="pmain">
						<template v-if="item.state==0">
							<text class="h2">待审核</text>
							<!-- <text class="h6">%</text> -->
						</template>
						<template v-if="item.state==1">
							<text class="h1">{{getP(item.current,item.cycle)}}</text>
							<text class="h6">%</text>
						</template>
						<template v-if="item.state==2">
							<text class="h2">已拒绝</text>
							<!-- <text class="h6">%</text> -->
						</template>
						<template v-if="item.state==3">
							<text class="h2">已结束</text>
							<!-- <text class="h6">%</text> -->
						</template>
						<template v-if="item.state==4">
							<text class="h2">待开始</text>
							<!-- <text class="h6">%</text> -->
						</template>
					</view>
					<text class="h3">{{item.treatment}}</text>
					<text class="h5">{{item.hospital}}-{{item.subject}}</text>
					<!-- <text class="h5"></text> -->
					<view class="tiper" v-if="item.state==1 || item.state==3">
						 <view>
							 <text class="h5">
								 <template v-if="item.state==0">待审核</template>
								 <template v-if="item.state==1">进行中</template>
								 <template v-if="item.state==2">已拒绝</template>
								 <template v-if="item.state==3">结束</template>
								 <template v-if="item.state==4">待开始</template>
								 </text>
							 <text>状态</text>
						 </view>
						 <view class="line"></view>
						 <view>
							<text class="h5">{{item.current}}</text>
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
					<view class="bt">
						<button :class="[item.state==0||item.state==2?'disabled':'','grean']" v-if="item.state==0||item.state==2||item.state==4" :disabled="item.state==0||item.state==2" :plain="item.state==0||item.state==2"  hover-class="acitve" @click="startTreatment(item)"><text class="iconfont">&#xe85e;</text> <text class="h5">开始治疗</text></button>
						<button class="blue" v-if="item.state==1||item.state==3" hover-class="acitve" @click="goto_questionnaire(item)"><text class="iconfont">&#xe7df;</text> <text class="h5">查看治疗</text></button>
					</view>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<view class="box" :class="[newIndex == currentIndex ? '' : 'opacity']">
					<view class="pmain">
						<text class="h1 grace-gray">NEW</text>
					</view>
					<text class="h3">添加新治疗</text>
					<text class="h5">添加一次新的治疗疗程</text>
					<view class="bt">
						<button hover-class="acitve" @click="goto_add"><text class="iconfont">&#xe88e;</text></button>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>
<script>
	export default {
		data: function(){			
			return {
				currentIndex : 0,
				list: [],
				newIndex: 0,
			}
		},
		onLoad() {
		},
		
		onReady: function(){
			this.getList();
		},
		onShow: function(){
			this.getList();
		},
		methods: {
		    change : function(e){
				this.currentIndex = e.detail.current;
			},
			getList: function(){
				let that = this;
				let cookie = wx.getStorageSync('lelejianCookie');//取出Cookie
				let header = { 'Content-Type': 'application/x-www-form-urlencoded'};
				if (cookie) {
				     header.Cookie = cookie;
				};
				uni.request({
					url: 'https://www.lele.fit/api01/user/treatment',
					data: {
						count: 20,
					},
					method: 'GET',
					header: header,
					success: (res) => {
						console.log(res);
						that.list = res.data.list;
						that.newIndex = that.list.length;
						if(that.list.length>0){
							that.$store.state.user.my.allTreatmentLength = that.list.length;
							let ing = 0;
							let wait = 0;
							let end = 0;
							for(let i in that.list){
								if(that.list[i].state===0){
									wait = wait + 1;
								}else if(that.list[i].state===1){
									ing = ing + 1;
								}else if(that.list[i].state===3){
									end = end + 1;
								}
							}
							that.$store.state.user.my.endTreatment = end;
							that.$store.state.user.my.ingTreatment = ing;
							that.$store.state.user.my.waitTreatment = wait;
						}
					},
					fail: (res) => {
						console.log(res);
						uni.showToast({ title: "获取治疗列表失败,请重试!", icon: "none" });
					}
				});
			},
			getP: function(current,cycle){
				let num = (current / cycle) * 100
				return num.toFixed(2)
			},
			goto_add: function(){
				uni.navigateTo({
					url: '/pages/treat/add' 
				});
			},
			goto_questionnaire: function(e){
				console.log(e)
				uni.navigateTo({
					url: '/pages/treat/questionnaire?current='+e.current+'&cycle='+e.cycle+'&hospital='+e.hospital+'&id='+e.id+'&start='+e.start+'&subject='+e.subject+'&treatment='+e.treatment+'&state='+e.state 
				});
			},
			startTreatment: function(e){
				console.log(e);
				let that = this;
				let cookie = wx.getStorageSync('lelejianCookie');//取出Cookie
				let header = { 'Content-Type': 'application/x-www-form-urlencoded'};
				if (cookie) {
				     header.Cookie = cookie;
				};
				uni.request({
					url: 'https://www.lele.fit/api01/questionnaire',
					data: {
						mappqnid: e.id,
					},
					method: 'PUT',
					header: header,
					success: (res) => {
						console.log(res);
						uni.showToast({ title: "提交成功!", icon: "none" });
						that.getList();
					},
					fail: (res) => {
						console.log(res);
						uni.showToast({ title: "提交失败,请重试!", icon: "none" });
					}
				});
			},
		},
	}
</script>
<style scoped lang="scss">
	.swiper{
		height: 960upx;
		justify-content: center;
		padding-top: 40upx;
		.swiper-item{
			padding: 20upx 0;
			overflow: hidden;
			flex-wrap: wrap;
		}
		.box{
			width: calc(100% - 40upx); 
			height: 860upx; 
			margin: 0 20upx;
			position: relative; 
			background: #fff; 
			overflow: hidden;
			flex-wrap: wrap;
			border-radius: 20upx;
			box-shadow: 0 0 16upx #ccc;
			transition: all 0.3s;
			box-sizing: border-box !important;
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
				>.h2{
					font-size: 91upx;
					line-height: 200upx;
					color: #999;
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
			>.bt{
				margin: 0 -40upx;
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 100upx;
				display: flex;
				flex-wrap: wrap;
				transition: height 0.3s;
				>button{
					height: 100upx;
					line-height: 100upx;
					width: 100%;
					font-size: 42upx;
					outline: none;
					border: none;
					border-radius: 0;
					background: #007AFF;
					color: #fff;
					opacity: 0.8;
					&.acitve{
						opacity: 0.9;
					}
					&.disabled{
						opacity: 0.41;
					}
					&.grean{
						background: #19be6b !important;
					}
					&:after{
						border: none;
					}
					>.h5{
						font-size: 32upx;
						line-height: 100upx;
						margin-left: 10upx;
					}
				}
			}
		}
	}
	.opacity{
		opacity:0.5; 
		box-shadow: none !important;
		height: 760upx !important;
		margin: 40upx 20upx !important;
		>.bt{
			height: 0 !important;
		}
	}
</style>
