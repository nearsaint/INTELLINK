(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1b3b6420"],{5690:function(t,e,o){},c109:function(t,e,o){"use strict";o.r(e);var l=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("div",{staticClass:"search"},[o("div",{staticClass:"title"},[t._v(" 能源站综合数据分析报表")]),o("div",{staticClass:"content"},[o("div",{staticClass:"block"},[o("span",{staticClass:"demonstration"},[t._v("时间")]),o("el-date-picker",{attrs:{type:"date",placeholder:"选择日期",type:t.timeType},model:{value:t.time,callback:function(e){t.time=e},expression:"time"}})],1),o("div",{staticClass:"block"},[o("span",{staticClass:"demonstration"},[t._v("查看方式")]),o("el-select",{attrs:{placeholder:"请选择"},on:{change:t.typeChange},model:{value:t.type,callback:function(e){t.type=e},expression:"type"}},t._l(t.types,function(t){return o("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})}),1)],1),o("div",{staticClass:"block"},[o("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:t.searchPower}},[t._v("查询")])],1),o("div",{staticClass:"export"},[o("el-button",{attrs:{type:"success",icon:"el-icon-document"},on:{click:t.exportPower}},[t._v("导出报表")])],1)])]),o("div",{staticClass:"table"},[o("el-table",{staticStyle:{width:"100%"},attrs:{data:t.powers,stripe:""}},[o("el-table-column",{attrs:{prop:"Time",label:"时间",width:"200"}}),o("el-table-column",{attrs:{prop:"AvgFlow",label:"平均供气流量(m³/min)",width:"200"}}),o("el-table-column",{attrs:{prop:"TotalFlow",label:"流量计累积(m³)",width:"200"}}),o("el-table-column",{attrs:{prop:"AvgFlow2",label:"平均供氮气流量(m³/h)",width:"200"}}),o("el-table-column",{attrs:{prop:"TotalFlow2",label:"流量计累积(m³)",width:"200"}}),o("el-table-column",{attrs:{prop:"AvgFlow1",label:"平均供制氮机气量(m³/min)",width:"200"}}),o("el-table-column",{attrs:{prop:"TotalFlow1",label:"流量计累积(m³)",width:"200"}}),o("el-table-column",{attrs:{prop:"AvgPower",label:"平均功率(KW)",width:"200"}}),o("el-table-column",{attrs:{prop:"TotalPower",label:"电表累积(KWH)",width:"200"}}),o("el-table-column",{attrs:{prop:"GNRatio",label:"气氮比",width:"200"}}),o("el-table-column",{attrs:{prop:"Consump",label:"单耗(KWH/m³)",width:"200"}})],1)],1),o("el-dialog",{attrs:{title:"提示",visible:t.dialogVisible,width:"30%"},on:{"update:visible":function(e){t.dialogVisible=e}}},[o("span",[t._v("文件已生成,单击进行下载.")]),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(e){t.dialogVisible=!1}}},[t._v("取 消")]),o("el-button",{attrs:{type:"primary"},on:{click:t.downloadPower}},[t._v("确 定")])],1)])],1)},a=[],i={data:function(){return{time:"",types:[{value:0,label:"按日"},{value:1,label:"按月"}],type:"按日",powers:[],dialogVisible:!1,filepath:"",timeType:"date"}},beforeCreate:function(){},created:function(){},mounted:function(){},beforeDestroy:function(){},destroyed:function(){},methods:{searchPower:function(){var t=this;console.log("type:"+t.type),console.log("time:"+t.time),t.axios.post("/api/Machine/GetPowerReport",{PowerReportType:t.type,Time:t.time}).then(function(e){console.log(e),t.powers=e.data}).catch(function(e){console.log(e),t.$Message.error(e.statusText)})},exportPower:function(){var t=this;t.axios.post("/api/Machine/ExportAlarmHty",{PowerReportType:t.type,Time:t.time}).then(function(e){console.log(e),t.filepath=e.data.Data,t.dialogVisible=!0}).catch(function(e){console.log(e),t.$Message.error(e.statusText)})},downloadPower:function(){console.log(111),window.location.href=this.filepath},typeChange:function(){var t=this;console.log(t.type),"1"==t.type?t.timeType="month":"0"==t.type&&(t.timeType="date")}},computed:{},components:{}},s=i,n=(o("fd62"),o("2877")),c=Object(n["a"])(s,l,a,!1,null,"47204a0f",null);e["default"]=c.exports},fd62:function(t,e,o){"use strict";var l=o("5690"),a=o.n(l);a.a}}]);