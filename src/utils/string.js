
/**
 * @description 字符串转换 首字母大写
 * @param {String} str - 要转换的字符串
 * @return {String} 转换的结果
 */
export function firstUpperCase(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @description 字符串转换 小驼峰
 * @param {String} str - 要转换的字符串
 * @return {String} 转换的结果
 */
export function lowerCamelCase(str) {
	return (str + "").replace(/([\:\-\_]+(.))/g, function(match) {
		return match.charAt(1).toUpperCase();
	});
}

/**
 * @description 字符串转换 大驼峰
 * @param {String} str - 要转换的字符串
 * @return {String} 转换的结果
 */
export function upperCamelCase(str) {
	return firstUpperCase(lowerCamelCase(str));
}

/**
 * @description 字符串转换 中划线
 * @param {String} str - 要转换的字符串
 * @return {String} 转换的结果
 */
export function hyphenate(str) {
	return (str + "").replace(/[A-Z]/g,
		function(match) {
			return "-" + match.toLowerCase();
		});
}

/**
 * @description html格式转换字符串
 * @param {String} htmlStr - 要转换的字符串
 * @return {String} 转换的结果
 */
export function htmlToString(htmlStr) {
	if (!htmlStr) {
		return ''
	}
	let str = htmlStr.replace(/<\/?.+?\/?>|\r|\n|\s*/g, '');
	let others = [
		'&nbsp;',
		'&amp;',
		'&lt;',
		'&gt;',
	];
	others.map(function (item) {
		str = str.replace('&nbsp;', '');
	})
	return str;
}
