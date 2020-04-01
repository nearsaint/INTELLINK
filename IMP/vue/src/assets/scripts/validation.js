const Validation = {};
Validation.install = function(Vue, options) {
  /**
   * 参数 item
   * required true  必填项
   * maxLength  字符串的最大长度
   * min 和 max 必须同时给 min < max  type=number
   * type 手机号 mobile
   *      邮箱   email
   *      网址   url
   * */
  Vue.prototype.$rules = function(e) {
    let rules = [];
    if (e.required) {
      rules.push({
        required: true,
        message: '该输入项为必填项!',
        trigger: 'blur'
      });
    }
    if (e.maxLength) {
      rules.push({
        min: 1,
        max: e.maxLength,
        message: '最多输入' + e.maxLength + '个字符!',
        trigger: 'blur'
      })
    }
    if (e.min && e.max) {
      rules.push({
        min: e.min,
        max: e.max,
        message: '字符长度在' + e.min + '至' + e.max + '之间!',
        trigger: 'blur'
      })
    }
    if (e.type) {
      let type = e.type;
      switch (type) {
        case 'email':
          rules.push({
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          });
          break;
        case 'phone':
          rules.push({
            pattern: /^1[34578]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          });
          break;
        case 'card':
          rules.push({
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: '请输入15或者18位身份证号码',
            trigger: 'blur'
          });
          break;
        case 'num':
          rules.push({
            pattern: /^[1-9]\d*$/,
            message: '请输入非0的整数',
            trigger: 'blur'
          });
          break;
        case 'pwd':
          rules.push({
            pattern: /^[^\u4e00-\u9fa5\s]{6,20}$/,
            message: '6-20位任意字符',
            trigger: 'blur'
          });
          break;
        case 'mac':
          rules.push({
            pattern: /^[A-F0-9]{2}(-[A-F0-9]{2}){5}$|^[A-F0-9]{2}(:[A-F0-9]{2}){5}$/,
            message: '请输入正确的mac地址',
            trigger: 'blur'
          });
          break;
        case 'ip':
          rules.push({
            pattern: /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
            message: '请输入正确的ip地址',
            trigger: 'blur'
          });
          break;
        case 'url':
          rules.push({
            pattern: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\’:+!]*([^<>\"])*$/,
            message: '请输入正确的链接地址',
            trigger: 'blur'
          });
          break;
        case 'zipCode':
          rules.push({
            pattern: /^[0-9]{6}$/,
            message: '请输入正确的邮政编码',
            trigger: 'blur'
          });
          break;
        case 'onlyCN':
          rules.push({
            pattern: /^[\u4e00-\u9fa5]+$/,
            message: '请输入中文',
            trigger: 'blur'
          });
          break;
        case 'onlyEN':
          rules.push({
            pattern: /^[A-Za-z]+$/,
            message: '请输入中文',
            trigger: 'blur'
          });
          break;
        case 'checkMore':
          rules.push({
            type: 'array',
            message: '请至少选择一项',
            trigger: 'change'
          });
          break;
        case 'checkOnly':
          rules.push({
            message: '请选择',
            trigger: 'change'
          });
          break;
        default:
          rule.push({});
          break;
      }
    }
    return rules;
  };
};

module.exports = Validation;