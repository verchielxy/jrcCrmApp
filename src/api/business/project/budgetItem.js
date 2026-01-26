import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';

const apiVersion = '/api/v1/budgetItem';

const budgetItemApi = {
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
	export(page, size, searchParams) {
		return request({
			url: serverUrl + apiVersion + '/export',
			method: 'get',
			data: {
				pageNo: page,
				pageSize: size,
				...searchParams,
			},
			responseType: 'blob',
		});
	},
};

export default budgetItemApi;
