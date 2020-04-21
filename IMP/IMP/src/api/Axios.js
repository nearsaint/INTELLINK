import Axios from 'axios'
import Store from 'src/vuex/store'
import Router from 'src/router/router'
import Cookies from 'js-cookie'
import Storages from 'api/Storage'
import {
  Loading,
  Message
} from 'element-ui';
let tokenKey = Store.state.tokenKey;
let loadingOption = {
  fullscreen: true,
  background: 'rgba(255, 255, 255, 0.86)'
}

// axios 配置
Axios.defaults.timeout = 10000
Axios.defaults.baseURL = ''
Axios.defaults.withCredentials = true

//http request 请求拦截器
Axios.interceptors.request.use(
  config => {
    const token = Cookies.get(tokenKey);
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      config.headers.Cookies = token;
    }
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);


//http response 返回拦截器
Axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.errno == 200) {
        return Promise.resolve(response)
      } else if (response.data.errno == undefined) {
        return Promise.resolve(response)
      } else {
        return Promise.reject(response)
      }
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response.status) {
      Message.error('请求失败, 请重试或者刷新页面, 错误代码:' + error.response.status);
      switch (error.response.status) {
        case 401:
          Router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          break
      }
      return Promise.reject(error)
    }
  }
)

function _asiox(method, url, data) {
  let loading = Loading.service(loadingOption);
  return new Promise((reslove, reject) => {
    if (method == 'get') {
      Axios.get(url, {
        params: data
      }).then(response => {
        loading.close();
        reslove(response);
      }).catch(response => {
        loading.close();
        reject(response);
      });
    } else {
      Axios({
        method: method,
        url: url,
        data: data
      }).then(response => {
        loading.close();
        reslove(response);
      }).catch(response => {
        loading.close();
        reject(response);
      });
    }
  });
}

const http = {
  get: (url, data) =>
    _asiox('get', url, data),
  post: (url, data) =>
    _asiox('post', url, data),
  put: (url, data) =>
    _asiox('put', url, data),
  patch: (url, data) =>
    _asiox('patch', url, data),
  delete: (url, data) =>
    _asiox('delete', url, data),
}

export default http