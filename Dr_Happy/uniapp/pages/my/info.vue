<template>
	<view class="my">
		<form @submit="formSubmit" class="grace-form grace-margin-top">
			<view class="grace-items">
				<view class="grace-label">真实姓名</view>
				<input v-model="name" type="text" class="input" name="name" placeholder="请输入" :disabled="!newUser"></input>
			</view>
			<view class="grace-items">
				<view class="grace-label">性别</view>
				<view class="grace-label-y">
					<radio-group  v-model="sex" name="sex" @change="radioChange">
						<label><radio value="1" :disabled="!newUser" :checked="sex===1"></radio>男</label>
						<label><radio value="2" :disabled="!newUser" :checked="sex===2"></radio>女</label>
					</radio-group>
				</view>
			</view>
			<view class="grace-items">
				<view class="grace-label">生日</view>
				<picker @change="bindDateChange" :value="dateValue" mode="date" name="bd" start="1900-01-01" end="2019-01-01"  :disabled="!newUser">
					<text>{{dateValue == null ? '请选择' : dateValue}}</text>
				</picker>
			</view>
			<view class="grace-items">
				<view class="grace-label">民族</view>
				<input v-model="people" type="text" class="input" name="people" placeholder="请输入"  :disabled="!newUser"></input>
			</view>
			<view class="grace-items" v-if="newUser">
				<!-- <text class="grace-icons icon-comments icon grace-blue"></text> -->
				<view class="grace-label">联系方式</view>
				<input v-model="phone" type="text" class="input" name="phone" placeholder="请输入" :disabled="!newUser"></input>
			</view>
			<view style="padding:22rpx 0;" v-if="newUser">
				<button formType="submit" type="primary">提交</button>
			</view>
		</form>
		<graceDialog title="提示" :show="dialog" v-on:closeDialog="closeDialog">
			<view slot="content">
				<view class="content1" style="padding: 40upx;text-align: center;">基础信息提交后不能修改,是否确定提交</view>
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
				dateValue : this.$store.state.user.info.birthday,
				disable: true,
				newUser: false,
				name:  this.$store.state.user.info.name,
				sex:  this.$store.state.user.info.sex,
				people:  this.$store.state.user.info.nation,
				dialog: false,
				toFocus: false,
				phone: this.$store.state.user.info.phone,
			}
		},
		onLoad(e) {
			if(e.newUser){
				this.newUser = e.newUser;
			}
			if(e.toFocus){
				this.toFocus = e.toFocus;
			}
		},
		methods: {
			bindDateChange : function(e){
				this.dateValue = e.detail.value;
			},
			radioChange: function(e) {
				this.sex = e.detail.value;
			},
			closeDialog: function(){
				this.dialog = false;
			},
			formSubmit : function(e){
				//定义表单规则
				var rule = [
					{name:"name", checkType : "string", checkRule:"1,3",  errorMsg:"姓名应为1-3个字符"},
					{name:"sex", checkType : "in", checkRule:"1,2",  errorMsg:"请选择性别"},
					{name:"bd", checkType : "notsame", checkRule:"请选择",  errorMsg:"请选择生日"},
					{name:"people", checkType : "notnull", checkRule:"",  errorMsg:"请选择民族"},
					{name:"phone", checkType : "phoneno", checkRule:"",  errorMsg:"请正确填写手机号码"},
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
						name: that.name,
						sex: that.sex,
						birthday: that.dateValue,
						nation: that.people,
					},
					method: 'POST',
					header: header,
					success: (res) => {
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
								uni.switchTab({
									url: '../../pages/tabBar/home'
								});
							},
							fail: (res) => {
								console.log(res);
								uni.showToast({ title: "提交基础信息失败,请重试!", icon: "none" });
								that.dialog = false;
							}
						});
						// console.log(res);
						// uni.showToast({ title: "提交成功!", icon: "success" });
						// that.dialog = false;
						// uni.switchTab({
						// 	url: '../../pages/tabBar/home'
						// });
					},
					fail: (res) => {
						console.log(res);
						uni.showToast({ title: "提交基础信息失败,请重试!", icon: "none" });
						that.dialog = false;
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
	.grace-label-y{
		text-align: right;
	}
</style>
