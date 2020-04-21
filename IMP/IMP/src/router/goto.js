// import vue-router
import Router from './router'

const goRouter = {
  home: () => {
    Router.push('/')
  },
  back: () => {
    window.history.length > 1 ? Router.go(-1) : Router.push('/')
  },
  to: (path, query) => {
    Router.push({
      path: path,
      query: query,
    })
  },

  query: (_this) => {
    return new Promise((resolve, reject) => {
      if (_this.$route.query) {
        console.log(_this.$route.query)
        resolve(_this.$route.query)
      } else {
        reject()
      }
    })
  }
}


export default goRouter