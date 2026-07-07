import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from "@/constant";
import uploadConfig from '@/config/upload'

const apiVersion = '/api/v1/build/project';

const engineeringProjectApi = {
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
				showText: [
					['customId', 'custom.id'],
					['customText', 'custom.name'],
					['contactsText', 'custom.contacts'],
					['contactsPhone', 'custom.phone'],
					['headUserId', 'headUser.id'],
					['headUserText', 'headUser.name'],
				],
				constantText: [
					['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
					['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'projectGrade'],
					['statusText', constant.BUSINESS.PROJECT.STATUS, 'status'],
				],
				constant: [
					['statusConstant', constant.BUSINESS.PROJECT.STATUS, 'status'],
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
					['customId', 'custom.id'],
					['customText', 'custom.name'],
					['contactsText', 'contacts.contactsName'],
					['contactsPhone', 'contacts.phone'],
					['headUserId', 'headUser.id'],
					['headUserText', 'headUser.name'],
				],
				constantText: [
					['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
					['projectGradeText', constant.BUSINESS.PROJECT.GRADE, 'projectGrade'],
					['statusText', constant.BUSINESS.PROJECT.STATUS, 'status'],
				],
				constant: [
					['statusConstant', constant.BUSINESS.PROJECT.STATUS, 'status'],
				],
			},
			formatFunction: (res) => {
				let json = res.result;

				if (json.contractFiles) {
					json.contractDownload = uploadConfig.file.generatorUrl(json.contractFiles, 'download');
				}

				if (json.protocolFiles) {
					json.protocolDownload = uploadConfig.file.generatorUrl(json.protocolFiles, 'download');
				}

				if (json.meeting) {
					json.meetingContent = json.meeting?.content;

					if (json.meeting.files) {
						json.meeting.filesDownload = uploadConfig.file.generatorUrl(json.meeting.files, 'download');
						json.meetingFilesDownload = uploadConfig.file.generatorUrl(json.meeting.files, 'download');
					}
				}

				if (json.acceptance) {
					json.acceptanceContent = json.acceptance?.content;

					if (json.acceptance.files) {
						json.acceptance.filesDownload = uploadConfig.file.generatorUrl(json.acceptance.files, 'download');
						json.acceptanceFilesDownload = uploadConfig.file.generatorUrl(json.acceptance.files, 'download');
					}
				}
			},
		});
	},
	// 施工实际工期
	updateBuildDate(id, data) {
		return request({
			url: serverUrl + apiVersion + '/{id}/updateBuildDate',
			method: 'put',
			params: {
				id: id,
			},
			data: {
				...data,
			},
		});
	},
	// 项目启动会
	updateMeeting(id, data) {
		return request({
			url: serverUrl + apiVersion + '/{id}/meeting',
			method: 'put',
			params: {
				id: id,
			},
			data: {
				...data,
			},
		});
	},
	// 施工结束
	updateFinishBuild(id, data) {
		return request({
			url: serverUrl + apiVersion + '/{id}/finishBuild',
			method: 'put',
			params: {
				id: id,
			},
			data: {
				...data,
			},
		});
	},
	// 施工验收
	updateAcceptance(id, data) {
		return request({
			url: serverUrl + apiVersion + '/{id}/acceptance',
			method: 'put',
			params: {
				id: id,
			},
			data: {
				...data,
			},
		});
	},
	users(page, size, searchParams) {
		return request({
			url: serverUrl + apiVersion + '/headUserList',
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
	assign(id, data) {
		return request({
			url: serverUrl + apiVersion + '/{id}/updateBuildUser',
			method: 'put',
			params: {
				id: id,
			},
			data: {
				...data,
			},
		});
	},
};

export default engineeringProjectApi;
