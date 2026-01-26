import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';

const apiVersion = '/api/v1/research/budget/{budgetId}/budgetItem';

const budgetItemApi = {
	get(page, size, searchParams, budgetId) {
		return request({
			url: serverUrl + apiVersion + '',
			method: 'get',
			params: {
				budgetId: budgetId,
			},
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
	create(data, budgetId) {
		return request({
			url: serverUrl + apiVersion + '',
			method: 'post',
			params: {
				budgetId: budgetId,
			},
			data: {
				...data,
			},
		});
	},
	update(id, data, budgetId) {
		return request({
			url: serverUrl + apiVersion + '/{id}',
			method: 'put',
			params: {
				budgetId: budgetId,
				id: id,
			},
			data: {
				...data,
			},
		});
	},
	view(id, searchParams, budgetId) {
		return request({
			url: serverUrl + apiVersion + '/{id}',
			method: 'get',
			params: {
				budgetId: budgetId,
				id: id,
			},
			data: {
				...searchParams,
			},
		});
	},
	delete(id, budgetId) {
		return request({
			url: serverUrl + apiVersion + '/{id}',
			method: 'delete',
			params: {
				budgetId: budgetId,
				id: id,
			},
		});
	},
};

export default budgetItemApi;
