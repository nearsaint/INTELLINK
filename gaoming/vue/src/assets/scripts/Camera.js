import md5 from 'src/assets/scripts/md5.js';
import Message from 'element-ui';

console.log('camerajs');
//工具函数---start
export function CreateEmptyString(l) {
  var a = [];
  for (var i = 0; i < l; i++) {
    a[i] = '*';
  }
  return a.join('');
}


//向列表中添加表项
export function AddList(sel, text, value) {
  var option = document.createElement("option");
  option.appendChild(document.createTextNode(text));
  option.setAttribute("value", value);
  sel.appendChild(option);
  return;
}


//去除时间格式内的HTTP关键字
export function FormatTime(time) {
  var tmp_string = time.split(' ');
  var tmp_string_cp = tmp_string[1].split(':');
  return tmp_string[0] + '%20' + tmp_string_cp[0] + '%3A' + tmp_string_cp[1] + '%3A' + tmp_string_cp[2];
}



var IS_SHOW_DEBUG = 0; //0-关闭, 1-开启
var gdownloadID = 1; //下载编码
var gdownloadID2 = 1;

export function DebugAlert(str) {
  if (IS_SHOW_DEBUG == 1) {
    alert(str);
  }
}

String.prototype.replaceAll = function(f, r) {
  var s = new String(this);
  while (s.indexOf(f) != -1) {
    s = s.replace(f, r);
  }
  return s.toString();
}

/**
 * 解析从控件返回的xml字符串
 */
export function loadXML(xmlString) {
  if (!g_xmlActive) {
    return;
  }
  g_xmlActive.loadXML(xmlString);
  if (0 == g_xmlActive.parseError.errorCode) {
    return g_xmlActive;
  } else {
    alert("xml解析错误:" + g_xmlActive.parseError.reason);
    return null;
  }
}

export function getElementById(dom, tagName) {
  for (var i = 0; i < dom.childNodes.length; i++) {
    var node = dom.childNodes[i];
    if (node.baseName == tagName) {
      return node.nodeTypedValue;
    } else {
      if (node.childNodes.length != 0) {
        getElementById(dom.childNodes[i], tagName);
      }
    }
  }
}

//工具函数---end



//全局变量---start

export const g_UserLoginId = '';
export const g_imosActivePlayer = null;
export const g_curFrameNum = '';
export const g_xmlActive = null;
export const g_isLogin = 1;



//全局变量---end



//================>功能函数---start
//检查控件
export function InitPage() {

  const g_imosActivePlayer = document.all.h3c_IMOS_ActiveX;
  const g_PlayFrame = document.all.Play_Frame;
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
  }

  var xmldoc;
  try {
    xmldoc = new ActiveXObject("Microsoft.XMLDOM");
    if (!xmldoc) {
      xmldoc = new ActiveXObject("MSXML2.DOMDocument.3.0");
    }
  } catch (e) {}
  g_xmlActive = xmldoc;
  if (!g_xmlActive) {
    alert("xml解析器获取错误，将导致某些功能不可用");
  } else {
    g_xmlActive.async = "false";
  }
}

//登录
export function DoLogin(c_serverIP, c_userName, c_passWd) {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  // var serverIP = document.getElementById("ServerIPText").value;
  // var userName = document.getElementById("UserNameText").value;
  // var passWd = document.getElementById("PassWordText").value.toString();
  let serverIP = c_serverIP;
  let userName = c_userName;
  let passWd = c_passWd.toString();

  if (passWd == "") {
    passWd = "";
  }

  g_isLogin = g_imosActivePlayer.IMOSAX_InitOCX(serverIP, "8800", userName, passWd, 1);
  if (0 != g_isLogin) {
    alert("IMOSAX_InitOCX Error:" + g_isLogin);
    return;
  } else {
    alert("系统登录成功！用户名:" + userName);
  }

  //获取用户信息
  var retStr = g_imosActivePlayer.IMOSAX_GetUserLoginInfo();
  var userObj = loadXML(retStr);
  g_UserLoginId = userObj.documentElement.selectNodes("//LOGININFO/UserLoginIDInfo/UserLoginCode")[0].text;

}


//退出登录
export function DoLogout() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }

  var flag = g_imosActivePlayer.IMOSAX_UnregOCX();
  if (0 != flag) {
    alert("IMOSAX_UnregOCX Error:" + flag);
    return;
  }

  var loginSt = document.getElementById("loginSt");
  loginSt.innerText = "系统未登录！";
}

//软解业务
//启动软解轮切
export function DoStartSwitch() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var switchID = document.getElementById("SwitchIDText").value;
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StartFrameSwitch(frameNum, switchID);
  if (0 == flag) {
    alert("启动轮切成功");
  } else {
    alert("启动轮切失败，错误码：" + flag);
  }
}

