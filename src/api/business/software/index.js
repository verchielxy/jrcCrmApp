import axiosRequest from '@/plugins/axios/axiosRequest';
import serverUrl from '@api/serviceUrl';

const apiVersion = '/api/v1/soft';

const softwareApi = {
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
	create(data) {
		return axiosRequest({
			url: serverUrl + apiVersion + '',
			method: 'post',
			data: {
				...data,
			},
		});
	},
	update(id, data) {
		return axiosRequest({
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
		return axiosRequest({
			url: serverUrl + apiVersion + '/{id}/',
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
		return axiosRequest({
			url: serverUrl + apiVersion + '/{id}',
			method: 'delete',
			params: {
				id: id,
			},
		});
	},
};

export default softwareApi;
