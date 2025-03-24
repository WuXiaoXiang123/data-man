
/**
 * 全局配置文件
 */
export default {
  title: '信息集成平台',
  logo: 'XG',
  key: 'camel',//配置主键,目前用于存储
  indexTitle: '信息集成平台',
  clientId: 'camel', // 客户端id
  clientSecret: 'camel_secret', // 客户端密钥
  tenantMode: false, // 是否开启租户模式
  tenantId: '000000', // 管理组租户编号
  captchaMode: false, // 是否开启验证码模式
  accountMode:false, //是否开始账号密码登录模式
  switchMode: true, // 是否开启部门切换模式
  lockPage: '/lock',
  tokenTime: 3000,
  tokenHeader: 'Camel-Auth',
  //http的status默认放行列表
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: '首页',
    value: '/wel/index',
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard',
    },
    group: [],
    close: false,
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children',
    },
  },

}