//停止软解轮切
export function DoStopSwitch() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var frameNum = g_curFrameNum;
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StopFrameSwitch(frameNum);
  if (0 == flag) {
    alert("停止轮切成功");
  } else {
    alert("停止轮切失败，错误码：" + flag);
  }
}
//软解轮切控制
export function DoAdjustFrameSwitch() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var frameNum = g_curFrameNum;
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请选择一个窗格");
    return;
  }
  var adjustAction = document.getElementById("AdjustAction").value;
  var flag = g_imosActivePlayer.IMOSAX_AdjustFrameSwitch(frameNum, adjustAction);
  if (0 == flag) {
    alert("轮切控制成功");
  } else {
    alert("轮切控制失败，错误码：" + flag);
  }
}
//绑定窗格通道
export function DoSetPlayWnd() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var frameNum = g_curFrameNum;
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请选择一个窗格");
    return;
  }
  var frameHWnd = document.getElementById("FrameHWnd").value;
  var flag = g_imosActivePlayer.IMOSAX_SetPlayWnd(frameNum, frameHWnd);
  if (0 == flag) {
    alert("绑定窗格通道成功");
  } else {
    alert("绑定失败，错误码：" + flag);
  }

}

export function DoSetAlarmInfo() {
  //alert("DoSetAlarmInfo");
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }

  //告警类型、开始小时、开始分钟、结束小时、结束分钟、闪烁时长
  var flag = g_imosActivePlayer.IMOSAX_SetAlarmInfo(401, 13, 55, 10, 54, 7);
  if (0 == flag) {
    alert("设置告警成功");
  } else {
    alert("设置告警失败，错误码：" + flag);
  }
}

//启动软解实况
export function DoStartPlay() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var cameraId = document.getElementById("CamIDText").value;
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StartFrameLive(frameNum, cameraId);
  if (0 == flag) {
    alert("实况播放成功");
  } else {
    alert("播放实况失败，错误码：" + flag);
  }
}

//释放软解实况
export function DoStopPlay() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var frameNum = g_curFrameNum;
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StopFramelive(frameNum);
  if (0 == flag) {
    alert("停止实况成功");
  } else {
    alert("停止实况失败，错误码：" + flag);
  }
}
//硬解业务
//启动硬解实况
export function DoStartMonitorLive() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var cameraId = document.getElementById("CamIDText").value;
  var monitorId = document.getElementById("MonitorIDText").value;
  var flag = g_imosActivePlayer.IMOSAX_StartMonitorLive(monitorId, cameraId);
  if (0 == flag) {
    alert("实况播放成功");
  } else {
    alert("播放实况失败，错误码：" + flag);
  }

}

//停止硬解实况
export function DoStopMonitorLive() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var monitorId = document.getElementById("MonitorIDText").value;

  var flag = g_imosActivePlayer.IMOSAX_StopMonitorLive(monitorId);
  if (0 == flag) {
    alert("停止实况成功");
  } else {
    alert("播放实况失败，错误码：" + flag);
  }

}
//启动硬解轮切
export function DoStartMonitorSwitch() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var switchID = document.getElementById("SwitchIDText").value;
  var monitorId = document.getElementById("MonitorIDText").value;
  var flag = g_imosActivePlayer.IMOSAX_StartMonitorSwitch(monitorId, switchID);
  if (0 == flag) {
    alert("启动轮切成功");
  } else {
    alert("启动轮切失败，错误码：" + flag);
  }

}
//停止硬解轮切
export function DoStopMonitorSwitch() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var monitorId = document.getElementById("MonitorIDText").value;
  var flag = g_imosActivePlayer.IMOSAX_StopMonitorSwitch(monitorId);
  if (0 == flag) {
    alert("停止轮切成功");
  } else {
    alert("停止轮切失败，错误码：" + flag);
  }

}
//硬解轮切控制
export function DoAdjustMonitorSwitch() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var monitorId = document.getElementById("MonitorIDText").value;
  var adjustAction = document.getElementById("AdjustAction").value;
  var flag = g_imosActivePlayer.IMOSAX_AdjustMonitorSwitch(monitorId, adjustAction);
  if (0 == flag) {
    alert("轮切控制成功");
  } else {
    alert("轮切控制失败，错误码：" + flag);
  }

}
//软解组显示操作

export function DoHandleGroupShow() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }

  if (g_isLogin) {
    alert("未登录，请先登录再使用本功能！");
    return;
  }

  var GroupShowHandleType = document.getElementById("GroupShowHandleType").value;
  var GroupShowCode = document.getElementById("GroupShowCode").value;

  var resStr = g_imosActivePlayer.IMOSAX_HandleGroupShow(GroupShowHandleType, GroupShowCode);

  if (0 == resStr) {
    if (1 == GroupShowHandleType) {
      alert("启动组显示成功！");
    } else if (0 == GroupShowHandleType) {
      alert("停止组显示成功！");
    } else {
      alert("操作码不对！");
    }
  } else {
    if (1 == GroupShowHandleType) {
      alert("启动组显示失败！错误码=" + resStr);
    } else if (0 == GroupShowHandleType) {
      alert("停止组显示失败！错误码=" + resStr);
    } else {
      alert("操作码不对！");
    }
  }

  return;

}

//查询组显示中的摄像机信息
export function DoQueryGroupShow() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }

  if (g_isLogin) {
    alert("未登录，请先登录再使用本功能！");
    return;
  }

  var GroupShowCode = document.getElementById("GroupShowCode").value;

  var resStr = g_imosActivePlayer.IMOSAX_QueryCameraInfoGroupShow(GroupShowCode);

  alert(resStr);

  return;
}
//启动硬解组显示
export function StartSalvoTV() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }

  if (g_isLogin) {
    alert("未登录，请先登录再使用本功能！");
    return;
  }

  var strSalvoCode = document.getElementById("strSalvoCodeTV").value;
  var retCode = g_imosActivePlayer.IMOSAX_StartGroupShow(strSalvoCode);
  if (0 != retCode) {
    alert("启动组显示失败，错误码：" + retCode);
    return;
  }
  alert("启动组显示成功");
}

