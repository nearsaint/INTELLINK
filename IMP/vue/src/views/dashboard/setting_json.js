let json = {
  time_choose_options: [{
    value: 1,
    label: '时间',
  }, {
    value: 2,
    label: '班组(开发中)',
    disabled: true,
  }, {
    value: 3,
    label: '产品(开发中)',
    disabled: true,
  }, {
    value: 4,
    label: '客户(开发中)',
    disabled: true,
  }, {
    value: 5,
    label: '订单(开发中)',
    disabled: true,
  }],


  interval_options: [{
    value: 's',
    label: '秒'
  }, {
    value: 'm',
    label: '分'
  }, {
    value: 'h',
    label: '时'
  }, {
    value: 'D',
    label: '日'
  }, {
    value: 'W',
    label: '周'
  }, {
    value: 'M',
    label: '月'
  }, {
    value: 'Y',
    label: '年'
  }, {
    value: 'diy',
    label: '自定义'
  }],


  rule_options: [{
    value: 1,
    label: '平均值',
  }, {
    value: 2,
    label: '累计值',
  }],

  dataKind_options: [{
    value: 'model',
    label: '数学模型'
  }, {
    value: 'process',
    label: '设备参数(开发中)',
    disabled: true,
  }, {
    value: 'log',
    label: '日志条目(开发中)',
    disabled: true,
  }, {
    value: 'media',
    label: '多媒体(开发中)',
    disabled: true,
  }, {
    value: 'table',
    label: '表格(开发中)',
    disabled: true,
  }, ],

  type_options: [{
    value: 1,
    label: '整型数据',
  }, {
    value: 2,
    label: '浮点型数据',
  }, {
    value: 3,
    label: '布尔量数据',
  }, {
    value: 4,
    label: '字符串数据',
  }, {
    value: 5,
    label: 'JSON数据',
  }],

  real_options: [{
    value: 1,
    label: '实时数据',
  }, {
    value: 0,
    label: '历史数据',
  }]
}

// <ul>
//   <h5>选择设备参数</h5>
//   <li>
//     <span>产线</span>
//     <div>
//       <el-select size="medium" placeholder="请选择">
//         <el-option>1号线</el-option>
//       </el-select>
//     </div>
//   </li>
//   <li>
//     <span>设备组</span>
//     <div>
//       <el-select size="medium" placeholder="请选择">
//         <el-option>S1</el-option>
//         <el-option>S2</el-option>
//         <el-option>M1</el-option>
//         <el-option>M2</el-option>
//         <el-option>M3</el-option>
//         <el-option>电表</el-option>
//         <el-option>水表</el-option>
//         <el-option>其他</el-option>
//       </el-select>
//     </div>
//   </li>
//   <li>
//     <span>设备</span>
//     <div>
//       <el-select size="medium" placeholder="请选择">
//         <el-option>滚轮</el-option>
//         <el-option>喷头</el-option>
//         <el-option>管道</el-option>
//       </el-select>
//     </div>
//   </li>
//   <li>
//     <span>参数</span>
//     <div>
//       <el-select size="medium" placeholder="请选择">
//         <el-option>温度#1</el-option>
//         <el-option>温度#2</el-option>
//         <el-option>温度#3</el-option>
//         <el-option>温度#4</el-option>
//       </el-select>
//     </div>
//   </li>
// </ul>

export default json