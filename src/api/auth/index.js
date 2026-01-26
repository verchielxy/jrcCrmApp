import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';

const apiVersion = '/api/auth';

const authApi = {
  // 登录方法
  signin(username, password, captcha, captchaKey, cid) {
    return request({
      url: serverUrl + apiVersion + '/login',
      method: 'post',
      data: {
        username: username,
        password: password,
        captcha: captcha,
        checkKey: captchaKey,
        cid: cid,
      },
    });
  },
  // 退出方法
  signout() {
    return request({
      url: serverUrl + apiVersion + '/logout',
      method: 'get',
    });
  },
  // 获取验证码
  captcha(key) {
    return request({
      url: serverUrl + apiVersion + '/randomImage/{key}',
      method: 'get',
      params: {
        key: key,
      },
    });
  },
  // 获取用户详细信息
  user(isAuthUsed = false, searchParams) {
    return request({
      url: serverUrl + apiVersion + '/user/getUserInfo',
      method: 'get',
      data: {
        isAuthUsed: isAuthUsed,
        ...searchParams,
      },
    });
  },
  async userAsync(isAuthUsed = false, searchParams) {
    return await request({
      url: serverUrl + apiVersion + '/user/getUserInfo',
      method: 'get',
      data: {
        isAuthUsed: isAuthUsed,
        ...searchParams,
      },
    });
  },
  // 修改密码
  updatePassword(data) {
    return request({
      url: serverUrl + apiVersion +'/updatePassword',
      method: 'put',
      data: data,
    });
  },
  // 重置密码
  resetPassword(data) {
    return request({
      url: serverUrl + apiVersion +'/resetPassword',
      method: 'put',
      data: data,
    });
  },
  // 获取用户菜单和权限
  authoritys() {
    return request({
      url: serverUrl + '/api/v1/permission/getUserPermissionByToken',
      method: 'get',
    });
  },
  async authoritysAsync() {
    return await request({

      url: serverUrl + '/api/v1/permission/getUserPermissionByToken',
      method: 'get',
    });
  },
};

export default authApi;
