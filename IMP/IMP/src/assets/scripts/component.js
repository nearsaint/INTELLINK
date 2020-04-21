// component

//获取父组件参数 props
export const GET_PROPS = (props) => {
  return new Promise((resolve, reject) => {
    if (props == undefined || props == '') {
      setTimeout(() => {
        GET_PROPS(props);
      }, 500)
    } else {
      resolve(props)
    }
  })
};

//获取路由参数 query
export const GET_QUERY = () => {

};