import axiosRequest from '@/plugins/axios/axiosRequest';
import serverUrl from '@api/serviceUrl';

const apiVersion = '/api/v1/crmParity';

const parityReviewApi = {
	get(page, size, searchParams) {
		return axiosRequest({
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
	update(id, data) {
		return axiosRequest({
			url: serverUrl + apiVersion + '/{id}',
			method: 'post',
			params: {
				id: id,
			},
			data: {
				...data,
			},
		});
	},
	view(id, searchParams) {
		return axiosRequest({
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
	push(id, data) {
		return axiosRequest({
			url: serverUrl + apiVersion + '/{id}/review',
			method: 'put',
			params: {
				id: id,
			},
			data: {
				...data,
			},
		});
	},
	materialApplys(page, size, searchParams) {
		return axiosRequest({
			url: serverUrl + apiVersion + '/buildOrderList',
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
	projects(page, size, searchParams) {
		return axiosRequest({
			url: serverUrl + apiVersion + '/projectList',
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
	products(page, size, searchParams) {
		return axiosRequest({
			url: serverUrl + apiVersion + '/goodsList',
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
	suppliers(page, size, searchParams) {
		return axiosRequest({
			url: serverUrl + apiVersion + '/supplierList',
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

export default parityReviewApi;
