<template>
	<view class="my">
		<form @submit="formSubmit" class="grace-form grace-margin-top">
			<view class="grace-title grace-margin-top">选择所在医院和医生,治疗项目</view>
			<view class="grace-items">
				<view class="grace-label">医院</view>
				<view class="other">
					<picker name="hospital" @change="hospitalChange" :value="hospitalIndex" :range="hospitals">
						<text>{{hospitals[hospitalIndex]}}</text>
					</picker>
				</view>
			</view>
			<view class="grace-items" v-if="subjectShow">
				<view class="grace-label">科室</view>
				<view class="other">
					<picker name="subject" @change="subjectChange" :value="subjectIndex" :range="subjects">
						<text>{{subjects[subjectIndex]}}</text>
					</picker>
				</view>
			</view>
			<view class="grace-items" v-if="doctorShow">
				<view class="grace-label">医生</view>
				<view class="other">
					<picker name="doctor" @change="doctorChange" :value="doctorIndex" :range="doctors">
						<text>{{doctors[doctorIndex]}}</text>
					</picker>
				</view>
			</view>
			<view class="grace-items" v-if="treatmentShow">
				<view class="grace-label">治疗</view>
				<view class="other">
					<picker name="treatment" @change="treatmentChange" :value="treatmentIndex" :range="treatments">
						<text>{{treatments[treatmentIndex]}}</text>
					</picker>
				</view>
			</view>
			<view class="ucenter-line"></view>
			<view class="grace-title grace-margin-top">填写治疗时资料</view>
			<view class="grace-items">
				<view class="grace-label">身高(cm)</view>
				<graceNumberBox :value="height" minNum="100" maxNum="200" @change="heightChange"></graceNumberBox>
			</view>
			<view class="grace-items">
				<view class="grace-label">体重(kg)</view>
				<graceNumberBox :value="weight" minNum="50" maxNum="400" @change="weightChange"></graceNumberBox>
			</view>
			<view class="grace-items">
				<view class="grace-label">饮酒史</view>
				<view class="other">
					<picker @change="drinkingChange" :value="drinking" :range="gender" name="gender">
						<text>{{gender[drinking]}}</text>
					</picker>
				</view>
			</view>
			<view class="grace-items">
				<view class="grace-label">吸烟史</view>
				<view class="other">
					<picker @change="smokingChange" :value="smoking" :range="gender" name="gender">
						<text>{{gender[smoking]}}</text>
					</picker>
				</view>
			</view>
			
			<!-- <view class="grace-items">
				<view class="grace-label">手术史</view>
				<view class="other">
					<picker @change="bindPickerChange" :value="surgery" :range="gender" name="gender">
						<text>{{gender[surgery]}}</text>
					</picker>
				</view>
			</view> -->
			
			<view style="padding:22rpx 0;">
				<button formType="submit" type="primary">提交</button>
			</view>
		</form>
		
		<graceDialog title="提示" :show="dialog" v-on:closeDialog="closeDialog">
			<view slot="content">
				<view class="content1" style="padding: 40upx;text-align: center;">确定提交治疗申请</view>
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
	var  graceChecker = require("../../graceUI/jsTools/graceChecker.js");
	import graceDialog from '../../graceUI/components/graceDialog.vue';
	import graceNumberBox from "../../graceUI/components/graceNumberBox.vue";
	export default {
		data() {
			return {
				userinfo: this.$store.state.user.userinfo,
				gender: ['否','是'],
				smoking: 0,
				drinking: 0,
				hospitalIndex: 0,
				hospital: null,
				hospitals: ['请选择'],
				subjectShow: false,
				subject: null,
				subjectIndex: 0,
				subjects: ['请选择'],
				treatmentShow: false,
				treatment: null,
				treatmentIndex: 0,
				treatments: ['请选择'],
				doctorShow: false,
				doctor: null,
				doctorIndex: 0,
				doctors: ['请选择'],
				height: 150,
				weight: 100,
				dialog: false,
			}
		},
		onLoad() {
			this.getHospitals();
		},
		components:{
			graceDialog,
			graceNumberBox
		},
		methods: {
			getHospitals: function(){
				let h = this.$store.state.uitl.hospitals;
				console.log(h);
				this.hospitals = ['请选择'];
				for(let i in h){
					this.hospitals.push(h[i].name);
				}
			},
			hospitalChange: function(e){
				this.hospitalIndex = e.detail.value;
				this.subjects = ['请选择'];
				this.subject = null;
				this.subjectIndex = 0;
				this.subjectShow = false,
				this.doctors = ['请选择'];
				this.doctor = null;
				this.doctorShow = false,
				this.doctorIndex = 0;
				this.treatments = ['请选择'];
				this.treatmentShow = false,
				this.treatment = null;
				this.treatmentIndex = 0;
				if(this.hospitalIndex > 0){
					this.hospital = this.$store.state.uitl.hospitals[this.hospitalIndex-1].id;
					let s = this.$store.state.uitl.hospitals[this.hospitalIndex-1].subjects;
					for(let i in s){
						this.subjects.push(s[i].name)
					}
					this.subjectShow = true;
				}
			},
			subjectChange: function(e){
				this.subjectIndex = e.detail.value;
				this.doctors = ['请选择'];
				this.doctor = null;
				this.doctorShow = false,
				this.doctorIndex = 0;
				this.treatments = ['请选择'];
				this.treatmentShow = false,
				this.treatment = null;
				this.treatmentIndex = 0;
				if(this.subjectIndex>0){
					this.subject = this.$store.state.uitl.hospitals[this.hospitalIndex-1].subjects[this.subjectIndex-1].id;
					let d = this.$store.state.uitl.hospitals[this.hospitalIndex-1].subjects[this.subjectIndex-1].doctors;
					for(let i in d){
						this.doctors.push(d[i].name)
					}
					this.doctorShow = true;
				}
				
			},
			doctorChange: function(e){
				this.doctorIndex = e.detail.value;
				this.treatmentShow = false,
				this.treatment = null;
				this.treatmentIndex = 0;
				if(this.doctorIndex>0){
					this.doctor = this.$store.state.uitl.hospitals[this.hospitalIndex-1].subjects[this.subjectIndex-1].doctors[this.doctorIndex-1].id;
					this.getTreatments();
					this.treatmentShow = true;
				}
			},
			getTreatments: function(){
				let t = this.$store.state.uitl.treatments;
				console.log(t);
				this.treatments = ['请选择'];
				this.treatmentShow = false,
				this.treatment = null;
				this.treatmentIndex = 0;
				for(let i in t){
					this.treatments.push(t[i].name);
				}
			},
			treatmentChange: function(e){
				this.treatmentIndex = e.detail.value;
				this.treatment = this.$store.state.uitl.treatments[this.treatmentIndex-1].id;
			},
			heightChange: function(e){
				this.height = e[0];
			},
			weightChange: function(e){
				this.weight = e[0];
			},
			drinkingChange: function(e){
				this.drinking = e.detail.value;
			},
			smokingChange: function(e){
				this.smoking = e.detail.value;
			},
			formSubmit : function(e){
				//定义表单规则
				var rule = [
					{name:"hospital", checkType : "notnull", errorMsg:"请选择就诊医院"},
					{name:"subject", checkType : "notnull", errorMsg:"请选择就诊科室"},
					{name:"doctor", checkType : "notnull", errorMsg:"请选择就诊医生"},
					{name:"treatment", checkType : "notnull", errorMsg:"请选择治疗项目"},
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					this.dialog = true;
					console.log(this.weight);
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			closeDialog: function(){
				this.dialog = false;
			},
			postFrom: function(){
				let that = this;
				let cookie = wx.getStorageSync('lelejianCookie');//取出Cookie
				let header = { 'Content-Type': 'application/x-www-form-urlencoded'};
				if (cookie) {
				     header.Cookie = cookie;
				};
				uni.request({
					url: 'https://www.lele.fit/api01/user/treatment', 
					data: {
						hospitalID: that.hospital,
						subjectID: that.subject,
						treatmentID: that.treatment,
						doctorID: that.doctor,
						height: that.height,
						weight: that.weight,
						drinking: that.drinking,
						smoking: that.smoking,
						avatarUrl: that.userinfo.avatarUrl,
					},
					method: 'POST',
					header: header,
					success: (res) => {
						console.log(res);
						if(res.data.code ==200){
							uni.showToast({ title: "提交成功,等待验证!", icon: "success" });
							that.dialog = false;
							uni.reLaunch({
								url: '/pages/tabBar/home'
							});
						}else if(res.data.code ==207){
							uni.showToast({ title: "已有此治疗!", icon: "none" });
							that.dialog = false;
						}else{
							uni.showToast({ title: "提交有误,请重试!", icon: "none" });
							that.dialog = false;
						}
					},
					fail: (res) => {
						uni.showToast({ title: "提交失败,请重试!", icon: "none" });
						console.log(res);
					}
				});
			},
		},
	}
</script>

<style lang="scss" scoped>
	.my{
		padding: 0 40upx;
	}
	.ucenter-line{
		margin: 40upx 0;
	}
</style>
