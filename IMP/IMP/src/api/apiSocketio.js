/*
 *   vue-socket.io
 */
import _this from 'src/main.js'
import Store from 'src/vuex/store'
import Router from 'src/router/router'
import Cookies from 'js-cookie'
import Storages from 'api/Storage'

//配置vue-socket.io地址/空间名
// let location = '47.107.252.174';
let location = '192.168.0.172';
let port = '5000';
let space = 'data_refresh'
export const SOCKET_URL = 'http://' + location + ':' + port + '/' + space
export const SOCKET_URL_LOCALHOST = '/'

//监测事件
export const on = (event) => {
  console.log('ON: ' + event);
  return new Promise((reslove, reject) => {
    _this.sockets.subscribe(event, (data) => {
      // console.log(data)
      if (data == undefined || data == '') {
        reject(data);
      } else {
        reslove(data);
      }
    })
  });
};
//取消监测事件
export const off = (event) => {
  console.log('OFF: ' + event);
  _this.sockets.unsubscribe(event)
};

// 发送到事件  > EVENT_EMIT <
export const emit = (event, data) => {
  console.log('SEND: ' + event);
  _this.$socket.emit(event, data);
};

// 加入房间
export const join = (room) => {
  console.log(room);
  console.log(_this.$socket);
  // _this.$socket.join(room);
}

export const SOCKET_EVENTNAME = {
  /******************************************
  data
  数据操作
  ******************************************/
  DATA_GET: '获取数据',
}
