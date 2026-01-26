/**
 * 项目默认配置项
 */

export default {
  /* 网站基础信息 */
  websiteInfos: {
    title: '金润昌全流程管理平台', // 网站 title
    loginTitle: '金润昌全流程平台',
    name: '金润昌全流程管理平台', // 网站名称
    phone: '', // 网站固话
    cellPhone: '', // 网站手机
    email: '', // 网站邮箱
    company: '', // 网站公司名称
    address: '', // 网站地址
    copyrights: 'Copyright © 2024 宁夏金润昌科技有限公司', // 网站备案
  },

  /* 首页配置 */
  homeOptions: {
    page: '/pages/home/index',
  },
  /* 登录后跳转页面的route page */
  loginOptions: {
    page: '/pages/auth/signin/index',
    redirectPage: '/pages/home/index',
  },
  /* 登出后跳转页面的route page */
  logoutOptions: {
    page: '/pages/logout/index',
    redirectPage: '/pages/auth/signin/index',
  },
};
