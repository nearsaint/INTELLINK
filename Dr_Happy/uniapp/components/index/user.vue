<template name="userInfo">
	<view class="userInfo">
		<button @click="goto_user()" class="box" hover-class="active"> 
			<image class="avarat" :src="avarat"></image>
			<view class="name">
				<text class="h5">{{name}}</text>
				<text class="h6">个人中心</text>
			</view>
			<text class="iconfont">&#xe856;</text>
		</button>
	</view>
</template>
<script>
	export default {
		data: function(){
			return {
				avarat: '../../static/update/user.jpeg',
				name: '张小津',
			}
		},
		methods: {
			goto_user: function(){
				console.log(1)
			},
		},
	}
</script>
<style lang="scss" scoped>
	.userInfo{
		padding: 20upx;
		>.box{
			border-radius: 10upx;
			background: #fff;
			box-shadow: 0 0 32upx #ccc;
			// height: 120upx;
			// width: 100%;
			overflow: hidden;
			padding: 20upx;
			display: flex;
			flex-wrap: nowrap;
			background: #fff;
			opacity: 0.8;
			&.active{
				opacity: 0.9;
				background: #fefefe;
			}
			>.avarat{
				border-radius: 50%;
				height: 80upx;
				width: 80upx;
				margin-right: 20upx;
			}
			>.name{
					white-space: nowrap;
					text-align: left;
				>.h5{
					font-size: 36upx;
					color: #444;
					line-height: 40upx;
					margin-bottom: 8upx;
					display: block;
				}
				>.h6{
					font-size: 28upx;
					color: #999;
					line-height: 36upx;
					display: block;
				}
			}
			>.iconfont{
				position: absolute;
				color: #999;
				right: 20upx;
				top: 20upx;
				bottom: 20upx;
				line-height: 80upx;
			}
		}
	}
</style>
