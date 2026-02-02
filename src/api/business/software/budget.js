import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from "@/constant";

const apiVersion = '/api/v1/soft/budget';

const budgetApi = {
	get(page, size, searchParams) {
		return request({
			url: serverUrl + apiVersion + '',
			method: 'get',
			data: {
				pageNo: page,
				pageSize: size,
				...searchParams,
			},
			formatAppend: {
				key: 'id',
				serial: true,
				showText: [
					['customName', 'custom.name'],
				],
				constantText: [
					['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
					['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'projectGrade'],
					['projectStatusText', constant.BUSINESS.PROJECT.STATUS, 'projectStatus'],
				],
				constant: [
					['projectStatusConstant', constant.BUSINESS.PROJECT.STATUS, 'projectStatus'],
				],
			},
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
			formatDataKey: 'result',
			formatAppend: {
				showText: [
				],
				constantText: [
				],
				constant: [
				],
			},
		});
	},
};

export default budgetApi;