//停止硬解组显示
export function StopSalvoTV() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }

  if (g_isLogin) {
    alert("未登录，请先登录再使用本功能！");
    return;
  }

  var strSalvoCode = document.getElementById("strSalvoCodeTV").value;
  var retCode = g_imosActivePlayer.IMOSAX_StopGroupShow(strSalvoCode);
  if (0 != retCode) {
    alert("停止组显示失败，错误码：" + retCode);
    return;
  }
  alert("停止组显示成功");
}
//组轮巡
export function ProcessGroupsalvo() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }

  if (g_isLogin) {
    alert("未登录，请先登录再使用本功能！");
    return;
  }

  var GroupsalvoCode = document.getElementById("GroupsalvoCode").value;

  var OperateType = document.getElementById("OperateType").value;

  var OperateCode = document.getElementById("OperateCode").value;

  var resStr = g_imosActivePlayer.IMOSAX_ProcessGroupsalvo(GroupsalvoCode, OperateType, OperateCode);

  alert(resStr);

  return;
}

//启动实况（独立播放窗格）
export function DoStartPlay2() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var cameraId = document.getElementById("CamIDText").value;
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    //alert("请先选择一个窗格");
    //return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StartNewFrameLive(1, cameraId);
  if (0 == flag) {
    alert("实况播放成功");
  } else {
    alert("播放实况失败，错误码：" + flag);
  }
}
//释放实况（独立播放窗格）
export function DoStopPlay2() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }

  var retCode = g_imosActivePlayer.IMOSAX_StopNewFrameLive(1);
  if (0 == retCode) {
    alert("停止实况成功");
  } else {
    alert("停止实况失败，错误码：" + retCode);
  }
}
//启动文件
export function DoStartFile() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var cameraId = document.getElementById("FileIDText").value;
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StartLocalReplay(frameNum, cameraId);
  if (0 == flag) {
    alert("播放文件成功");
  } else {
    alert("播放文件失败，错误码：" + flag);
  }
}

//释放文件
export function DoStopFile() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var frameNum = g_curFrameNum;
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StopReplay(frameNum);
  if (0 == flag) {
    alert("停止文件成功");
  } else {
    alert("停止文件失败，错误码：" + flag);
  }
}

//单步
export function DoStepFile() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var frameNum = g_curFrameNum;
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_OneStepPlay(frameNum);
  if (0 != flag) {
    alert("单步文件失败，错误码：" + flag);
  }
}

export function DoGetAllCamList() {
  var strXmlQueryCondition = "";
  strXmlQueryCondition = '<?xml version="1.0" ?>' +
    '<data>' +
    '<ItemNum>3</ItemNum>' + //总共有三个查询条件(不限制摄像头子类型即查询所有类型的摄像头包括固定摄像头等)
    '<QueryConditionList count="3">' + //这边的查询条件数量要和ItemNum一样
    '<item>' + // 查询子域
    '<QueryType>257</QueryType> ' +
    '<LogicFlag>0</LogicFlag> ' +
    '<QueryData>1</QueryData> ' +
    '</item>' +
    '<item>' + //查询的资源类型是摄像头
    '<QueryType>256</QueryType>' +
    '<LogicFlag>0</LogicFlag>' +
    '<QueryData>1001</QueryData>' +
    '</item>' +
    '<item>' + // 查询结果按照名称的升序排序
    '<QueryType>1</QueryType> ' +
    '<LogicFlag>6</LogicFlag>' +
    '<QueryData /> ' +
    '</item>' +
    '</QueryConditionList>' +
    '</data>';

  var strXmlQueryPageInfo = '<?xml version="1.0" ?> ' +
    '<data>' +
    '<PageRowNum>100</PageRowNum>' + //最多返回100个记录()
    '<PageFirstRowNumber>0</PageFirstRowNumber>' + //从第0个记录开始返回
    '<QueryCount>1</QueryCount>' + //还需要返回总记录数
    '</data>';

  var retStr = "";
  retStr = g_imosActivePlayer.IMOSAX_QueryOrgResListEx('iccsid', strXmlQueryCondition, strXmlQueryPageInfo);

  var cameraListObj = loadXML(retStr);
  if (!cameraListObj) {
    return;
  }
  var CameraStatus = cameraListObj.documentElement.selectNodes("//result/ResList/item/ResItemV1/ResStatus"); //参见文档xml结构进行解析
  var CameraCode = cameraListObj.documentElement.selectNodes("//result/ResList/item/ResItemV1/ResCode"); //参见文档xml结构进行解析
  var RowNum = cameraListObj.documentElement.selectNodes("//result/RespPageInfo/RowNum");
  var RowNum = RowNum[0].text;
  var intRowNum = parseInt(RowNum);
  for (var i = 0; i < intRowNum; i++) {
    textAllCameraCode.value = textAllCameraCode.value + CameraCode[i].text + "\n";
    if (1 == parseInt(CameraStatus[i].text)) //判断是否在线
    {
      textOnlineCameraCode.value = textOnlineCameraCode.value + CameraCode[i].text + "\n";
    }
  }
  textXML.value = retStr;
}

