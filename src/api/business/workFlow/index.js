import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';

const apiVersion = '/api/v1/workflow';

const workFlowApi = {
	todo(page, size, searchParams) {
		return request({
			url: serverUrl + apiVersion + '/todo',
			method: 'get',
			data: {
				pageNo: page,
				pageSize: size,
				...searchParams,
			},
		});
	},
	done(page, size, searchParams) {
		return request({
			url: serverUrl + apiVersion + '/done',
			method: 'get',
			data: {
				pageNo: page,
				pageSize: size,
				...searchParams,
			},
		});
	},
	started(page, size, searchParams) {
		return request({
			url: serverUrl + apiVersion + '/started',
			method: 'get',
			data: {
				pageNo: page,
				pageSize: size,
				...searchParams,
			},
		});
	},
	cc(page, size, searchParams) {
		return request({
			url: serverUrl + apiVersion + '/cc',
			method: 'get',
			data: {
				pageNo: page,
				pageSize: size,
				...searchParams,
			},
		});
	},
	view(id, searchParams) {
		return request({
			url: serverUrl + apiVersion + '/progress/{id}',
			method: 'get',
			params: {
				id: id,
			},
			data: {
				...searchParams,
			},
		});
	},
	// 同意
	agree(id, data) {
		return request({
			url: serverUrl + apiVersion + '/task/{id}/complete',
			method: 'post',
			params: {
				id: id,
			},
			data: {
				...data, // { message: '' }
			},
		});
	},
	disagree(id, data) {
		return request({
			url: serverUrl + apiVersion + '/task/{id}/reject',
			method: 'post',
			params: {
				id: id,
			},
			data: {
				mode: 'APPLICANT',
				...data, // { mode: 'APPLICANT', reason: '' }
			},
		});
	},
};

export default workFlowApi;
