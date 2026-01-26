import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant'
import uploadConfig from "@/config/upload";

const apiVersion = '/api/v1/payCheck';

const receiptApi = {
	get(page, size, searchParams) {
		return request({
			url: serverUrl + apiVersion + '/todoList',
			method: 'get',
			data: {
				pageNo: page,
				pageSize: size,
				...searchParams,
			},
			formatAppend: {
				key: 'id',
				serial: true,
				showText: [
					['projectName', 'project.name'],
					['supplierName', 'supplier.name'],
					['createByName', 'createBy.name'],
				],
				constantText: [
					['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
					['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'projectGrade'],
				],
				constant: [
				],
			},
			formatFunction: (res) => {
				let json = res.result;
				json.records.map(function (item) {
				})
			}
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
			formatDataKey: 'result',
			formatAppend: {
				showText: [
					['projectId', 'project.id'],
					['projectName', 'project.name'],
					['supplierId', 'supplier.id'],
					['supplierName', 'supplier.name'],
					['createByName', 'createBy.name'],
				],
				constantText: [
					['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
					['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'projectGrade'],
					['urgencyLevelText', constant.BUSINESS.PURCHASE.RECEIPT.URGENCY_LEVEL, 'urgencyLevel'],
					['statusText', constant.NORMAL.APPLY_STATUS, 'status'],
				],
				constant: [
					['statusConstant', constant.NORMAL.APPLY_STATUS, 'status'],
				],
			},
			formatFunction: (res) => {
				let json = res.result;
			}
		});
	},
	review(id, data) {
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
	orders(page, size, searchParams) {
		return request({
			url: serverUrl + apiVersion + '/saleList',
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
		return request({
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
		return request({
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
		return request({
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
	result: {
		get(page, size, searchParams) {
			return request({
				url: serverUrl + apiVersion + '/doneList',
				method: 'get',
				data: {
					pageNo: page,
					pageSize: size,
					...searchParams,
				},
				formatAppend: {
					key: 'id',
					serial: true,
					showText: [
						['projectName', 'project.name'],
						['supplierName', 'supplier.name'],
						['createByName', 'createBy.name'],
						['status', 'checkInfo.status'],
						['opinion', 'checkInfo.opinion'],
						['endTime', 'checkInfo.endTime'],
					],
					constantText: [
						['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
						['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'projectGrade'],
						['statusText', constant.NORMAL.REVIEW_STATUS, 'status'],
					],
					constant: [
						['statusConstant', constant.NORMAL.REVIEW_STATUS, 'status'],
					],
				},
				formatFunction: (res) => {
					let json = res.result;
					json.records.map(function (item) {
					})
				}
			});
		},
	},
};

export default receiptApi;
