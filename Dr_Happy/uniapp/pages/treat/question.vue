<template>
	<view class="my">
		<view class='grace-qn-step'>
			{{currentQN + 1}}<text>/{{qList.length}}</text>
		</view>
		<view class="grace-form">
			<form class="form" @submit="formSubmit">
				<swiper class="grace-qn-swiper" :current="currentQN" @change="swiperChange" style="height: 100%;">
				  <swiper-item v-for="(item, index) in qList" :key="index">
					<view class='grace-qn-in' >
					  <view class='grace-qn-q'>{{item.title}}</view>
					  <view class="grace-items" style="margin:15px 0; border:0;">
						<view class="grace-label-y" v-if="item.type == 1">
						  <radio-group :name="index">
							<label v-for="(option, optionIndex) in item.options" :key="optionIndex" style="margin:15px 0;">
							  <radio :value="option.id" :checked="false"></radio>{{option.option}}
							</label>
						  </radio-group>
						</view>
						<view class="grace-label-y" v-if="item.type == 2">
						  <checkbox-group :name="index">
							<label v-for="(option, optionIndex) in item.options" :key="optionIndex" style="margin:15px 0;">
							  <checkbox :value="option.id" :checked="false"></checkbox>{{option.option}}
							</label>
						  </checkbox-group>
						</view>
						<view class="grace-label-y" v-if="item.type == 3">
							<textarea :name="index" placeholder-style="color:#999" placeholder="请输入"/>
						</view>
					  </view>
					</view>
				  </swiper-item>
				</swiper>
				<view class="grace-footer" v-if="currentQN + 1 < qList.length" @tap="next">
				  下一题
				</view>
				<view class="grace-footer" v-if="currentQN + 1 >= qList.length">
				  <button form-type="submit" type='warn' style="width:100%;">提交</button>
				</view>
			</form>
		</view>
		<graceDialog title="提示" :show="dialog" v-on:closeDialog="closeDialog">
			<view slot="content">
				<view class="content1" style="padding: 40upx;text-align: center;">确定提交此问卷</view>
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
				id: null,
				moduleID: null,
				currentQN : 0, 
				qList: [],
				answerList: [],
			}
		},
		onLoad(e) {
			this.id = e.id;
			this.moduleID = e.moduleID;
		},
		onReady: function(){
			this.getQList();
		},
		components:{
			graceDialog,
		},
		methods: {
			closeDialog: function(){
				this.dialog = false;
			},
			swiperChange : function(e){
				this.currentQN = e.detail.current;
			},
			formSubmit : function(e){
				console.log(e);
				let that = this;
				//检查数据
				var data = e.detail.value;
				var errorIndex = -1;
				for(var k in data){
					if(data[k] == '' || data[k].length < 1){
						console.log('no', data[k]);
						errorIndex = Number(k.substring(6));
						console.log("errorIndex: " + JSON.stringify(errorIndex));
						break;
					}
				}
				if(errorIndex >= 0){
					uni.showToast({title: '请完善选择', icon: "none"});
					that.currentQN = errorIndex;
					return ;
				}
				this.postAnswer(data);
			},
			next : function(){
				this.currentQN++;
			},
			postAnswer: function(e){
				console.log(e);
				let that = this;
				for(let i in e){
					that.answerList[i].answer = e[i];
				}
				console.log(that.answerList);
				this.dialog = true;
			},
			getQList: function(){
				let that = this;
				let cookie = wx.getStorageSync('lelejianCookie');//取出Cookie
				let header = { 'Content-Type': 'application/x-www-form-urlencoded'};
				if (cookie) {
				     header.Cookie = cookie;
				};
				uni.request({
					url: 'https://www.lele.fit/api01/questionnaire',
					data:{
						id: that.id,
						moduleID: that.moduleID,
					},
					method: 'GET',
					header: header,
					success: (res) => {
						console.log(res);
						that.qList = res.data.questions;
						for(let i in that.qList){
							that.answerList.push({
								questionID: that.qList[i].id,
								answer: null,
								type: that.qList[i].type,
							})
						}
						console.log(that.answerList);
					},
					fail: (res) => {
						console.log(res);
						uni.showToast({ title: "加载失败,请重试!", icon: "none" });
					}
				});
			},
			postFrom: function(){
				let that = this;
				console.log(that.answerList);
				let cookie = wx.getStorageSync('lelejianCookie');//取出Cookie
				let header = { 'Content-Type': 'application/json'};
				if (cookie) {
				     header.Cookie = cookie;
				};
				that.dialog = false;
				uni.showLoading({
				    title: '加载中'
				});
				uni.request({
					url: 'https://www.lele.fit/api01/questionnaire', 
					data: {
						id: that.id,
						moduleID: that.moduleID,
						answer: that.answerList,
					},
					method: 'POST',
					header: header,
					success: (res) => {
						console.log(res);
						uni.showToast({ title: "提交成功!", icon: "success" });
						uni.reLaunch({
							url: '../../pages/tabBar/home'
						});
						uni.hideLoading();
					},
					fail: (res) => {
						console.log(res);
						uni.showToast({ title: "提交失败,请重试!", icon: "none" });
						uni.hideLoading();
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.my{
		height: calc(100vh - 100upx);
		.grace-qn-step{line-height:50upx; padding: 40upx 0; text-align:center; font-size:24px; font-style:italic; color:#3688FF;}
		.grace-qn-step text{font-size:24px; color:#555;}
		.grace-form{
			height: calc(100% - 130upx);
			>form{
				height: 100%;
			}
		}
		.grace-label-y{
			width: 100%;
			margin: 0;
			box-sizing: border-box !important;
			display: flex;
			textarea{
				display: block;
				border: 1upx solid #ddd;
				padding: 20upx;
				border-radius: 6upx;
			}
		}
		.grace-qn-swiper{width:750rpx; height: 100% !important;}
		.grace-qn-in{width:90%; margin:0 5%; height:300px;}
		.grace-qn-q{text-align:center; font-weight:700; color:#555; font-size:18px; }
		.grace-footer{background:#3688FF; color:#FFF; font-size:16px; line-height:90upx; text-align:center; justify-content:center;}
	}
</style>
