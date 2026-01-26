
/**
 * @description 根据数组内元素属性，来过滤掉重复的元素
 * @param {Array} array - 需要过滤的数组
 * @param {String} key - 对象内要过滤的属性key值
 *
 * @return {Array} array - 过滤后的数组
 */
export function arrayFilterRepeat (array, key ) {
	return [...new Map(array.map(item => [item[key], item])).values()]
}


/**
 * 向数组中指定下标“之前”插入一组元素，返回新数组（不改变原数组）
 *
 * @param {Array} sourceArray - 原始数组
 * @param {number} insertIndex - 要插入的位置索引（插入在此索引前）
 * @param {Array} insertArray - 要插入的新元素数组
 * @returns {Array} 返回新的合并数组
 */
export function arrayInsertBefore(sourceArray, insertIndex, insertArray) {
	return [
		...sourceArray.slice(0, insertIndex),  // 插入点之前的元素（不含当前索引）
		...insertArray,                         // 插入的新元素数组
		...sourceArray.slice(insertIndex)       // 插入点及之后的原数组部分
	];
}

/**
 * 向数组中指定下标“之后”插入一组元素，返回新数组（不改变原数组）
 *
 * @param {Array} sourceArray - 原始数组
 * @param {number} insertIndex - 要插入的位置索引（插入在此索引后）
 * @param {Array} insertArray - 要插入的新元素数组
 * @returns {Array} 返回新的合并数组
 */
export function arrayInsertAfter(sourceArray, insertIndex, insertArray) {
	return [
		...sourceArray.slice(0, insertIndex + 1), // 插入点之前的元素（含当前索引）
		...insertArray,                           // 插入的新元素数组
		...sourceArray.slice(insertIndex + 1)     // 插入点之后的原数组部分
	];
}