export function DoGetAlarmList() {
  var strXmlQueryCondition = "";

  var strXmlQueryPageInfo = '<?xml version="1.0" ?> ' +
    '<data>' +
    '<PageRowNum>10</PageRowNum>' + //最多返回100个记录
    '<PageFirstRowNumber>0</PageFirstRowNumber>' + //从第0个记录开始返回
    '<QueryCount>1</QueryCount>' + //还需要返回总记录数
    '</data>';

  var retStr = "";
  retStr = g_imosActivePlayer.IMOSAX_QueryAlarmList(strXmlQueryCondition, strXmlQueryPageInfo);
  alert(retStr);
}



//下载业务
export function DoDownloadQueryRecord() {
  var cameraId = document.getElementById("CamIDText").value;
  var startQueryTime = document.getElementById("DownloadStartTime").value;
  var endQueryTime = document.getElementById("DownloadEndTime").value;
  var retStr = g_imosActivePlayer.IMOSAX_QueryRecord(cameraId, startQueryTime, endQueryTime);
  alert(retStr);
  var recordListObj = loadXML(retStr);
  var RecordObjArray = recordListObj.documentElement.selectNodes("//RESLIST/item");

  var FileListObj = document.all.FileList;
  FileListObj.innerHTML = '';
  for (i = 0; i < RecordObjArray.length; i++) {
    var FileName = RecordObjArray[i].selectSingleNode("FileName").text;
    var StartTime = RecordObjArray[i].selectSingleNode("StartTime").text;
    var EndTime = RecordObjArray[i].selectSingleNode("EndTime").text;
    AddList(FileListObj, StartTime + '~' + EndTime, FileName);
  }

}

export function DoDownload() {
  var cameraId = document.getElementById("CamIDText").value;
  var FileListObj = document.all.FileList;
  var file_name = FileListObj.value;
  var start_time;
  var stop_time;
  var time_array;
  // 从列表中获取当前选择的文件起止时间
  for (var i = 0; i < FileListObj.options.length; i++) {
    if (FileListObj.options[i].value == FileListObj.value) {
      time_array = FileListObj.options[i].innerText.split("~");
      start_time = time_array[0];
      stop_time = time_array[1];
      DebugAlert(start_time + ":" + stop_time);
      break;
    }
  }
  if ("" == time_array) {
    return;
  }
  gdownloadID = g_imosActivePlayer.IMOSAX_StartDownMediaStream(cameraId, start_time, stop_time);
  alert(gdownloadID);
  document.getElementById("downloadID1").value = gdownloadID;
}

//下载停止
export function DoDownloadStop() {

  var downloadId = document.getElementById("downloadID1").value;
  var flag = g_imosActivePlayer.IMOSAX_StopDownMediaStream(downloadId);
  if (0 != flag) {
    alert("停止下载失败，错误码：" + flag);
  } else {
    alert("停止下载成功！")
  }
}

//获取下载进度

export function DoGetDownloadPos() {
  var downloadId = document.getElementById("downloadID1").value;
  var flag = g_imosActivePlayer.IMOSAX_GetDownloadPos(downloadId);

  alert(flag);
}

//获取下载信息
export function DoGetDownloadInfo() {
  var downloadId = document.getElementById("downloadID1").value;
  var flag = g_imosActivePlayer.IMOSAX_GetDownloadInfo(downloadId);

  alert(flag);
}

//回放查询
export function DoQueryRecord() {
  var cameraId = document.getElementById("CamIDText").value;
  var startQueryTime = document.getElementById("StartTimeText").value;
  var endQueryTime = document.getElementById("EndTimeText").value;
  var retStr = g_imosActivePlayer.IMOSAX_QueryRecord(cameraId, startQueryTime, endQueryTime);

  if (retStr != "") {
    alert(retStr);
    var recordListObj = loadXML(retStr);
    var RecordObjArray = recordListObj.documentElement.selectNodes("//RESLIST/item");

    var FileListObj = document.all.FileList;
    FileListObj.innerHTML = '';
    for (i = 0; i < RecordObjArray.length; i++) {
      var FileName = RecordObjArray[i].selectSingleNode("FileName").text;
      var StartTime = RecordObjArray[i].selectSingleNode("StartTime").text;
      var EndTime = RecordObjArray[i].selectSingleNode("EndTime").text;
      AddList(FileListObj, StartTime + '~' + EndTime, FileName);
    }
  } else {
    alert("没有录像！");
  }

}

export function DoQueryRecord1() {
  var cameraId = document.getElementById("CamIDText").value;
  var startQueryTime = document.getElementById("StartTimeText1").value;
  var endQueryTime = document.getElementById("EndTimeText1").value;
  var retStr = g_imosActivePlayer.IMOSAX_QueryBakRecord(cameraId, startQueryTime, endQueryTime);
  alert(retStr);

  var recordListObj = loadXML(retStr);
  var RecordObjArray = recordListObj.documentElement.selectNodes("//RESLIST/item");

  var FileListObj = document.all.FileList;
  FileListObj.innerHTML = '';
  for (i = 0; i < RecordObjArray.length; i++) {
    var FileName = RecordObjArray[i].selectSingleNode("BakFilePath").text;
    var StartTime = RecordObjArray[i].selectSingleNode("BeginTime").text;
    var EndTime = RecordObjArray[i].selectSingleNode("EndTime").text;
    AddList(FileListObj, StartTime + '~' + EndTime, FileName);
  }

}

