import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';
import { isNullOrUndefined } from '@utils/tools';

const commonApi = {
	// 计算税额
	taxCount(searchParams) {
		return request({
			url: serverUrl + '/api/v1/project/taxCount',
			method: 'get',
			data: {
				...searchParams,
			},
		});
	},

	// 客户列表
	customers(searchParams) {
		return request({
			url: serverUrl + '/api/v1/public/custom',
			method: 'get',
			data: {
				pageNo: 1,
				pageSize: -1,
				...searchParams,
			},
		});
	},

	// 项目列表
	projects(searchParams) {
		return request({
			url: serverUrl + '/api/v1/public/project',
			method: 'get',
			data: {
				pageNo: 1,
				pageSize: -1,
				...searchParams,
			},
		});
	},

	// 用户列表
	userList(searchParams) {
		return request({
			url: serverUrl + '/api/v1/public/userList',
			method: 'get',
			data: {
				pageNo: 1,
				pageSize: -1,
				...searchParams,
			},
		});
	},
};

export default commonApi;
