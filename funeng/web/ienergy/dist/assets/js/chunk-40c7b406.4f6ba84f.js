(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-40c7b406"],{"5d6b":function(t,e,a){var o=a("e53d").parseInt,n=a("a1ce").trim,i=a("e692"),s=/^[-+]?0[xX]/;t.exports=8!==o(i+"08")||22!==o(i+"0x16")?function(t,e){var a=n(String(t),3);return o(a,e>>>0||(s.test(a)?16:10))}:o},"70f6":function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"property"},[a("button",{staticClass:"btn",attrs:{type:"button",name:"button"},on:{click:t.gotoBack}},[a("i",{staticClass:"iconfont"},[t._v("")])]),a("h3",[t._v(t._s(t.tagName))]),a("div",{staticClass:"DBcontainer"},[a("div",{ref:"lineChart",staticClass:"chart canvas",attrs:{id:"myChart"}})])])},n=[],i=a("f499"),s=a.n(i),r=a("e814"),c=a.n(r),h={data:function(){return{machineId:{},tagId:{},tagName:"",echart:"",times:[],historyMode:!1,lineOption:{backgroundColor:"#BBBBBB",color:["#D96D32","#54A0BC","#74404A","#484B75","#C73831","#436399","#fff"],tooltip:{trigger:"axis",position:function(t){return[t[0],"10%"]},axisPointer:{animation:!0,type:"cross",label:{color:"#ccc",backgroundColor:"rgba(0,0,0,0.5)"},lineStyle:{color:"rgba(0,0,0,0.5)"},crossStyle:{color:"rgba(0,0,0,0.5)"}}},grid:{right:10,top:60,left:10},toolbox:{show:!0,right:20,top:10,iconStyle:{borderColor:"#ccc"},emphasis:{iconStyle:{borderColor:"#fff"}},feature:{dataZoom:{yAxisIndex:"none"},magicType:{type:["line","bar"]},dataView:{},restore:{}}},xAxis:{type:"category",data:this.chartDate,axisLine:{lineStyle:{color:"#fff"}},splitLine:{show:!0},boundaryGap:[.2,.2]},yAxis:{type:"value",boundaryGap:["10%","10%"],min:function(t){return t.min-t.min/4},max:function(t){return t.max+t.min/4},axisLine:{lineStyle:{color:"#fff"}},axisLabel:{inside:!0},splitLine:{show:!0}},dataZoom:[{type:"inside",start:90,end:100},{start:0,end:10,handleIcon:"M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",handleSize:"80%",handleStyle:{color:"#fff",shadowBlur:3,shadowColor:"rgba(0, 0, 0, 0.6)",shadowOffsetX:2,shadowOffsetY:2}}],series:[{type:"line",smooth:!0,symbol:"none",sampling:"average",areaStyle:{normal:{color:{x:0,y:0,x2:0,y2:.92,type:"linear",global:!1,colorStops:[{offset:0,color:"rgba(67,99,153,0.60)"},{offset:1,color:"rgba(60,94,136,0.10)"}]}}},data:this.chartData,markPoint:{label:{color:"#333"},data:[{type:"max",name:"最大值"},{type:"min",name:"最小值"}]},markLine:{label:{position:"middle"},data:[{type:"average",name:"平均值"}]}}]},chartData:[],chartDate:[],loadingData:!1}},beforeCreate:function(){},created:function(){this.get_data_query()},mounted:function(){this.createChart(),this.getProperty()},beforeDestroy:function(){},destroyed:function(){},methods:{closeHistory:function(){this.historyMode=!1,this.getProperty(),this.times=[]},openHistory:function(){this.historyMode=!0,this.chartData=[],this.chartDate=[],this.lineOption.series[0].data=this.chartData,this.lineOption.xAxis.data=this.chartDate,this.echart.setOption(this.lineOption)},get_data_query:function(){this.machineId=this.$route.query.machineId,this.tagId=this.$route.query.tagId,this.tagName=this.$route.query.tagName},gotoBack:function(){this.$router.back(-1)},routeChange:function(){this.get_data_query()},getProperty:function(t){var e=this,a=new Date,o=new Date(a);o.setMonth(o.getMonth()-1),console.log(o),console.log(a),e.loadingData=!0,e.axios.post("/api/Machine/GetStatisticRTTags",{Inputs:[{GetTagsType:0,MachineId:e.machineId,TagId:e.tagId,QueryType:0,StatisticType:0,StartTime:o,EndTime:a,Count:500}]}).then(function(t){for(var a in console.log(t),e.loadingData=!1,e.chartData=[],e.chartDate=[],t.data[0].Tags)e.chartData.push(t.data[0].Tags[a].FValue.toFixed(2)),e.chartDate.push(t.data[0].Tags[a].TimeStamp);e.lineOption.series[0].data=e.chartData,e.lineOption.xAxis.data=e.chartDate,e.echart.setOption(e.lineOption)}).catch(function(t){console.log(t)})},createChart:function(){var t=this;this.echart=this.$echarts.init(document.getElementById("myChart")),t.echart.setOption(t.lineOption)},initWebSocket:function(){var t="wss://38798879.xyz/Extension/GSocket/WSHandler.ashx";this.websock=new WebSocket(t),this.websock.onopen=this.websocketonopen,this.websock.onerror=this.websocketonerror,this.websock.onmessage=this.websocketonmessage,this.websock.onclose=this.websocketclose},websocketonopen:function(t){console.log("WebSocket连接成功"),this.getNewProperty()},websocketonerror:function(t){console.log("WebSocket连接发生错误"+t)},websocketclose:function(t){console.log("WebSocket关闭")},websocketonmessage:function(t){var e=this,a=JSON.parse(t.data);console.log(a),e.chartData.shift(),e.chartDate.shift(),e.chartData.push(a.Data.FValue.toFixed(2)),e.chartDate.push(a.Data.TimeStamp),e.lineOption.series[0].data=e.chartData,e.lineOption.xAxis.data=e.chartDate,e.echart.setOption(e.lineOption)},getNewProperty:function(t){var e=this,a=c()(e.machineId),o=c()(e.tagId),n={Key:1,Data:{Tags:[{MachineId:a,TagId:o}]}};console.log(s()(n)),a&&o&&setTimeout(function(){e.websock.send(s()(n),function(t){console.log(t)})},1e3)},getProperty_history:function(){var t=this;t.loadingData=!0,t.axios.post("/api/Machine/GetHtyRTTags",{Inputs:[{GetTagsType:0,MachineId:t.machineId,TagId:t.tagId,QueryType:0,StatisticType:0,StartTime:t.times[0],EndTime:t.times[1],Count:500}]}).then(function(e){for(var a in console.log(e),t.loadingData=!1,t.chartData=[],t.chartDate=[],e.data[0].Tags)t.chartData.push(e.data[0].Tags[a].FValue.toFixed(2)),t.chartDate.push(e.data[0].Tags[a].TimeStamp);t.lineOption.series[0].data=t.chartData,t.lineOption.xAxis.data=t.chartDate,t.echart.setOption(t.lineOption)}).catch(function(e){console.log(e),t.$Message.error(e.statusText)})}},computed:{},components:{},watch:{$route:"routeChange"}},l=h,u=(a("9b01"),a("2877")),d=Object(u["a"])(l,o,n,!1,null,"f06e05a4",null);e["default"]=d.exports},7445:function(t,e,a){var o=a("63b6"),n=a("5d6b");o(o.G+o.F*(parseInt!=n),{parseInt:n})},"9b01":function(t,e,a){"use strict";var o=a("e362"),n=a.n(o);n.a},a1ce:function(t,e,a){var o=a("63b6"),n=a("25eb"),i=a("294c"),s=a("e692"),r="["+s+"]",c="​",h=RegExp("^"+r+r+"*"),l=RegExp(r+r+"*$"),u=function(t,e,a){var n={},r=i(function(){return!!s[t]()||c[t]()!=c}),h=n[t]=r?e(d):s[t];a&&(n[a]=h),o(o.P+o.F*r,"String",n)},d=u.trim=function(t,e){return t=String(n(t)),1&e&&(t=t.replace(h,"")),2&e&&(t=t.replace(l,"")),t};t.exports=u},b9e9:function(t,e,a){a("7445"),t.exports=a("584a").parseInt},e362:function(t,e,a){},e692:function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},e814:function(t,e,a){t.exports=a("b9e9")}}]);