export function DoQueryRecord2() {
  var cameraId = document.getElementById("CamIDText").value;
  var startQueryTime = document.getElementById("StartTimeText2").value;
  var endQueryTime = document.getElementById("EndTimeText2").value;
  var retStr = g_imosActivePlayer.IMOSAX_QuerySlaveRecord(cameraId, startQueryTime, endQueryTime);
  alert(retStr);
  var recordListObj = loadXML(retStr);
  var RecordObjArray = recordListObj.documentElement.selectNodes("//RESLIST/item");

  var FileListObj = document.all.FileList;
  FileListObj.innerHTML = '';
  for (i = 0; i < RecordObjArray.length; i++) {
    var FileName = RecordObjArray[i].selectSingleNode("FileName").text;
    var StartTime = RecordObjArray[i].selectSingleNode("StartTime").text;
    var EndTime = RecordObjArray[i].selectSingleNode("EndTime").text;
    AddList(FileListObj, StartTime + '~' + EndTime, FileName);
  }

}
//查询车辆信息
export function QueryTollgateVehicleInfo() {
  var StartTime = document.getElementById("QueryTollgateStartTimeText").value;
  var EndTime = document.getElementById("QueryTollgateEndTimeText").value;
  var TollgateCode = document.getElementById("TollgateCode").value;
  //alert(TollgateCode);
  //alert(StartTime);
  var strXmlQueryCondition = "";
  strXmlQueryCondition = '<?xml version="1.0" ?>' +
    '<data>' +
    '<ItemNum>3</ItemNum>' +
    '<QueryConditionList count="3">' +
    '<item>' + // 查询子域
    '<QueryType>351</QueryType> ' +
    '<LogicFlag>0</LogicFlag> ' +
    '<QueryData>' + TollgateCode + '</QueryData> ' +
    '</item>' +
    '<item>' + // 查询开始时间
    '<QueryType>356</QueryType> ' +
    '<LogicFlag>3</LogicFlag> ' +
    '<QueryData>' + StartTime + '</QueryData> ' +
    '</item>' +
    '<item>' + // 查询结束时间
    '<QueryType>356</QueryType> ' +
    '<LogicFlag>4</LogicFlag> ' +
    '<QueryData>' + EndTime + '</QueryData> ' +
    '</item>' +
    '</QueryConditionList>' +
    '</data>';
  var strXmlQueryPageInfo = '<?xml version="1.0" ?> ' +
    '<data>' +
    '<PageRowNum>10</PageRowNum>' + //最多返回100个记录()
    '<PageFirstRowNumber>0</PageFirstRowNumber>' + //从第0个记录开始返回
    '<QueryCount>1</QueryCount>' + //还需要返回总记录数
    '</data>';
  var retStr = "";
  retStr = g_imosActivePlayer.IMOSAX_QueryVehicleDataList(strXmlQueryCondition, strXmlQueryPageInfo);
  alert(retStr);

}
//手动添加录像
export function SetManualBak() {
  var StartTime = document.getElementById("QueryBakStartTimeText").value;
  var EndTime = document.getElementById("QueryBakEndTimeText").value;
  var BakCameraCode = document.getElementById("BakCameraCode").value;
  var BaktaskDesc = document.getElementById("BaktaskDesc").value;
  var retStr = "";
  retStr = g_imosActivePlayer.IMOSAX_SetManualBak(BakCameraCode, BaktaskDesc, StartTime, EndTime);
  alert(retStr);
  var fso, tf;
  fso = new ActiveXObject("Scripting.FileSystemObject"); //获取对象
  tf = fso.CreateTextFile("c:\\testfile.txt", true); //创建一个文件夹
  // 写一行，并且带有新行字符。
  tf.WriteLine(BakCameraCode + " TaskCode is " + retStr);
  tf.Close(); //关闭
}
//播放选中文件
export function DelBakTask() {
  var BakTaskCode = document.getElementById("BakTaskCode").value;
  var retStr = "";
  retStr = g_imosActivePlayer.IMOSAX_DelBakTask(BakTaskCode);
  alert(retStr);
}

export function QueryBakTaskList() {
  var retStr = "";
  var BakCameraName = document.getElementById("BakCameraName").value;
  var strXmlQueryCondition = "";
  strXmlQueryCondition = '<?xml version="1.0" ?>' +
    '<data>' +
    '<ItemNum>1</ItemNum>' +
    '<QueryConditionList count="1">' +
    '<item>' + // 查询子域
    '<QueryType>1</QueryType> ' +
    '<LogicFlag>0</LogicFlag> ' +
    '<QueryData>' + BakCameraName + '</QueryData> ' +
    '</item>' +
    '</QueryConditionList>' +
    '</data>';
  var strXmlQueryPageInfo = '<?xml version="1.0" ?> ' +
    '<data>' +
    '<PageRowNum>10</PageRowNum>' + //最多返回100个记录()
    '<PageFirstRowNumber>0</PageFirstRowNumber>' + //从第0个记录开始返回
    '<QueryCount>1</QueryCount>' + //还需要返回总记录数
    '</data>';
  retStr = g_imosActivePlayer.IMOSAX_QueryBakTaskList(strXmlQueryCondition, strXmlQueryPageInfo);
  alert(retStr);
  var fso, tf;
  fso = new ActiveXObject("Scripting.FileSystemObject"); //获取对象
  tf = fso.CreateTextFile("c:\\xml.txt", true); //创建一个文件夹
  // 写一行，并且带有新行字符。
  tf.WriteLine(retStr);
}

