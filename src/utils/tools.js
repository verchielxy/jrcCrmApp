import { Base64, isValid } from 'js-base64';
import { Decimal } from 'decimal.js';

/**
 * @description 字符串转换为base64格式
 * @param {String} str - 要转换的字符串
 * @param {Boolean} force - 强制转换
 * @return {String} formatStr - base64字符串
 */
export function base64Encode (str, force = false) {
	let formatStr = str;
	formatStr = Base64.encode(str);
	return formatStr;
}

/**
 * @description base64字符串转换为普通字符串
 * @param {String} str - 要转换的字符串
 * @param {Boolean} force - 强制转换
 * @return {String} formatStr - 普通字符串
 */
export function base64Decode (str, force = false) {
	let formatStr = str;
	formatStr = Base64.decode(str);
	return formatStr;
}

/**
 * @description 是否是 null || undefined
 * @param {String | Object} value - 要判断的字符串
 * @return {Boolean} 是或者否
 */
export function isNullOrUndefined(value) {
	return value === null || value === undefined;
}

/**
 * @description 是否是数字
 * @param {String} value - 要判断的字符串
 * @return {Boolean} 是或者否
 */
export function isNumber(value) {
	return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * 判断一个值是否为“百分比字符串”（如 "50%"、" 12.5% "）
 * @param {any} value - 要判断的值
 * @returns {boolean} 若 value 是合法的百分比字符串则返回 true，否则 false
 */
export function isPercentString(value) {
	return (
		typeof value === 'string' &&
		value.trim().endsWith('%') &&
		!isNaN(value.trim().slice(0, -1))
	);
}

/**
 * @description 遍历循环树结构 深度优先遍历 递归方法（DFS）
 * @param {Array} tree - 树状结构图数组
 * @param {Function} func - func(node) 自定义处理函数闭包
 * @param {String} childrenKey - tree接口的childrenKey
 * @return {Boolean} 格式化后的树状结构图数组
 */
export function treeIterator (tree, func, childrenKey = 'children') {
	tree.forEach((node) => {
		func(node);
		if (node[childrenKey]) {
			treeIterator(node[childrenKey], func, childrenKey);
		}
	})
}

/**
 * @description 遍历循环树结构 深度优先遍历 循环方法（DFS）
 * @param {Array} tree - 树状结构图数组
 * @param {Function} func - func(node) 自定义处理函数闭包
 * @param {String} childrenKey - tree接口的childrenKey
 * @return {Boolean} 格式化后的树状结构图数组
 */
export function treeIteratorDfs (tree, func, childrenKey = 'children') {
	let node, curTree = [...tree]
	while ((node = curTree.shift())) {
		func(node)
		node[childrenKey] && curTree.unshift(...node[childrenKey])
	}
}

/**
 * @description 遍历循环树结构 广度优先遍历 循环方法（BFS）
 * @param {Array} tree - 树状结构图数组
 * @param {Function} func - func(node) 自定义处理函数闭包
 * @param {String} childrenKey - tree接口的childrenKey
 * @return {Boolean} 格式化后的树状结构图数组
 */
export function treeIteratorBfs(tree, func, childrenKey = 'children') {
	let node, curTree = [...tree];
	while ((node = curTree.shift())) {
		func(node);
		node[childrenKey] && curTree.push(...node[childrenKey]);
	}
}

/**
 * @description 遍历循环树结构 返回节点所有的父级集合
 * @param {Array} tree - 树状结构图数组
 * @param {String} findKey - 树状结构图当中，节点当中要找的对应的key
 * @param {String} findValue - 树状结构图当中，节点当中要找的值
 * @param {String} childrenKey - tree接口的childrenKey
 * @return {Array} 返回一个包含所有父级节点的数组
 */
export function treeFindParents (tree, findKey, findValue, childrenKey = 'children') {
	for (let i = 0; i < tree.length; i++) {
		const item = tree[i];

		if(item[findKey] === findValue){
			return [ item ];
		}

		if(item[childrenKey] && item[childrenKey].length > 0){
			let node = treeFindParents(item[childrenKey], findKey, findValue, childrenKey);
			//当当前item的有返回数组时则表示已经找到目标（id）节点item二级，node三级
			// node表示目标节点，而当前item则是第二次执行getParentId函数的item，因为第三次调用的getParentId函数在堆栈中被(return)去除掉了
			if(node !== undefined){
				return node.concat(item); //这里每return一次堆栈就会去除一次最顶层函数
			}
		}
	}
}

/**
 * 在树中查找节点，并去掉指定属性
 *
 * @param {Array} tree - 树状数组
 * @param {string} matchKey - 用来匹配的属性名 (如 'id' 或 'name')
 * @param {any} matchValue - 查找值
 * @param {Array<string>} omitKeys - 查找到的节点要去除的属性 (如 ['children'])
 * @param {string} childrenKey - 子节点字段名 (如 'children' 或 'child')
 * @returns {Object|null} 找到的节点（新对象，不影响原始数据）
 */
export function treeFindNode(tree, matchKey, matchValue, omitKeys = [], childrenKey = 'children') {
	function dfs(nodes) {
		for (const node of nodes) {
			if (node[matchKey] === matchValue) {
				// 构建新对象，排除掉 omitKeys
				const result = {};
				for (const key in node) {
					if (!omitKeys.includes(key)) {
						result[key] = node[key];
					}
				}
				return result;
			}
			if (node[childrenKey]) {
				const found = dfs(node[childrenKey]);
				if (found) return found;
			}
		}
		return null;
	}

	return dfs(tree);
}

/**
 * 在树中查找多个匹配节点，并去掉指定属性
 *
 * @param {Array} tree - 树状数组
 * @param {string} matchKey - 用来匹配的属性名 (如 'id' 或 'name')
 * @param {Array<any>} matchValues - 查找值数组
 * @param {Array<string>} omitKeys - 查找到的节点要去除的属性 (如 ['children'])
 * @param {string} childrenKey - 子节点字段名 (如 'children' 或 'child')
 * @returns {Array<Object>} 找到的节点数组（新对象，不影响原始数据）
 */
export function treeFindNodes(tree, matchKey, matchValues = [], omitKeys = [], childrenKey = 'children') {
	const results = [];

	function dfs(nodes) {
		for (const node of nodes) {
			if (matchValues.includes(node[matchKey])) {
				// 构建新对象，排除掉 omitKeys
				const result = {};
				for (const key in node) {
					if (!omitKeys.includes(key)) {
						result[key] = node[key];
					}
				}
				results.push(result);
			}
			if (node[childrenKey]) {
				dfs(node[childrenKey]);
			}
		}
	}

	dfs(tree);
	return results;
}

/**
 * 根据指定字段匹配值搜索树节点，并返回包含匹配节点及其父链路的剪枝树
 *
 * @param {Array} tree - 原始树数据
 * @param {String} matchKey - 要匹配的字段名，例如 'name' 或 'age'
 * @param {any} matchValue - 要匹配的值
 * @param {String} childrenKey - 子节点的 key，默认 'children'
 * @param {String} mode - 查询模式 'exact' 精确匹配 | 'like' 模糊匹配，默认 'like'
 * @returns {Array} 剪枝后的新树
 */
export function treeFilterByField(tree, matchKey, matchValue, childrenKey = 'children', mode = 'like') {
	function isMatch(value) {
		if (mode === 'exact') return value === matchValue;
		if (mode === 'like') return String(value).includes(String(matchValue));
		return false;
	}

	function dfs(node) {
		let matched = isMatch(node[matchKey]);
		let newNode = { ...node };

		if (node[childrenKey] && node[childrenKey].length > 0) {
			let filteredChildren = [];
			for (let child of node[childrenKey]) {
				let res = dfs(child);
				if (res) {
					filteredChildren.push(res);
					matched = true; // 子节点匹配也保留父节点
				}
			}
			if (filteredChildren.length > 0) {
				newNode[childrenKey] = filteredChildren;
			} else {
				delete newNode[childrenKey];
			}
		} else {
			delete newNode[childrenKey];
		}

		return matched ? newNode : null;
	}

	let result = [];
	for (let item of tree) {
		let res = dfs(item);
		if (res) result.push(res);
	}
	return result;
}

/**
 * 清洗树结构，保留指定字段，并兼容多个子节点键名
 *
 * @param {Object|Array} inputTree - 原始树结构（对象或数组）
 * @param {string[]} keepKeys - 需要保留的字段名
 * @param {string[]} childKeys - 所有可能的子节点 key 名（如 ['children', 'data', 'kids']）
 * @returns {Object|Array} - 清洗后的树
 */
export function cleanTree(inputTree, keepKeys = ['id', 'name'], childKeys = ['children']) {
	const isArray = Array.isArray(inputTree);

	const processNode = (node) => {
		const cleaned = {};

		// 保留指定字段
		keepKeys.forEach(key => {
			if (node.hasOwnProperty(key)) {
				cleaned[key] = node[key];
			}
		});

		// 查找实际存在的子节点键（多个候选中）
		for (const key of childKeys) {
			if (Array.isArray(node[key]) && node[key].length > 0) {
				cleaned[key] = node[key].map(processNode); // 保留原有 key 名
				break; // 只处理第一个匹配的 key
			}
		}

		return cleaned;
	};

	if (isArray) {
		return inputTree.map(processNode);
	} else if (typeof inputTree === 'object') {
		return processNode(inputTree);
	} else {
		return inputTree;
	}
}

/**
 * @description 把一个数组按数量切分成一个新的数组
 * @param {Array} array - 需要切分的数组
 * @param {Number} count - 要切分的数量
 * @return {Array} 返回一个新的数组
 */
export function arrayGroupByCount(array, count) {
	let result = [];
	for (let i = 0; i < array.length; i += count) {
		result.push(array.slice(i, i + count));
	}
	return result;
}

/**
 * @description 随机数
 * @return {Number} 返回一个随机数
 */
export function randomNumber() {
	let min = 1;
	let max = 100;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @description 自定义随机数
 * @param {Number} min - 随机数的最小值
 * @param {Number} max - 随机数的最大值
 * @return {Number} 返回一个随机数
 */
export function randomCustomNumber(min, max) {
	return parseInt(Math.random() * (max - min + 1) + min, 10);
}

/**
 * @description 根据数字，返回该数字进一位的最小数字，比如 123 返回 1000， 67 返回 100
 * @param {Number} number - 随机数的最小值
 * @return {Number} 返回一个随机数
 */
export function roundUpToNearestPowerOfTen(number) {
	const power = Math.pow(10, Math.floor(Math.log10(number))); // 找到最接近的10的幂次
	return power * 10;
}

/**
 * @description 浮点数加法
 * @param {Number} arg1 - 计算数值1
 * @param {Number} arg2 - 计算数值2
 * @return {Number} 返回计算结果
 */
export function floatAdd(arg1, arg2) {
	return new Decimal(arg1).add(new Decimal(arg2)).toNumber();
}

/**
 * @description 浮点数减法
 * @param {Number} arg1 - 计算数值1
 * @param {Number} arg2 - 计算数值2
 * @return {Number} 返回计算结果
 */
export function floatSub(arg1, arg2) {
	return new Decimal(arg1).sub(new Decimal(arg2)).toNumber();
}

/**
 * @description 浮点数乘法
 * @param {Number} arg1 - 计算数值1
 * @param {Number} arg2 - 计算数值2
 * @return {Number} 返回计算结果
 */
export function floatMul(arg1, arg2) {
	return new Decimal(arg1).mul(new Decimal(arg2)).toNumber();
}

/**
 * @description 浮点数除法
 * @param {Number} arg1 - 计算数值1
 * @param {Number} arg2 - 计算数值2
 * @return {Number} 返回计算结果
 */
export function floatDiv(arg1, arg2) {
	return new Decimal(arg1).div(new Decimal(arg2)).toNumber();
}
