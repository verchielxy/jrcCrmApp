import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from "@/constant";

const apiVersion = '/api/v1/energy/support';

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
	users(page, size, searchParams) {
		return request({
			url: serverUrl + apiVersion + '/userList',
			method: 'get',
			data: {
				pageNo: page,
				pageSize: size,
				...searchParams,
			},
			formatAppend: {
				key: 'id',
				serial: true,
			},
		});
	},
	push(id) {
		return request({
			url: serverUrl + apiVersion + '/{id}/reply',
			method: 'put',
			params: {
				id: id,
			},
		});
	},
	assign(id, data) {
		return request({
			url: serverUrl + apiVersion + '/{id}/assign',
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

export default supportApi;
