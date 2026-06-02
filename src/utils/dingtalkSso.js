const DD_UA_REGEX = /DingTalk/i;

/**
 * 检测当前是否在钉钉浏览器环境
 * @returns {boolean}
 */
export function isInDingtalk() {
  // #ifdef H5
  return DD_UA_REGEX.test(navigator.userAgent);
  // #endif
  // #ifndef H5
  return false;
  // #endif
}

/**
 * 获取企业 corpId
 * 优先从 URL 查询参数 ?corpid= 获取，其次从环境变量 VITE_DINGTALK_CORP_ID 获取
 * @returns {string|null}
 */
export function getCorpId() {
  // #ifdef H5
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
  // #endif
  // #ifndef H5
  return null;
  // #endif
}

/**
 * 获取钉钉应用 clientId
 * @returns {string|null}
 */
export function getClientId() {
  // #ifdef H5
  return import.meta.env.VITE_DINGTALK_CLIENT_ID || null;
  // #endif
  // #ifndef H5
  return null;
  // #endif
}

/**
 * 向钉钉请求授权码（authCode）
 * 使用动态导入避免 HBuilderX 打包时解析 dingtalk-jsapi
 * @param {string} corpId - 企业 corpId
 * @param {string} clientId - 钉钉应用 clientId
 * @returns {Promise<string>} - 返回 authCode
 */
export async function requestDingtalkAuthCode(corpId, clientId) {
  // #ifdef H5
  const ddModule = await import('dingtalk-jsapi');
  const dd = ddModule.default || ddModule;
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
  // #endif
  // #ifndef H5
  return Promise.reject(new Error('非H5环境不支持钉钉免密登录'));
  // #endif
}
