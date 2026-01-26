import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';

const apiVersion = '/api/v1/custom';

const customerApi = {
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
			},
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
	destory(ids) {
		return request({
			url: serverUrl + apiVersion + '/destory',
			method: 'delete',
			data: {
				ids: ids,
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
};

export default customerApi;
