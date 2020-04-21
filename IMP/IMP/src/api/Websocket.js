import Router from 'src/router/router'
import Cookies from 'js-cookie'
import Storages from 'api/Storage'
import {
  Loading,
  Message
} from 'element-ui';

var websock = null
var webSocketCallback = null
var ws = 'ws://192.168.0.69:8080/'

// 初始化weosocket
function initWebSocket() {
  websock = new WebSocket(ws)
  websock.onmessage = function(e) {
    onmessage(e)
  };
  websock.onclose = function(e) {
    onclose(e)
  };
  websock.onopen = function(e) {
    onopen(e)
  };
  websock.onerror = function(e) {
    onerror(e)
  };
}

const onmessage = (data) => {
  console.log('webSocket on message!')
  console.log(data);
  webSocketCallback(data)
}
const onclose = (e) => {
  console.log('webSocket is closed!')
  // console.log(e);
}
const onopen = (e) => {
  console.log('webSocket is opened!');
  console.log(e);
}
const onerror = (e) => {
  console.log('WebSocket on error!');
  console.log(e);
  websock.onclose();
  initWebSocket();
}
const onsend = (data) => {
  websock.send(JSON.stringify(data))
}


// 实际调用的方法
function sendSock(data, callback) {
  webSocketCallback = callback
  if (websock.readyState === websock.OPEN) {
    onsend(data)
  } else if (websock.readyState === websock.CONNECTING) {
    setTimeout(function() {
      sendSock(data, callback)
    }, 1000)
  } else {
    setTimeout(function() {
      sendSock(data, callback)
    }, 1000)
  }
}

initWebSocket()

// 将方法暴露出去
export {
  sendSock
}