import moment from "moment";
import { randomCustomNumber } from '@utils/tools'
import serverUrl from '@api/serviceUrl';
import uploadConfig from '@/config/upload';

/* 设备所需配置项 */
const equipmentConfig = {
	// 监测器
	monitor: {
		flowInstantaneousUnit: 'm³/h',
		flowTotalUnit: 'm³',
		report: {
			month: {
				index: [
					{
						label: '月流量',
						key: 'increment',
					},
					{
						label: '累计流量',
						key: 'total',
					},
				],
				timeSearch: 'monthRange',
				start: moment().subtract(6, 'months').format('YYYY-MM'),
				end: moment().subtract(0, 'months').format('YYYY-MM'),
				requestParams: 1,
				data: () => {
					let rows = [];
					let total = 0;
					for (let i = 1; i <= 6; i++) {
						let increment = randomCustomNumber(100, 999);
						total = total + increment;
						rows.push({
							serial: i,
							time: moment().subtract(6 - i, 'months').format('YYYY-MM'),
							increment: increment,
							total: total,
						})
					}
					return rows;
				}
			},
			week: {
				index: [
					{
						label: '周流量',
						key: 'increment',
					},
					{
						label: '累计流量',
						key: 'total',
					},
				],
				timeSearch: 'weekRange',
				start: moment().subtract(10, 'weeks').format('YYYY-WW'),
				end: moment().subtract(0, 'weeks').format('YYYY-WW'),
				requestParams: 2,
				data: () => {
					let rows = [];
					let total = 0;
					for (let i = 1; i <= 10; i++) {
						let increment = randomCustomNumber(100, 999);
						total = total + increment;
						rows.push({
							serial: i,
							time: moment().subtract(10 - i, 'weeks').format('YYYY-WW周'),
							increment: increment,
							total: total,
						})
					}
					return rows;
				}
			},
			day: {
				index: [
					{
						label: '日流量',
						key: 'increment',
					},
					{
						label: '累计流量',
						key: 'total',
					},
				],
				timeSearch: 'dateRange',
				start: moment().subtract(30, 'days').format('YYYY-MM-DD'),
				end: moment().subtract(0, 'days').format('YYYY-MM-DD'),
				requestParams: 3,
				data: () => {
					let rows = [];
					let total = 0;
					for (let i = 1; i <= 30; i++) {
						let increment = randomCustomNumber(100, 999);
						total = total + increment;
						rows.push({
							serial: i,
							time: moment().subtract(30 - i, 'days').format('YYYY-MM-DD'),
							increment: increment,
							total: total,
						})
					}
					return rows;
				}
			},
		},
		import: {
			url: serverUrl + '/api/v1/device/import',
			method: 'post',
			key: 'file',
			headers: uploadConfig.config.headers(),
			params: uploadConfig.config.params(),
		},
		fanDuration: (instantaneousFlow) => {
			let time = 0;
			let max = { time: 5, instantaneousFlow: 100};
			let min = { time: 1,  instantaneousFlow: 1};
			if (instantaneousFlow !== 0) {
				if (instantaneousFlow > max.instantaneousFlow) {
					time = min.time;
				} else if (instantaneousFlow < min.instantaneousFlow) {
					time = max.time;
				} else {
					let percentage = (instantaneousFlow - min.instantaneousFlow) / (max.instantaneousFlow - min.instantaneousFlow);
					time = ((1 - percentage) * (max.time - min.time) + min.time);
				}
			}

			return time;
		},
	},
	// 监控
	camera: {
	},
};

export default equipmentConfig;
