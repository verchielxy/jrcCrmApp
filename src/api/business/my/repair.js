import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';

const apiVersion = '/api/v1/repairMyOrder';

const api = {
	get(page, size, searchParams) {
		return request({
			url: serverUrl + apiVersion + '',
			method: 'get',
			data: {
				pageNo: page,
				pageSize: size,
				...searchParams,
			},
			formatFunction: (res) => {
				let json = res.result;
				json.records.map(function (item, index) {
					item.rankText = constant.convertText(constant.BUSINESS.REPAIR_WORK_ORDER.RANK, item.rank);
					item.rankConstant = constant.convertItem(constant.BUSINESS.REPAIR_WORK_ORDER.RANK, item.rank);
					item.runningStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, item.runningStatus);
				})
			}
		});
	},
	view(id, searchParams) {
		return request({
			url: serverUrl + apiVersion + '/{id}',
			method: 'get',
			params: {
				id: id,
			},
			data: {
				...searchParams,
			},
			formatFunction: (res) => {
				let json = res.result;

				json.rankText = constant.convertText(constant.BUSINESS.REPAIR_WORK_ORDER.RANK, json.rank);
				json.rankConstant = constant.convertItem(constant.BUSINESS.REPAIR_WORK_ORDER.RANK, json.rank);
				json.runningStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, json.runningStatus);
			},
		});
	},
	update(id, data) {
		return request({
			url: serverUrl + apiVersion + '/{id}',
			method: 'put',
			params: {
				id: id,
			},
			data: {
				...data,
			},
		});
	},
};

export default api;
