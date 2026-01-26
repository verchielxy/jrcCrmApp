import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';

const apiVersion = '/api/v1/device';

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
					item.depreciationText = item.depreciation?.name;
					item.cateText = item.cate?.name;
					item.belongOfficeText = item.belongOffice?.name;
					item.headUserText = item.headUser?.name;

					item.levelText = constant.convertText(constant.BUSINESS.EQUIPMENT.LEVEL, item.level);
					item.unitText = constant.convertText(constant.BUSINESS.EQUIPMENT.UNIT, item.unit);
					item.isSpecialText = constant.convertText(constant.NORMAL.YES_OR_NO, item.isSpecial);
					item.isMeteringText = constant.convertText(constant.NORMAL.YES_OR_NO, item.isMetering);
					item.runningStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, item.runningStatus);
					item.runningStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, item.runningStatus);
					item.useStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.USE_STATUS, item.useStatus);
					item.useStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.USE_STATUS, item.useStatus);
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

				json.depreciationId = json.depreciation?.id;
				json.cateId = json.cate?.id;
				json.belongOfficeId = json.belongOffice?.id;
				json.headUserId = json.headUser?.id;

				json.depreciationText = json.depreciation?.name;
				json.cateText = json.cate?.name;
				json.belongOfficeText = json.belongOffice?.name;
				json.headUserText = json.headUser?.name;

				json.levelText = constant.convertText(constant.BUSINESS.EQUIPMENT.LEVEL, json.level);
				json.unitText = constant.convertText(constant.BUSINESS.EQUIPMENT.UNIT, json.unit);
				json.isSpecialText = constant.convertText(constant.NORMAL.YES_OR_NO, json.isSpecial);
				json.isMeteringText = constant.convertText(constant.NORMAL.YES_OR_NO, json.isMetering);
				json.runningStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, json.runningStatus);
				json.runningStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, json.runningStatus);
				json.useStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.USE_STATUS, json.useStatus);
				json.useStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.USE_STATUS, json.useStatus);
			},
		});
	},
};

export default api;
