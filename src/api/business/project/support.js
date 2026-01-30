import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';

const apiVersion = '/api/v1/support';

const supportApi = {
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
				],
				constantText: [
					['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
					['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'projectGrade'],
					['statusText', constant.BUSINESS.SUPPORT.STATUS, 'status'],
				],
				constant: [
					['statusConstant', constant.BUSINESS.SUPPORT.STATUS, 'status'],
				],
			},
			formatFunction: (res) => {
				let json = res.result;

				json.records.map(function (item) {
				})
			}
		});
	},
	create(data) {
		return request({
			url: serverUrl + apiVersion + '',
			method: 'post',
			data: {
				...data,
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
					['headUserName', 'headUser.name'],
					['supportUserName', 'supportUser.name'],
				],
				constantText: [
					['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
					['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'projectGrade'],
					['typeText', constant.BUSINESS.DEPARTMENTS, 'type'],
					['statusText', constant.BUSINESS.SUPPORT.STATUS, 'status'],
				],
				constant: [
					['statusConstant', constant.BUSINESS.SUPPORT.STATUS, 'status'],
				],
			},
		});
	},
	delete(id) {
		return request({
			url: serverUrl + apiVersion + '/{id}',
			method: 'delete',
			params: {
				id: id,
			},
		});
	},
	push(id) {
		return request({
			url: serverUrl + apiVersion + '/{id}/submit',
			method: 'put',
			params: {
				id: id,
			},
		});
	},
};

export default supportApi;
