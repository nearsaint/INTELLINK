// import vuex
import store from './vuex/store'

const stroeJS = {
  _PROGRESS: (percent, status, show) => {
    if (show == true || show == false) {
      store.state.progress.show = show;
    }
    store.state.progress.precentage = percent;
    if (status == 'success' || status == 'warning' || status == 'exception') {
      store.state.progress.status = status
    } else {
      store.state.progress.status = undefined;
    }
  },
}
export default stroeJS