export function DoPlayRecord() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var cameraId = document.getElementById("CamIDText").value;
  var FileListObj = document.all.FileList;
  var file_name = FileListObj.value;
  var start_time;
  var stop_time;
  var time_array;
  // 从列表中获取当前选择的文件起止时间
  for (var i = 0; i < FileListObj.options.length; i++) {
    if (FileListObj.options[i].value == FileListObj.value) {
      time_array = FileListObj.options[i].innerText.split("~");
      start_time = time_array[0];
      stop_time = time_array[1];
      DebugAlert(start_time + ":" + stop_time);
      break;
    }
  }
  if ("" == time_array) {
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StartVodReplay(frameNum, cameraId, start_time, stop_time);
  if (0 != flag) {
    alert("回放失败，错误码：" + flag);
  }
}

export function DoPlayRecord2() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var cameraId = document.getElementById("CamIDText").value;
  var FileListObj = document.all.FileList;
  var file_name = FileListObj.value;
  var start_time;
  var stop_time;
  var time_array;
  // 从列表中获取当前选择的文件起止时间
  for (var i = 0; i < FileListObj.options.length; i++) {
    if (FileListObj.options[i].value == FileListObj.value) {
      time_array = FileListObj.options[i].innerText.split("~");
      start_time = time_array[0];
      stop_time = time_array[1];
      DebugAlert(start_time + ":" + stop_time);
      break;
    }
  }
  if ("" == time_array) {
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StartSlaveVodReplay(frameNum, cameraId, start_time, stop_time);
  if (0 != flag) {
    alert("回放失败，错误码：" + flag);
  }
}

export function DoPlayRecord1() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var cameraId = document.getElementById("CamIDText").value;
  var FileListObj = document.all.FileList;
  var file_name = FileListObj.value;
  var start_time;
  var stop_time;
  var time_array;
  // 从列表中获取当前选择的文件起止时间
  for (var i = 0; i < FileListObj.options.length; i++) {
    if (FileListObj.options[i].value == FileListObj.value) {
      time_array = FileListObj.options[i].innerText.split("~");
      start_time = time_array[0];
      stop_time = time_array[1];
      DebugAlert(start_time + ":" + stop_time);
      break;
    }
  }
  if ("" == time_array) {
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StartBakVodReplay(frameNum, cameraId, start_time, stop_time);
  if (0 != flag) {
    alert("回放失败，错误码：" + flag);
  }
}
//停止录像回放

export function DoStopPlayRecord() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StopReplay(frameNum);
  if (0 != flag) {
    alert("关闭回放失败，错误码：" + flag);
  }

}

//暂停回放
export function DoPauseReplay() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_PauseReplay(frameNum);
  if (0 != flag) {
    alert("暂停回放失败，错误码：" + flag);
  } else {
    alert("暂停回放成功！");
  }

}
//继续回放
export function DoResumeReplay() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_ResumeReplay(frameNum);
  if (0 != flag) {
    alert("继续回放失败，错误码：" + flag);
  } else {
    alert("继续回放成功！");
  }
}

export function DoBakDownload() {

  var cameraId = document.getElementById("CamIDText").value;
  var FileListObj = document.all.FileList;
  var file_name = FileListObj.value;
  var start_time;
  var stop_time;
  var time_array;
  // 从列表中获取当前选择的文件起止时间
  for (var i = 0; i < FileListObj.options.length; i++) {
    if (FileListObj.options[i].value == FileListObj.value) {
      time_array = FileListObj.options[i].innerText.split("~");
      start_time = time_array[0];
      stop_time = time_array[1];
      DebugAlert(start_time + ":" + stop_time);
      break;
    }
  }
  if ("" == time_array) {
    return;
  }
  gdownloadID = g_imosActivePlayer.IMOSAX_StartDownBakMediaStream(cameraId, start_time, stop_time);
  alert(gdownloadID);
  document.getElementById("downloadID").value = gdownloadID;

}

export function DoSlaveDownload() {

  var cameraId = document.getElementById("CamIDText").value;
  var FileListObj = document.all.FileList;
  var file_name = FileListObj.value;
  var start_time;
  var stop_time;
  var time_array;
  // 从列表中获取当前选择的文件起止时间
  for (var i = 0; i < FileListObj.options.length; i++) {
    if (FileListObj.options[i].value == FileListObj.value) {
      time_array = FileListObj.options[i].innerText.split("~");
      start_time = time_array[0];
      stop_time = time_array[1];
      DebugAlert(start_time + ":" + stop_time);
      break;
    }
  }
  if ("" == time_array) {
    return;
  }
  gdownloadID2 = g_imosActivePlayer.IMOSAX_StartDownSlaveMediaStream(cameraId, start_time, stop_time);
  alert(gdownloadID2);
  document.getElementById("downloadID2").value = gdownloadID2;

}

