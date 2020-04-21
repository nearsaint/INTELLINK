// import echart
import Echarts from 'echarts'
// import _this from 'src/main.js'
import {
  Loading,
  Message
} from 'element-ui';

//初始化
export const CHART_INIT = (_this) => {
  return new Promise((resolve, reject) => {
    let dom = _this.CHART_ID;
    if (dom == undefined || dom == '') {
      Message.error('chart: dom is not find!');
      reject(_this.chart)
    } else {
      _this.chart = Echarts.init(document.getElementById(dom));
      console.log('chart: ' + dom + '初始化完成!')
      resolve(_this.chart)
    }
  })
};

export const CHART_SET = (chart, options) => {
  return new Promise((resolve, reject) => {
    chart.setOption(options);
    resolve(chart)
  })
};

export const CHART_CLICK = (chart, fun) => {
  return new Promise((resolve, reject) => {
    chart.on('click', function() {
      fun();
      resolve()
    });
  });
};

export const CHART_RESIZE = (chart) => {
  return new Promise((resolve, reject) => {
    chart.resize();
    resolve(chart)
  })
}