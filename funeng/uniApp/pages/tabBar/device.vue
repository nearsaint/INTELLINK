<template>
	<view class="device">
		<view class="search">
			<view class="input">
				<text class="iconfont">&#xe9a2;</text>
				<button class="clearsearch" v-show="inhaul.searching" @click="clearSearch">清除</button>
				<input class="input" type="text" confirm-type="search" @input="searching" v-model="inhaul.search" placeholder="搜索您要找的设备">
			</view>
			<picker class="picker" @change="chooseInhaul" :value="inhaul.active" :range="inhaul.range">
				<view class="uni-input">
					<text class="iconfont">&#xe7b0;</text>
				</view>
			</picker>
		</view>
		<!-- end search -->
		<view class="list">
			<view class="group" v-for="(item, index) in iot.group" :key="index">
				<button class="title" @click="openItem(index)">
					<text v-if="!item.GroupStatus.open" class="close iconfont" hover-class="hover">&#xe89c;</text>
					<text v-if="item.GroupStatus.open" class="open iconfont" hover-class="hover">&#xe8a0;</text>
					<!-- <view class="dot"></view> -->
					<text class="name">{{item.GroupName}}</text>
					<view class="teams">
						<view class="parend">
							<text class="all">设备数 {{item.GroupStatus.all}} 台</text>
							<text class="tip running" v-show="item.GroupStatus.running > 0">{{item.GroupStatus.running}}台运行</text>
							<text class="tip standby" v-show="item.GroupStatus.standby > 0">{{item.GroupStatus.standby}}台就绪</text>
							<text class="tip stop" v-show="item.GroupStatus.stop > 0">{{item.GroupStatus.stop}}台停机</text>
							<text class="tip warning" v-show="item.GroupStatus.warn > 0">{{item.GroupStatus.warn}}台警告</text>
							<text class="tip alarm" v-show="item.GroupStatus.alarm > 0">{{item.GroupStatus.alarm}}台错误</text>
							<text class="tip off" v-show="item.GroupStatus.off > 0">{{item.GroupStatus.off}}台离线</text>
							<!-- <text class="tip success">{{item.GroupStatus.running}}台运行</text>
							<text class="tip standby">{{item.GroupStatus.standby}}台就绪</text>
							<text class="tip stop">{{item.GroupStatus.stop}}台停机</text>
							<text class="tip warning">{{item.GroupStatus.warn}}台警告</text>
							<text class="tip alarm">{{item.GroupStatus.alarm}}台错误</text>
							<text class="tip off">{{item.GroupStatus.off}}台离线</text> -->
						</view>
					</view>
				</button>
				<view class="content ul fadeIn animated" v-if="item.GroupStatus.open" >
					<button v-for="(machine, index_machine) in item.Machine" :key="index_machine" class="li" hover-class="hover" @click="gotoDevice(machine)">
						<view class="image">
							<view v-if="machine.Status==0" class="i running"></view>
							<view v-if="machine.Status==1" class="i stop "></view>
							<view v-if="machine.Status==2" class="i off"></view>
							<view v-if="machine.Status==3" class="i standby"></view>
							<view v-if="machine.Status==4" class="i alarm"></view>
							<view v-if="machine.Status==5" class="i warning"></view>
							<!-- <image class="img" src="/static/logo.png"></image> -->
						</view>
						<view class="text">
							<text class="name">{{machine.MachineName}}</text>
							<text class="status">状态: 
								<template v-if="machine.Status==0">运行</template>
								<template v-if="machine.Status==1">停止</template>
								<template v-if="machine.Status==2">离线</template>
								<template v-if="machine.Status==3">就绪</template>
								<template v-if="machine.Status==4">错误</template>
								<template v-if="machine.Status==5">警告</template>
							</text>
						</view>
						<text class="iconfont">&#xe856;</text>
					</button>
				</view>
			</view>
		</view>
		<!-- end .list -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				iot: {
					list: [],
					group: [],
				},
				GroupStatus: {
					open: true,
					all: 0,
					running: 0,
					stop: 0,
					off: 0,
					standby: 0,
					warn: 0,
					alarm: 0,
				},
				inhaul: {
					range: ['区域分类','设备类型分类','工厂分类','数采单元分类'],
					active: 0,
					search: '',
					searching: false,
				},
			}
		},
		onLoad: function(){
			this.getPageInfo();
			this.getStatus();
		},
		onReady: function(){},
		onShow: function(){},
		onHide: function(){},
		onUnload: function(){},
		updated: function(){},
		beforeUpdate: function(){
		},
		//下拉动作
		onPullDownRefresh: function(){
			let that = this;
			setTimeout(function(){
				uni.stopPullDownRefresh();
				that.getStatus();
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
		onPageScroll: function(e){},
		
		methods: {
			
			gotoDevice: function(e){
				// console.log(e);
				uni.navigateTo({
					url: '../device/deviceList?machineId='+ e.MachineId + '&machineName=' + e.MachineName 
				});
			},
			getPageInfo: function(){
				let that = this;
				that.iot.list = that.$store.state.IOT.data.Machines;
				console.log(that.iot.list);
				if(that.inhaul.active==0){
					that.getList_Area();
				}
				else if(that.inhaul.active==1){
					that.getList_machineType();
				}
				else if(that.inhaul.active==2){
					that.getList_Mill();
				}
				else if(that.inhaul.active==3){
					that.getList_DTU();
				}
			},
			getStatus: function(){
				let that = this;
				wx.request({
					url: 'https://38798879.xyz/api/Machine/GetRTStatus', 
					data: {},
					method: 'GET',
					success: (res) => {
						console.log(res);
						console.log(that.$store.state.IOT.data.Machines);
						for(let i in res.data){
							for(let n in that.$store.state.IOT.data.Machines){
								if(res.data[i].MachineId == that.$store.state.IOT.data.Machines[n].MachineId){
									that.$store.state.IOT.data.Machines[n].Status = res.data[i].MachineStatus;
									console.log(that.$store.state.IOT.data.Machines[n].Status);
								}
							}
						}
						that.getPageInfo();
					},
					fail: (res) => {
						console.log(res);
					}
				});
			},
			getList_Mill: function(){
				let that = this;
				let list = that.iot.list;
				let array = [];
				for(let i in list){
					let flag = 1;
					for (let j in array) {
						if(array[j].MillId == list[i].MillId) {
							flag = 0;
							break;
						}
					}
					if (flag == 1){
						array.push({
							MillId: list[i].MillId,
							MillName: list[i].MillName,
							GroupName: list[i].MillName,
							Machine: [],
							GroupStatus: {
								open: true,
								all: 0,
								running: 0,
								stop: 0,
								off: 0,
								standby: 0,
								warn: 0,
								alarm: 0,
							},
						});
					}
				}
				for(let i in list){
					for(let n in array){
						if(list[i].MillId == array[n].MillId){
							array[n].Machine.push(list[i]);
						}
					}
				}
				that.iot.group = array;
				that.getStatus_group();
				console.log(that.iot.group);
			},
			getList_Area: function(){
				let that = this;
				let list = that.iot.list;
				console.log(that.iot.list);
				let array = [];
				for(let i in list){
					let flag = 1;
					for (let j in array) {
						if(array[j].AreaId == list[i].AreaId) {
							flag = 0;
							break;
						}
					}
					if (flag == 1){
						array.push({
							AreaId: list[i].AreaId,
							AreaName: list[i].AreaName,
							GroupName: list[i].AreaName,
							Machine: [],
							GroupStatus: {
								open: true,
								all: 0,
								running: 0,
								stop: 0,
								off: 0,
								standby: 0,
								warn: 0,
								alarm: 0,
							},
						});
					}
				}
				for(let i in list){
					for(let n in array){
						if(list[i].AreaId == array[n].AreaId){
							array[n].Machine.push(list[i]);
						}
					}
				}
				that.iot.group = array;
				that.getStatus_group();
				console.log(that.iot.group);
			},
			getList_DTU: function(){
				let that = this;
				let list = that.iot.list;
				let array = [];
				for(let i in list){
					let flag = 1;
					for (let j in array) {
						if(array[j].DTUId == list[i].DTUId) {
							flag = 0;
							break;
						}
					}
					if (flag == 1){
						array.push({
							DTUId: list[i].DTUId,
							DTUName: list[i].DTUName,
							GroupName: list[i].DTUName,
							Machine: [],
							GroupStatus: {
								open: true,
								all: 0,
								running: 0,
								stop: 0,
								off: 0,
								standby: 0,
								warn: 0,
								alarm: 0,
							},
						});
					}
				}
				for(let i in list){
					for(let n in array){
						if(list[i].DTUId == array[n].DTUId){
							array[n].Machine.push(list[i]);
						}
					}
				}
				that.iot.group = array;
				that.getStatus_group();
				console.log(that.iot.group);
			},
			getList_machineType: function(){
				let that = this;
				let list = that.iot.list;
				// console.log(list);
				let array = [];
				for(let i in list){
					let flag = 1;
					// console.log(list[i].MachineTypeId);
					for (let j in array) {
						if(array[j].MachineTypeId == list[i].MachineTypeId) {
							flag = 0;
							break;
						}
					}
					if (flag == 1){
						array.push({
							MachineTypeId: list[i].MachineTypeId,
							MachineTypeName: list[i].MachineTypeName,
							GroupName: list[i].MachineTypeName,
							Machine: [],
							GroupStatus: {
								open: true,
								all: 0,
								running: 0,
								stop: 0,
								off: 0,
								standby: 0,
								warn: 0,
								alarm: 0,
							},
						});
					}
				}
				for(let i in list){
					for(let n in array){
						if(list[i].MachineTypeId == array[n].MachineTypeId){
							array[n].Machine.push(list[i]);
						}
					}
				}
				that.iot.group = array;
				that.getStatus_group();
			},
			
			getStatus_group: function(){
				let that = this;
				for(let n in that.iot.group){
					let array = that.iot.group[n].Machine;
					let running = 0, stop = 0, off = 0, standby = 0, warn = 0, alarm = 0;
					for(let i in array){
						if(array[i].Status == 0){
							running = running + 1;
						}else if(array[i].Status == 1){
							stop = stop + 1
						}else if(array[i].Status == 2){
							off = off + 1
						}else if(array[i].Status == 3){
							standby = standby + 1
						}else if(array[i].Status == 4){
							alarm = alarm + 1
						}else if(array[i].Status == 5){
							warn = warn + 1
						}
					}
					that.iot.group[n].GroupStatus.all = running + stop+ off+standby+alarm+warn;
					that.iot.group[n].GroupStatus.running = running;
					that.iot.group[n].GroupStatus.stop = stop;
					that.iot.group[n].GroupStatus.off = off;
					that.iot.group[n].GroupStatus.standby = standby;
					that.iot.group[n].GroupStatus.alarm = alarm;
					that.iot.group[n].GroupStatus.warn = warn;
				}
				
			},
			
			chooseInhaul: function(e){
				this.iot.group = [];
				console.log(e);
				this.inhaul.active = parseInt(e.detail.value);
				console.log(this.inhaul.active);
				if(this.inhaul.active == 0){
					this.getList_Area();
				}else if(this.inhaul.active == 1){
					this.getList_machineType()
				}else if(this.inhaul.active == 2){
					this.getList_Mill()
				}else if(this.inhaul.active == 3){
					this.getList_DTU()
				}
			},
			openItem: function(index){
				if(this.iot.group[index].GroupStatus.open){
					this.iot.group[index].GroupStatus.open=false;
				}
				else{
					this.iot.group[index].GroupStatus.open=true;
				}
			},
			searching: function(){
				let that = this;
				let list = that.iot.list;
				if(that.inhaul.search==''){
					that.inhaul.searching = false;
					that.getList_machineType();
				}else{
					let array = [];
					that.inhaul.searching = true;
					let keyWord = that.inhaul.search;
					array.push({
						GroupName: '查询关键字:' + keyWord,
						Machine: [],
						GroupStatus: {
							open: true,
							all: 0,
							running: 0,
							stop: 0,
							off: 0,
							standby: 0,
							warn: 0,
							alarm: 0,
						},
					});
					for(let i in list){
						if(list[i].MachineName.indexOf(keyWord) >= 0){
							array[0].Machine.push(list[i]);
						}
					}
					that.iot.group = array;
					that.getStatus_group();
				}
			},
			clearSearch: function(){
				this.inhaul.search= '';
				this.inhaul.searching= false;
				this.getList_machineType();
			},
		},
	}
</script>

<style lang="scss">
	.search{
		height: 100upx;
		display: flex;
		width: 100%;
		background: #f5f5f5;
		box-sizing: border-box;
		padding: 14upx 10upx 14upx 20upx;
		border-bottom: 1upx solid #ddd;
		> .input{
			display: flex;
			justify-content: space-between;
			flex-wrap: nowrap;
			background: #fff;
			border: 1upx solid #ddd;
			border-radius: 50upx;
			width: calc(100% - 82upx);
			height: 72upx;
			position: relative;
			>.iconfont{
				position: absolute;
				top: 0;
				left: 10upx;
				height: 72upx;
				width: 72upx;
				line-height: 72upx;
				font-size: 42upx;
				text-align: center;
				color: #ccc;
			}
			>.input{
				padding: 10upx 10upx 10upx 94upx;
				font-size: 32upx;
				line-height: 52upx;
				height: 52upx;
			}
		}
	}
	.inhaul,{
		border: none;
		background: none;
		outline: none;
		>.iconfont{
			line-height: 72upx;
			height: 72upx;
			width: 72upx;
			text-align: center;
			display: block;
			font-size: 48upx;
			color: #999;
			border-radius: 50%;	
		}
		
		&.hover{
			>.iconfont{
				color: #ccc;	
			}
		}
		&::after{
			border:none;
		}
	}
	.clearsearch{
		font-size: 26upx;
		padding: 0 20upx;
		border-radius: 50upx;
		background: #535353;
		color: #fff;
		display: inline-block;
		position: absolute;
		right: 10upx;
		top: 10upx;
		height: 52upx;
		line-height: 52upx;
		&::after{
			border: none;
		}
	}
	.picker{
		.iconfont{
			line-height: 72upx;
			height: 72upx;
			width: 72upx;
			text-align: center;
			display: block;
			font-size: 48upx;
			color: #999;
			border-radius: 50%;	
		}
	}
	.list{
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		padding: 20upx 0;
		box-sizing: border-box;
		>.group{
			background: #f5f5f5;
			width: 100%;
			border: 1upx solid #ddd;
			overflow: hidden;
			margin-bottom: 20upx;
			display: flex;
			flex-wrap: wrap;
			>.title{
				padding:  10upx 0upx 10upx 20upx;
				color: #999;
				border-bottom: 1upx solid #eee;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				text-align: left;
				width: 100%;
				position: relative;
				font-size: 26upx;
				background: none;
				&::after{
					border: none;
				}
				>.iconfont{
					display: block;
					border: none;
					outline: none;
					font-size: 36upx;
					color: #999;
					position: absolute;
					right: 10upx;
					top: 10upx;
					height: 62upx;
					width: 62upx;
					line-height: 62upx;
					background: none;
					&::after{
						border: none;
					}
					&.hover{
						color: #ccc;
					}
				}
				
				>.name{
					width: 100%;
					line-height: 62upx;
					font-size: 32upx;
					font-weight: bold;
					color: #666;
				}
				>.teams{
					width: 100%;
					display: flex;
					flex-wrap: wrap;
					line-height: 32upx;
					>.parend,
					>.child{
						display: flex;
						justify-content: flex-start;
						flex-wrap: wrap;
						width: 100%;
						margin-top: 10upx;
						padding-top: 10upx;
						border-top: 1upx solid #ddd;
						>.all{
							width: 100%;
							margin-bottom: 5upx;
						}
						>.tip{
							border-radius: 50upx;
							background: #ccc;
							padding: 3upx 11upx;
							font-size: 24upx;
							color: #fff;
							margin-right: 10upx;
							margin-bottom: 5upx;
							line-height: 32upx;
							&.running{
								background: #09BB07;
							}
							&.standby{
								background: #00b7ee;
							}
							&.stop{
								background: #666;
							}
							&.off{
								background: #ccc;
							}
							&.warning{
								background: #FFB400;
							}
							&.alarm{
								background: #cd0615;
							}
						}
					}
				}
			}
			>.ul{
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;
				overflow: hidden;
			
				>.li{
					border: none;
					outline: none;
					background: #fff;
					border-radius: 0;
					display: flex;
					width: 100%;
					height: 120upx;
					justify-content: flex-start;
					margin: 0;
					padding: 20upx;
					position: relative;
					border-bottom: 1upx solid #ddd;
					transition: background 0.3s;
					&::after{
						border: none;
					}
					&:last-child{
						border-bottom: none;
					}
					&.hover{
						background: #f9f9f9;
						>.iconfont{
							right: 10upx;
							color: #666;
						}
					}
					>.image{
						width: 20upx;
						height: 120upx;
						position: relative;
						padding: 0 10upx;
						display: flex;
						>.i{
							position: absolute;
							display: block;
							height: 16upx;
							width: 16upx;
							top: 10upx;
							left: 0;
							border-radius: 50%;
							// background: #999;
							&.running{
								background: #09BB07;
							}
							&.standby{
								background: #00b7ee;
							}
							&.stop{
								background: #666;
							}
							&.off{
								background: #ccc;
							}
							&.warning{
								background: #FFB400;
							}
							&.alarm{
								background: #cd0615;
							}
						}
						>.img{
							display: block;
							height: 120upx;
							width: 120upx;
							border-radius: 50%;
							border: 1upx solid #ddd;
							background: #eee;
						}
					}
					>.text{
						display: flex;
						flex-wrap: wrap;
						justify-content: flex-start;
						width: calc(100% - 40upx);
						>.name{
							font-size: 32upx;
							color: #444;
							font-weight: bold;
							width: 100%;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							line-height: 42upx;
							text-align: left;
							margin-bottom: 10upx;
						}
						>.status{
							line-height: 28upx;
							text-align: left;
							font-size: 24upx;
							color: #999;
							width: 100%;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}
						>.content{
							line-height: 28upx;
							text-align: left;
							font-size: 24upx;
							color: #999;
							display: flex;
							justify-content: flex-start;
							flex-wrap: nowrap;
							width: 100%;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							>text{
								margin-right: 5upx;
							}
						}
					}
					>.iconfont{
						position: absolute;
						top: 50%;
						right: 20upx;
						transform: translateY(-50%);
						color: #999;
						font-size: 28upx;
						transition: color 0.3s , right 0.3s;
					}
				}
			}
		}
	}
</style>