export function DoBakDownloadStop() {

  var downloadId = document.getElementById("downloadID").value;
  var flag = g_imosActivePlayer.IMOSAX_StopDownMediaStream(downloadId);
  alert(flag);
}

export function DoSlaveDownloadStop() {

  var downloadId = document.getElementById("downloadID2").value;
  var flag = g_imosActivePlayer.IMOSAX_StopDownMediaStream(downloadId);
  alert(flag);
}
//获取播放进度

export function GetReplayPos() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var posTime = g_imosActivePlayer.IMOSAX_GetReplayPos(frameNum);
  alert(posTime);
}



//回放控制

export function ReplayControl(cmd) {

}


//回放跳转

export function SetPos() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var pos = document.all.PosText.value; //时间格式为：yyyy-mm-dd hh:mm:ss
  var flag = g_imosActivePlayer.IMOSAX_DragPlay(frameNum, pos)
  if (0 != flag) {
    alert("拖动回放失败，错误码：" + flag);
  }

}


//设置播放速度

export function SetPlaySpeed(speed) {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_SetPlaySpeed(frameNum, speed);
  if (0 != flag) {
    alert("设置回放速度失败，错误码：" + flag);
  }
}
//查询回放录像url信息
export function DoQueryRecordFileUrl() {
  var cameraId = document.getElementById("CamIDText").value;
  var FileListObj = document.all.FileList;
  var file_name = FileListObj.value;
  var start_time;
  var stop_time;
  var time_array;
  // 从列表中获取当前选择的文件起止时间
  for (var i = 0; i < FileListObj.options.length; i++) {
    if (FileListObj.options[i].value == FileListObj.value) {
      time_array = FileListObj.options[i].innerText.split("~");
      start_time = time_array[0];
      stop_time = time_array[1];
      DebugAlert(start_time + ":" + stop_time);
      break;
    }
  }
  if ("" == time_array) {
    return;
  }
  var url = g_imosActivePlayer.IMOSAX_QueryRecordFileUrl(cameraId, file_name, start_time, stop_time);
  alert(url);
}
//云检索业务
//云检索录像
export function DoCloudQueryRecord() {
  var cameraId = document.getElementById("CamIDText").value;
  var startQueryTime = document.getElementById("CloudStartTime").value;
  var endQueryTime = document.getElementById("CloudEndTime").value;
  var retStr = g_imosActivePlayer.IMOSAX_UnitedRecordRetrieval(cameraId, startQueryTime, endQueryTime);
  alert(retStr);
  var recordListObj = loadXML(retStr);
  var RecordObjArray = recordListObj.documentElement.selectNodes("//RESLIST/item");

  var FileListObj = document.all.FileList;
  FileListObj.innerHTML = '';
  for (i = 0; i < RecordObjArray.length; i++) {
    var FileName = RecordObjArray[i].selectSingleNode("FileName").text;
    var StartTime = RecordObjArray[i].selectSingleNode("StartTime").text;
    var EndTime = RecordObjArray[i].selectSingleNode("EndTime").text;
    AddList(FileListObj, StartTime + '~' + EndTime, FileName);
  }
}
//播放云检索录像
export function DoPlayCloudRecord() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var cameraId = document.getElementById("CamIDText").value;
  var FileListObj = document.all.FileList;
  var file_name = FileListObj.value;
  var start_time;
  var stop_time;
  var time_array;
  // 从列表中获取当前选择的文件起止时间
  for (var i = 0; i < FileListObj.options.length; i++) {
    if (FileListObj.options[i].value == FileListObj.value) {
      time_array = FileListObj.options[i].innerText.split("~");
      start_time = time_array[0];
      stop_time = time_array[1];
      DebugAlert(start_time + ":" + stop_time);
      break;
    }
  }
  if ("" == time_array) {
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StartVodReplayII(frameNum, cameraId, start_time, stop_time);
  if (0 != flag) {
    alert("播放失败，错误码：" + flag);
  }
}
//拖动播放（云检索录像）

export function SetCloudPos() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var pos = document.all.CloudPosText.value; //时间格式为：yyyy-mm-dd hh:mm:ss
  var flag = g_imosActivePlayer.IMOSAX_DragPlayII(frameNum, pos)
  if (0 != flag) {
    alert("拖动回放云检索失败，错误码：" + flag);
  }
}

