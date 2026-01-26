import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';

const apiVersion = '/api/v1/budget';

const materialApi = {
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
};

export default materialApi;
