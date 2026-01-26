import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';
import uploadConfig from "@/config/upload";

const apiVersion = '/api/v1/contractCheck/purchase';

const contractApi = {
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
					['projectText', 'projectName'],
				],
				constantText: [
					['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
					['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'projectGrade'],
					['payTypeText', constant.BUSINESS.PROJECT_CONTRACT.PAY_TYPE, 'payType'],
				],
				constant: [
				],
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
			formatDataKey: 'result',
			formatAppend: {
				showText: [
					['projectId', 'project.id'],
					['projectText', 'project.name'],
					['headUserText', 'headUserName'],
					['customText', 'customName'],
					['contactName', 'contactName'],
					['contactPhone', 'contactPhone'],
					['budgetMoney', 'project.budgetMoney'],
				],
				constantText: [
					['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'project.type'],
					['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'project.grade'],
					['payTypeText', constant.BUSINESS.PROJECT_CONTRACT.PAY_TYPE, 'payType'],
					['statusText', constant.NORMAL.APPLY_STATUS, 'status'],
				],
				constant: [
					['statusConstant', constant.NORMAL.APPLY_STATUS, 'status'],
				],
			},
			formatFunction: (res) => {
				let json = res.result;

				if (json.files) {
					json.download = uploadConfig.file.generatorUrl(json.files, 'download');
				}
			},
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
						['status', 'checkInfo.status'],
						['opinion', 'checkInfo.opinion'],
						['endTime', 'checkInfo.endTime'],
						['projectText', 'projectName'],
					],
					constantText: [
						['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
						['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'projectGrade'],
						['payTypeText', constant.BUSINESS.PROJECT_CONTRACT.PAY_TYPE, 'payType'],
						['statusText', constant.NORMAL.REVIEW_STATUS, 'status'],
					],
					constant: [
						['statusConstant', constant.NORMAL.REVIEW_STATUS, 'status'],
					],
				},
				formatFunction: (res) => {
					let json = res.result;
					json.records.map(function (item) {
						// item.status = item.checkInfo?.status;
						// item.opinion = item.checkInfo?.opinion;
						// item.endTime = item.checkInfo?.endTime;
					})
				}
			});
		},
	},
};

export default contractApi;
