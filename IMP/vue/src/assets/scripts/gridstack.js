// import gridstack
import gridstack from 'assets/plugins/gridstack/gridstack.all.js'
// import _this from 'src/main.js'
import {
  Loading,
  Message,
  MessageBox
} from 'element-ui';
import Storages from 'api/Storage'
import {
  DASHBOARD_CONTAINER_GS,
  DASHBOARD_CONTAINER_LIST,
  DASHBOARD_CONTAINER_DEL
} from 'api/api'

//初始化
const GS_GRIDSTACK = (dom) => {
  return new Promise((resolve, reject) => {
    if (dom == undefined || dom == '') {
      Message.error('gridstack: dom is not find!');
      reject(dom)
    } else {
      dom.gridstack({
        verticalMargin: 10
      });
      console.log('GS初始化完成!')
      resolve(dom)
    }
  })
};
export const GS_CHANGE = () => {
  return new Promise((resolve, reject) => {
    dom.on('change', function(event, items) {
      console.log('gridstack: change');
      // console.log(event);
      // console.log(items);
      // console.log(list);
      for (let i in list) {
        for (let n in items) {
          if (list[i].id == items[n].id) {
            list[i].gs.gsH = items[n].height;
            list[i].gs.gsW = items[n].width;
            list[i].gs.gsX = items[n].x;
            list[i].gs.gsY = items[n].y;
          }
        }
      }
      GS_SAVE(list);
    });
  })
};
export const GS_ONEVENT = (dom, list) => {
  //监听change: position/size
  dom.on('change', function(event, items) {
    console.log('gridstack: change');
    // console.log(event);
    // console.log(items);
    // console.log(list);
    for (let i in list) {
      for (let n in items) {
        if (list[i].id == items[n].id) {
          list[i].gs.gsH = items[n].height;
          list[i].gs.gsW = items[n].width;
          list[i].gs.gsX = items[n].x;
          list[i].gs.gsY = items[n].y;
        }
      }
    }
    GS_SAVE(list);
  });

  //监听added: item添加后
  dom.on('added', function(event, items) {
    console.log('gridstack: added')
    // console.log(event);
    // console.log(items);
    // console.log(list);
    GS_SAVE(list)
  });

  //监听removed: item删除后
  dom.on('removed', function(event, items) {
    console.log('gridstack: removed')
    // console.log(event);
    // console.log(items);
    // console.log(list);
    GS_SAVE(list)
  });
};

//本地储存与服务器储存
export const GS_SAVE_BEFORE = (list) => {
  return new Promise((resolve) => {
    let arr = [];
    for (let i in list) {
      let item = list[i];
      arr.push({
        id: item.id,
        gs: {
          gsX: item.gs.gsX,
          gsY: item.gs.gsY,
          gsW: item.gs.gsW,
          gsH: item.gs.gsH,
        }
      })
    }
    resolve(arr);
  })
};
export const save_storage = (key, value) => {
  return new Promise((resolve) => {
    Storages.set(key, value);
    resolve(value)
  })
}
export const GS_SAVE = (list) => {
  GS_SAVE_BEFORE(list).then((arr) => {
    DASHBOARD_CONTAINER_GS({
      'list': arr
    }).then((response) => {
      console.log(response)
      console.log("gridstack: save to webServe is successful!")
    }).then(() => {
      save_storage('DASHBOARD_CONTAINER_GS', list).then(() => {
        console.log("gridstack: save to storages is successful!")
      })
    })
  })
};

//本地获取
export const GS_LOAD_SERVE = () => {
  return new Promise((resolve) => {
    DASHBOARD_CONTAINER_LIST({
      id: ''
    }).then((data) => {
      console.log(data);
      let list = data.data.res;
      resolve(list)
    })
  })
}
export const GS_LOAD_STORAGE = () => {
  return new Promise((resolve, reject) => {
    //本地储存获取
    let list_storage = Storages.get('DASHBOARD_CONTAINER_GS')
    if (list_storage != null || list_storage != undefined || list_storage != '' || list_storage.length > 1) {
      list = list_storage;
      resolve(list)
    } else {
      console.log('gridstack: load is not error from storages!');
      reject()
    }
  })
}

//监听add,remove,position,size后储存窗口;
export const GS_CREAT = (dom, list) => {
  dom = $(dom);
  GS_GRIDSTACK(dom).then(
    GS_ONEVENT(dom, list)
  )
};
//添加窗口
export const GS_ADD = (_this, item) => {
  return new Promise((resolve, reject) => {
    if (item == null || item == undefined || item.length < 1) {
      reject()
    } else {
      _this.list.push(item);
      _this.$nextTick(function() {
        let i = _this.$children.length - 1
        let el = _this.$children[i].$el
        let grid = $(_this.dom).data('gridstack');
        // console.log(el)
        // console.log(grid)
        grid.addWidget(el);
        resolve()
      })
    }
  })
};
export const GS_DELET = (option) => {
  return new Promise((resolve, reject) => {
    MessageBox.confirm('确定删除名称为:' + option.title + ',ID为' + option.id + '的窗口?', '确认信息', {
      distinguishCancelAndClose: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      MessageBox.prompt('请输入"DELETE",避免勿删,注意大写', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (value == 'DELETE') {
            return true
          } else {
            return false
          }
        },
        inputErrorMessage: '验证错误!'
      }).then(() => {
        DASHBOARD_CONTAINER_DEL({
          'id': option.id
        }).then((id) => {
          Message({
            type: 'success',
            message: '你的成功删除!'
          });
        })
        resolve();
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消'
        });
        reject();
      });
    }).catch(() => {
      Message({
        type: 'info',
        message: '已取消'
      });
      reject();
    })
  })

};
export const GS_ABLE = (_this, event) => {
  return new Promise((resolve, reject) => {
    let grid = $(_this.dom).data('gridstack');
    if (!event) {
      grid.movable('.grid-stack-item', false);
      grid.resizable('.grid-stack-item', false);
    } else {
      grid.movable('.grid-stack-item', true);
      grid.resizable('.grid-stack-item', true);
    }
    resolve(!event)
  })
};