//云检索录像下载
export function DoCloudDownload() {
  var cameraId = document.getElementById("CamIDText").value;
  var FileListObj = document.all.FileList;
  var file_name = FileListObj.value;
  var start_time;
  var stop_time;
  var time_array;
  // 从列表中获取当前选择的文件起止时间
  for (var i = 0; i < FileListObj.options.length; i++) {
    if (FileListObj.options[i].value == FileListObj.value) {
      time_array = FileListObj.options[i].innerText.split("~");
      start_time = time_array[0];
      stop_time = time_array[1];
      DebugAlert(start_time + ":" + stop_time);
      break;
    }
  }
  if ("" == time_array) {
    return;
  }
  gdownloadID = g_imosActivePlayer.IMOSAX_StartDownMediaStreamII(cameraId, start_time, stop_time);
  alert(gdownloadID);
  document.getElementById("CloudDownloadID").value = gdownloadID;

}
//云检索录像下载停止
export function DoCloudDownloadStop() {
  var downloadId = document.getElementById("CloudDownloadID").value;
  var flag = g_imosActivePlayer.IMOSAX_StopDownMediaStreamII(downloadId);
  if (0 != flag) {
    alert("停止下载失败，错误码：" + flag);
  } else {
    alert("停止下载成功！")
  }

}
//获取云检索录像下载信息
export function DoGetCloudDownloadInfo() {

  var downloadId = document.getElementById("CloudDownloadID").value;
  var flag = g_imosActivePlayer.IMOSAX_GetDownloadInfoII(downloadId);
  alert(flag);


}

//获取云检索录像下载进度
export function DoGetCloudDownloadPos() {

  var downloadId = document.getElementById("CloudDownloadID").value;
  var flag = g_imosActivePlayer.IMOSAX_GetDownloadPosII(downloadId);

  alert(flag);

}

//语音业务
//启动语音对讲
export function DoStartVoiceTalk() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var cameraId = document.getElementById("CamIDText").value;

  var flag = g_imosActivePlayer.IMOSAX_StartVoiceTalk(cameraId);
  if (0 == flag) {
    alert("启动语音对讲成功");
  } else {
    alert("启动语音对讲失败，错误码：" + flag);
  }
}

//停止语音对讲
export function DoStopVOiceTalk() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }

  var flag = g_imosActivePlayer.IMOSAX_StopVoiceTalk();

  if (0 == flag) {
    alert("停止语音对讲成功");
  } else {
    alert("停止语音对讲失败，错误码：" + flag);
  }

}

export function DoStartVoiceBroadcast() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }

  var vocBrdUnit = document.getElementById("VoiceParam").value;
  var vocBrdCode = "";

  var flag = g_imosActivePlayer.IMOSAX_StartVoiceBroadcast(vocBrdCode, vocBrdUnit);
  alert(flag);



}

export function DoStopVoiceBroadcast() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }

  var vocBrdUnit = document.getElementById("VoiceParam").value;
  var vocBrdCode = "";

  var flag = g_imosActivePlayer.IMOSAX_StopVoiceBroadcast(vocBrdCode, vocBrdUnit);

  alert(flag);

}

//音量调节
export function DoStopSound() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StopSound(frameNum);
  if (0 != flag) {
    alert("关闭声音失败，错误码：" + flag);
  } else {
    alert("关闭声音成功！")
  }

}

export function DoPlaySound() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_PlaySound(frameNum);
  if (0 != flag) {
    alert("开启声音失败，错误码：" + flag);
  } else {
    alert("开启声音成功！")
  }
}

export function DoAdjustAllWaveAudio() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }
  var AudioText = document.getElementById("AudioText").value;

  var flag = g_imosActivePlayer.IMOSAX_AdjustAllWaveAudio(AudioText);
  if (0 == flag) {
    alert("调节音量成功");
  } else {
    alert("调节音量失败，错误码：" + flag);
  }

}

export function DoGetAllWaveAudio() {
  if (!g_imosActivePlayer) {
    alert("未安装控件，请先安装后再使用本页面");
    return;
  }

  var waveAudio = g_imosActivePlayer.IMOSAX_GetAllWaveAudio();

  alert(waveAudio);


}


//抓拍

//抓拍图片将保存在指定路径下, 以当天日期为名称的文件夹内

export function DoSnatch() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_SnatchOnce(frameNum);
  if (0 != flag) {
    alert("抓拍失败，错误码：" + flag);
  }

}

export function DoStartSnatchSeries() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StartSnatchSeries(frameNum);
  if (0 != flag) {
    alert("连续抓拍失败，错误码：" + flag);
  } else {
    alert("连续抓拍成功！")
  }

}

export function DoStopSnatchSeries() {
  var frameNum = g_curFrameNum;
  frameNum = parseInt(frameNum, 10);
  if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
    alert("请先选择一个窗格");
    return;
  }
  var flag = g_imosActivePlayer.IMOSAX_StopSnatchSeries(frameNum);
  if (0 != flag) {
    alert("停止连续抓拍失败，错误码：" + flag);
  } else {
    alert("停止连续抓拍成功！")
  }
}

//================>功能函数---end

//================>事件处理函数event---start

/**
 * 窗格单击事件的处理函数
 */
export function dealEventClickFrame(ulFrameNum, pcFrameInfo) {
  //当前窗格
  g_curFrameNum = ulFrameNum;
  pcFrameInfo = pcFrameInfo.replaceAll("\"", "\'");
  var tmpXmlDoc = loadXML(pcFrameInfo);
  if (!tmpXmlDoc) {
    return;
  }
  //将需要的数据从xml中获取，方便后续使用
  var cameraID = tmpXmlDoc.selectNodes("//FrameInfo//CameraCode")[0];
  if (cameraID) {
    document.getElementById("CamIDText").value = cameraID.text;
    return;
  } else {
    document.getElementById("CamIDText").value = "未启动";
  }

}

//================事件处理函数event---end