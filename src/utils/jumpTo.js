/**
 * 页面跳转封装
 * @param {Object} options
 * @param {String} options.url 页面路径（不包含 query）
 * @param {Object} options.params 参数对象
 * @param {String} [options.type=navigateTo] 跳转类型：navigateTo / redirectTo / reLaunch / switchTab
 */
export default function ({ url, params = {}, type = 'navigateTo' }) {
	if (!url) {
		console.error('jumpTo 缺少 url')
		return
	}

	// 拼接参数
	const query = Object.keys(params)
	.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
	.join('&')

	const fullUrl = query ? `${url}?${query}` : url

	// 选择跳转方式
	if (type === 'switchTab') {
		uni.switchTab({ url: fullUrl })
	} else if (type === 'reLaunch') {
		uni.reLaunch({ url: fullUrl })
	} else if (type === 'redirectTo') {
		uni.redirectTo({ url: fullUrl })
	} else {
		uni.navigateTo({ url: fullUrl })
	}
}
