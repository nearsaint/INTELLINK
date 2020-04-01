import axios from 'axios'
import store from 'src/vuex/store'
import router from 'src/router/router'
import Cookies from 'js-cookie'
import Storage from 'api/Storage'

// axios 配置
// axios.defaults.timeout = 3000
axios.defaults.baseURL = ''
axios.defaults.withCredentials = true

//http request 拦截器
// axios.interceptors.request.use(
//   config => {
//     const cookie = Cookies.get("lelefitToken");
//     console.log(cookie);
//     config.data = JSON.stringify(config.data);
//     // config.headers = {
//     //   'Content-Type': 'application/json'
//     // }
//     if (cookie) {
//       config.headers.Cookies = cookie;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(err);
//   }
// );


//http response 拦截器
// axios.interceptors.response.use(
//   response => {
//     if (response.data.errCode == 2) {
//       router.push({
//         path: "/login",
//         querry: {
//           redirect: router.currentRoute.fullPath
//         }
//       })
//     }
//     return response;
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )


// get
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
        params: params
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}

// post
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

// patch
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

// put
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

// delet
export function delet(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}