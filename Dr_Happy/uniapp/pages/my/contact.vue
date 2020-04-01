<template>
	<view class="my">
		<form @submit="formSubmit" class="grace-form grace-margin-top">
			<view class="grace-items">
				<text class="grace-icons icon-comments icon grace-blue"></text>
				<view class="grace-label">联系方式</view>
				<input v-model="phone" type="text" class="input" name="phone" placeholder="请输入"></input>
			</view>
			
			<view style="padding:22rpx 0;">
				<button formType="submit" type="primary">提交</button>
			</view>
		</form>
		
		<graceDialog title="提示" :show="dialog" v-on:closeDialog="closeDialog">
			<view slot="content">
				<view class="content1" style="padding: 40upx;text-align: center;">确定提交联系方式</view>
			</view>
			<view slot="btns">
				<view class="grace-dialog-btns">
					<view><button type="primary" @tap="closeDialog">取消</button></view>
					<view><button type="primary" style="color:#3688FF;" @tap="postFrom()">确认</button></view>
				</view>
			</view>
		</graceDialog>
	</view>
</template>

<script>
	import graceDialog from '../../graceUI/components/graceDialog.vue';
	var  graceChecker = require("../../graceUI/jsTools/graceChecker.js");
	export default {
		data() {
			return {
				dialog: false,
				phone: this.$store.state.user.info.phone,
			}
		},
		onLoad() {

		},
		methods: {
			closeDialog: function(){
				this.dialog = false;
			},
			formSubmit : function(e){
				//定义表单规则
				var rule = [
					{name:"phone", checkType : "phoneno", errorMsg:"请正确输入手机号码"},
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					this.dialog = true;
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			postFrom: function(){
				let that = this;
				let cookie = wx.getStorageSync('lelejianCookie');//取出Cookie
				let header = { 'Content-Type': 'application/x-www-form-urlencoded'};
				if (cookie) {
				     header.Cookie = cookie;
				};
				uni.request({
					url: 'https://www.lele.fit/api01/user', 
					data: {
						phone: that.phone,
					},
					method: 'POST',
					header: header,
					success: (res) => {
						console.log(res);
						uni.showToast({ title: "提交成功!", icon: "success" });
						that.dialog = false;
					},
					fail: (res) => {
						console.log(res);
						uni.showToast({ title: "提交失败,请重试!", icon: "none" });
					}
				});
			},
		},
		components:{
			graceDialog,
		},
	}
</script>

<style lang="scss" scoped>
	.my{
		padding: 0 40upx;
	}
</style>
