import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from "@/constant";
import uploadConfig from "@/config/upload";

const apiVersion = '/api/v1/buildCheck';

const constructionApi = {
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
				],
				constantText: [
					['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
					['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'projectGrade'],
					['workQualityText', constant.BUSINESS.PROJECT.QUALITY, 'workQuality'],
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
				],
				constantText: [
					['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
					['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'projectGrade'],
					['workQualityText', constant.BUSINESS.PROJECT.QUALITY, 'workQuality'],
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
					],
					constantText: [
						['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
						['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'projectGrade'],
						['workQualityText', constant.BUSINESS.PROJECT.QUALITY, 'workQuality'],
						['statusText', constant.NORMAL.REVIEW_STATUS, 'status'],
					],
					constant: [
						['statusConstant', constant.NORMAL.REVIEW_STATUS, 'status'],
					],
				},
				formatFunction: (res) => {
					let json = res.result;
					json.records.map(function (item) {
						if (item.files) {
							item.fileDownload = uploadConfig.file.generatorUrl(item.files, 'download');
						}
					})
				}
			});
		},
	},
};

export default constructionApi;
