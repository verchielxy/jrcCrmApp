export function reloadCurrentPage() {
	const pages = getCurrentPages(); // 获取当前页面栈
	const currentPage = pages[pages.length - 1]; // 当前页面

	if (!currentPage) {
		console.warn('无法获取当前页面');
		return;
	}

	const route = currentPage.route;
	const options = currentPage.options || {};

	// 拼接查询参数
	const queryString = Object.keys(options)
	.map(key => `${key}=${encodeURIComponent(options[key])}`)
	.join('&');

	const fullUrl = `/${route}${queryString ? '?' + queryString : ''}`;

	uni.navigateTo({
		url: fullUrl
	});
}
