import * as dd from 'dingtalk-jsapi';

const DD_UA_REGEX = /DingTalk/i;

/**
 * 检测当前是否在钉钉浏览器环境
 * @returns {boolean}
 */
export function isInDingtalk() {
  return DD_UA_REGEX.test(navigator.userAgent);
}

/**
 * 获取企业 corpId
 * 优先从 URL 查询参数 ?corpid= 获取，其次从环境变量 VITE_DINGTALK_CORP_ID 获取
 * @returns {string|null}
 */
export function getCorpId() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const corpIdFromUrl = urlParams.get('corpid');
    if (corpIdFromUrl) {
      return corpIdFromUrl;
    }
  } catch (e) {
    // URLSearchParams 在某些环境可能不支持，降级处理
  }
  return import.meta.env.VITE_DINGTALK_CORP_ID || null;
}

/**
 * 获取钉钉应用 clientId
 * @returns {string|null}
 */
export function getClientId() {
  return import.meta.env.VITE_DINGTALK_CLIENT_ID || null;
}

/**
 * 向钉钉请求授权码（authCode）
 * @param {string} corpId - 企业 corpId
 * @param {string} clientId - 钉钉应用 clientId
 * @returns {Promise<string>} - 返回 authCode
 */
export function requestDingtalkAuthCode(corpId, clientId) {
  return new Promise((resolve, reject) => {
    dd.requestAuthCode({
      corpId: corpId,
      clientId: clientId,
      onSuccess: (result) => {
        resolve(result.code);
      },
      onFail: (err) => {
        reject(err);
      },
    });
  });
}
