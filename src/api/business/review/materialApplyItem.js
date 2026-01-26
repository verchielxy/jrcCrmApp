import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';

const apiVersion = '/api/v1/order/{materialApplyId}/orderItem';

const materialApplyItemApi = {
	get(page, size, searchParams, materialApplyId) {
		return request({
			url: serverUrl + apiVersion + '',
			method: 'get',
			params: {
				materialApplyId: materialApplyId,
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
};

export default materialApplyItemApi;
