import baseURL from '@api/serviceUrl.js';
import { getStorage } from '@/utils/storage';
import { isNullOrUndefined } from '@utils/tools';
import { getValueByPath } from '@utils/obj';
import constant from '@/constant';
import authConfig from '@/config/auth';
import configs from '@/config/configs';

function replaceUrlParams(url, params = {}) {
	return url.replace(/\{(\w+)\}/g, (_, key) => {
		const value = params[key];
		if (value === undefined) {
			console.warn(`缺少参数：${key}`);
			return `{${key}}`; // 保留原样
		}
		delete params[key]; // 删除已经替换的参数，剩下的用于 query/body
		return encodeURIComponent(value);
	});
}

// formatHandle 处理函数
function formatHandle(formatAppend, page, size, item, index) {
	// key
	if (formatAppend.key === 'auto') {
		item.key = (page - 1) * size + (index + 1);
	} else if (formatAppend.key) {
		item.key = item[formatAppend.key];
	}

	// serial
	if (formatAppend.serial) {
		item.serial = (page - 1) * size + (index + 1);
	}

	// showText
	if (formatAppend.showText) {
		formatAppend.showText.map(function(rows, index) {
			item[ rows[0] ] = getValueByPath(item, rows[1]);
		})
	}

	// constantText
	if (formatAppend.constantText) {
		formatAppend.constantText.map(function(rows, index) {
			if (Array.isArray(item[ rows[2] ])) {
				let arr = item[ rows[2] ].map(function(rowItem) {
					return constant.convertText(rows[1], getValueByPath(item, rowItem));
				})
				item[ rows[0] ] = arr.join(rows[3] ? rows[3] : ' , ');
			} else {
				item[ rows[0] ] = constant.convertText(rows[1], getValueByPath(item, rows[2]));
			}
		})
	}

	// constant
	if (formatAppend.constant) {
		formatAppend.constant.map(function(rows, index) {
			item[ rows[0] ] = constant.convertItem(rows[1], getValueByPath(item, rows[2]));
		})
	}
}

/**
 * 网络请求工具类
 * requestConfig
 *
 * @param {String} url 请求网址
 * @param {String} method 请求方法
 * @param {Object} params 替换url中 /{key}/ -> /{value}/
 * @param {Object} data GET请求自动放在url?key=value，POST请求自动放在RequestBody中
 * @param {String} responseType 请求的地址返回的结果类型 json | text | arraybuffer | raw ，默认 json
 * @param {Boolean} format 是否对返回数据格式化 true | false ，默认 true
 * @param {String} formatType 请求的地址返回的结果类型 single | multiple, 预留字段暂时无用处
 * @param {String | Function} formatDataKey 对返回数据进行预设值好的格式化，设置需要格式化response对应的数据的key值
 * formatDataKey - String : 'result.records'
 * formatDataKey - Function : function (res)
 * @param {Object} formatAppend 对返回数据进行预设值好的格式化
 * 配置项举例 {
 *  key: 'key',
 *  serial: true,
 *  showText: [
 *    ['industryId', 'industry.id'],
 *    ['industryText', 'industry.name'],
 *  ],
 *  constantText: [
 *    ['cycleText', constant.BUSINESS.EMISSIONS_ACCOUNTING.CYCLE, 'cycle'],
 *    ['statusText', constant.BUSINESS.EMISSIONS_ACCOUNTING.CYCLE, 'status'],
 *  ],
 *  constant: [
 *    ['statusConstant', constant.BUSINESS.EMISSIONS_ACCOUNTING.STATUS, 'status'],
 *  ],
 * }
 * @param {Function} formatFunction 对返回数据进行格式化的函数 (response)
 * @param {Function} prefixFunction 对返回数据进行第一步前置处理 (response)
 */

export default function request(
	{
		url,
		method = 'GET',
		params = {},
		data = {},
		header = {},
		responseType = 'json',
		format = true,
		formatType = 'multiple',
		formatDataKey = 'result.records',
		formatAppend = {},
		formatFunction,
		prefixFunction,
		timeout,
	}
) {
	let finalUrl = replaceUrlParams(url, { ...params });

	if (method === 'GET' && Object.keys(params).length) {
		const query = Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
		finalUrl += (finalUrl.includes('?') ? '&' : '?') + query;
	}

	return new Promise((resolve, reject) => {
		uni.request({
			url: finalUrl,
			method: method,
			data: data,
			header: {
				[authConfig.tokenKey]: getStorage(authConfig.tokenKey),
				'Content-Type': 'application/json;charset=utf-8',
				...header,
			},
			timeout: isNullOrUndefined(timeout) ? authConfig.timeout : timeout,
			success: (response) => {
				const responseCode = response.statusCode;
				const responseBody = response.data;
				const message = response.data.message || '服务端未知错误';

				if (method === 'post' || method === 'put' || method === 'patch') {
					if (!isNullOrUndefined(data) && isNullOrUndefined(params)) {
						params = data;
					}
				}

				if (responseType === 'json') {
					if (responseCode === 200 && (responseBody.code === 0 || responseBody.code === 200) ) {
						// 请求成功执行
						if (!isNullOrUndefined(prefixFunction)) {
							prefixFunction(responseBody);
						}

						// formatAppend 处理
						if (format && !isNullOrUndefined(formatAppend)) {
							let dataRows = [];
							if (typeof formatDataKey === 'function') {
								dataRows = formatDataKey(responseBody);
							} else {
								dataRows = getValueByPath(responseBody, formatDataKey);
							}

							if (!isNullOrUndefined(dataRows)) {
								let page = params && params.page !== undefined ? params.page : 1;
								let size = params && params.size !== undefined ? params.size : 20;

								if (Array.isArray(dataRows)) {
									dataRows.map(function (item, index) {
										formatHandle(formatAppend, page, size, item, index);
									})
								} else if (typeof dataRows === 'object') {
									formatHandle(formatAppend, page, size, dataRows, 0);
								}

							} else {
								console.log('没有找到dataRows，请检查format配置项', dataRows);
							}
						}

						if (!isNullOrUndefined(formatFunction)) {
							formatFunction(responseBody);
						}

						resolve(responseBody);
					} else if (responseCode === 401) {
						uni.showToast({
							title: '请重新登录',
							icon: 'none'
						});
						uni.reLaunch({
							url: configs.logoutOptions.redirectPage,
						})
						reject(response);
					} else {
						uni.showToast({
							title: message || '请求失败',
							icon: 'none'
						});
						reject(response);
					}
				} else if (responseType === 'blob') { // 二进制文件类型
					resolve(response);
				} else if (responseType === 'text') { // 文本类型
					resolve(response);
				} else if (responseType === 'arraybuffer') { // 二进制类型
					resolve(response);
				} else if (responseType === 'raw') { // 自定义类型
					resolve(response);
				}

				reject('前端未知responseType类型');
			},
			fail: (error) => {
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
				reject(error);
			}
		})
	})
}
