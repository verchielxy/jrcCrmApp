import moment from 'moment';

/**
 * @description 根据给定的日期和type方式，返回开始日期和结束日期
 * @param {Number} since - 时间单位，整型，正负
 * @param {String} sinceType - 时间单位类型，day month year
 * @param {String} date - 根据date日期去计算开始日期和结束日期，默认为今日日期
 * @param {String} format - 时间字符串格式化格式，默认YYYY-MM-DD
 * @return {Object} 返回对象，包含开始日期和结束日期
 */
export function getStartAndEnd (since, sinceType = 'day', date = moment().format('YYYY-MM-DD'), format = 'YYYY-MM-DD') {
	let start = moment(date).add(since, sinceType);
	let end = moment(date);

	return {start: moment(start).format(format), end: moment(end).format(format)};
}

/**
 * @description 根据给定的日期和type方式，返回开始日期和结束日期
 * @param {String} type - 选项 nowWeek nowMonth nowYear
 * @param {String} date - 根据date日期去计算开始日期和结束日期，默认为今日日期
 * @param {String} format - 时间字符串格式化格式，默认YYYY-MM-DD
 * @return {Object} 返回对象，包含开始日期和结束日期
 */
export function getStartAndEndByType (type, date = moment().format('YYYY-MM-DD'), format = 'YYYY-MM-DD') {
	let start, end;

	if (type === 'nowWeek') {
		start = moment(date).startOf('week');
		end = moment(date).endOf('week');
	} else if (type === 'nowMonth') {
		start = moment(date).startOf('month');
		end = moment(date).endOf('month');
	} else if (type === 'nowYear') {
		start = moment(date).startOf('year');
		end = moment(date).endOf('year');
	}

	return {start: moment(start).format(format), end: moment(end).format(format)};
}

/**
 * @description 根据开始日期和结束日期，生成天的数组
 * @param {String} start - 开始时间 YYYY-MM-DD
 * @param {String} end - 结束时间 YYYY-MM-DD
 * @param {String} key - 如果有该选项，结果会从 ['2024-06-01] 变成 [{ keyValue : 2024-06-01 }]
 * @param {String} format - 时间字符串格式化格式，默认YYYY-MM-DD
 * @return {Array | Boolean} 返回日期数组 或者 false
 */
export function generateDayCollection (start, end, key = '', format = 'YYYY-MM-DD') {
	let results = false;
	if (moment(start).isValid() && moment(end).isValid()) {
		results = [];

		let date = moment(start).format(format);
		let pointer = moment(end).add(1, 'day').format(format);

		while (moment(date).isBefore(pointer)) {
			const item = {};
			item[key] = date;
			results.push(key ? item : date);
			date = moment(date).add(1, 'day').format(format);
		}
	}

	return results;
}

/**
 * @description 根据开始日期和结束日期，生成月的数组
 * @param {String} start - 开始时间 YYYY-MM-DD
 * @param {String} end - 结束时间 YYYY-MM-DD
 * @param {String} key - 如果有该选项，结果会从 ['2024-06-01] 变成 [{ keyValue : 2024-06-01 }]
 * @param {String} format - 时间字符串格式化格式，默认YYYY-MM-DD
 * @return {Array | Boolean} 返回日期数组 或者 false
 */
export function generateMonthCollection (start, end, key = '', format = 'YYYY-MM-DD') {
	let results = false;
	if (moment(start).isValid() && moment(end).isValid()) {
		results = [];

		let date = moment(start).format(format);
		let pointer = moment(end).add(1, 'month').format(format);

		while (moment(date).isBefore(pointer)) {
			const item = {};
			item[key] = date;
			results.push(key ? item : date);
			date = moment(date).add(1, 'month').format(format);
		}
	}

	return results;
}

/**
 * @description 根据开始日期和结束日期，生成年的数组
 * @param {String} start - 开始时间 YYYY-MM-DD
 * @param {String} end - 结束时间 YYYY-MM-DD
 * @param {String} key - 如果有该选项，结果会从 ['2024-06-01] 变成 [{ keyValue : 2024-06-01 }]
 * @param {String} format - 时间字符串格式化格式，默认YYYY-MM-DD
 * @return {Array | Boolean} 返回日期数组 或者 false
 */
export function generateYearCollection (start, end, key = '', format = 'YYYY-MM-DD') {
	let results = false;
	if (moment(start).isValid() && moment(end).isValid()) {
		results = [];

		let date = moment(start).format(format);
		let pointer = moment(end).add(1, 'year').format(format);

		while (moment(date).isBefore(pointer)) {
			const item = {};
			item[key] = date;
			results.push(key ? item : date);
			date = moment(date).add(1, 'year').format(format);
		}
	}

	return results;
}
