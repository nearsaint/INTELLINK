<template>
	<view class="my">
		<view class="title">
			<view class="bg"></view>
			<view class="user">
				<image class="avarat" :src="avarat"></image>
				<view class="text">
					<text class="name">{{nickName}}</text>
					<text class="id">ID:{{userid}}</text>
				</view>
				<button class="iconfont" hover-class="hover">&#xe83e;</button>
			</view>
		</view>
		<!-- <view class="list ul">
			<button class="li" hover-class="hover">
				<text class="iconfont tip">&#xe814;</text>
				<text class="text">报表</text>
				<text class="iconfont front">&#xe856;</text>
			</button>
			<button class="li" hover-class="hover">
				<text class="iconfont tip">&#xe7f0;</text>
				<text class="text">授权</text>
				<text class="iconfont front">&#xe856;</text>
			</button>
			<button class="li" hover-class="hover">
				<text class="iconfont tip">&#xe834;</text>
				<text class="text">我的角色</text>
				<text class="iconfont front">&#xe856;</text>
			</button>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickName: this.$store.state.user.nickName,
				userid: this.$store.state.user.userid,
				avarat: this.$store.state.user.avatarUrl
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

		}
	}
</script>

<style lang="scss">
	.title{
		display: flex;
		width: 100%;
		>.bg{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			background: #0355e5;
			display: flex;
			flex-wrap: wrap;
			height: 160upx;
			width: 100%;
			z-index: 1;
		}
		>.user{
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			width: 100%;
			position: relative;
			z-index: 2;
			padding: 20upx;
			>.avarat{
				display: block;
				width: 120upx;
				height: 120upx;
				border-radius: 50%;
				border: 1upx solid #ddd;
			}
			>.text{
				display: flex;
				flex-wrap: wrap;
				padding: 0 20upx;
				>.name{
					display: block;
					width: 100%;
					color: #fff;
					font-size: 42upx;
				}
				>.id{
					display: block;
					width: 100%;
					color: #fff;
					font-size: 28upx;
				}
			}
			>.iconfont{
				position: absolute;
				top: 50%;
				right: 20upx;
				transform: translateY(-50%);
				color: #fff;
				border: none;
				outline: none;
				background: none;
				font-size: 52upx;
				&::after{
					border: none;
				}
				&.hover{
					color: #ccc;
				}
			}
		}
	}
	.ul{
		margin-top: 20upx;
		border-top: 1upx solid #ddd;
		>.li{
			background: none;
			border-bottom: 1upx solid #ddd;
			position: relative;
			width: 100%;
			display: flex;
			border-radius: 0;
			font-size: 32upx;
			color: #444;
			padding-left: 100upx;
			line-height: 88upx;
			&.hover{
				background: #f9f9f9;
			}
			&::after{
				border: none;
			}
			>.tip{
				position: absolute;
				top: 0;
				left: 20upx;
				height: 88upx;
				width: 88upx;
				font-size: 42upx;
				line-height: 88upx;
			}
			>.front{
				position: absolute;
				top: 50%;
				right: 20upx;
				transform: translateY(-50%);
				font-size: 28upx;
				color: #999;
			}
		}
	}
</style>
