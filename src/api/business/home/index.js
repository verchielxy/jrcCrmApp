import axiosRequest from '@/plugins/axios/axiosRequest';
import serverUrl from '@api/serviceUrl';

const apiVersion = '/api/v1';

const homeApi = {
	info() {
		return axiosRequest({
			url: serverUrl + apiVersion + '/user',
			method: 'get',
			data: {
			},
		});
	},
	customerChart() {
		return axiosRequest({
			url: serverUrl + apiVersion + '/user',
			method: 'get',
			data: {
			},
		});
	},
	customerPlanChart() {
		return axiosRequest({
			url: serverUrl + apiVersion + '/user',
			method: 'get',
			data: {
			},
		});
	},
	projectChart() {
		return axiosRequest({
			url: serverUrl + apiVersion + '/user',
			method: 'get',
			data: {
			},
		});
	},
	projectPlanChart() {
		return axiosRequest({
			url: serverUrl + apiVersion + '/user',
			method: 'get',
			data: {
			},
		});
	},
	/* 流量同比图 */
	flowYearOnYear() {
		return axiosRequest({
			url: serverUrl + apiVersion + '/yoy',
			method: 'get',
			data: {
			},
		});
	},
	/* 流量趋势图 */
	flowTrend(searchParams) {
		return axiosRequest({
			url: serverUrl + apiVersion + '/flowTrend',
			method: 'get',
			data: {
				...searchParams,
			},
		});
	},
	/* 设备报表 */
	flowReport(page, size, searchParams) {
		return axiosRequest({
			url: serverUrl + apiVersion + '/homeTable',
			method: 'get',
			data: {
				pageNo: page,
				pageSize: size,
				...searchParams,
			},
		});
	},
	/* 设备报表导出 */
	flowReportExport(page, size, searchParams) {
		return axiosRequest({
			url: serverUrl + apiVersion + '/homeTable/export',
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

export default homeApi;
