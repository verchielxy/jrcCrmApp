import { isNullOrUndefined, floatDiv } from './tools';

/**
 * @description infos 数据处理
 * @param {Array} infos - 计算数值1
 * @param {JSON} json - 计算数值2
 * @return {Array} 返回格式化后的infos数组
 */
export function infosFormat (infos, json) {
	let format = infos;
	format.map(function (item) {
		if (!isNullOrUndefined(json[item.name])) {
			if (item.format && json[item.name] > item.format) {
				item.value = floatDiv(json[item.name], item.format).toFixed(2);
				if (item.formatUnit) {
					item.unit = item.formatUnit;
				}
			} else {
				item.value = json[item.name];
			}
		}
	})

	return format;
}
