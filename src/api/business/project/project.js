import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';
import uploadConfig from '@/config/upload';

const apiVersion = '/api/v1/project';

const projectApi = {
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
					['contactsName', 'contacts.name'],
					['contactsPhone', 'contacts.phone'],
					['headUserName', 'headUser.name'],
				],
				constantText: [
					['typeText', constant.BUSINESS.PROJECT.TYPE, 'type'],
					['gradeText', constant.BUSINESS.PROJECT.GRADE, 'grade'],
					['statusText', constant.BUSINESS.PROJECT.STATUS, 'status'],
				],
				constant: [
					['statusConstant', constant.BUSINESS.PROJECT.STATUS, 'status'],
				],
			},
			formatFunction: (res) => {
				let json = res.result;
				json.records.map(function (item) {
				})
			}
		});
	},
	create(data) {
		return request({
			url: serverUrl + apiVersion + '',
			method: 'post',
			data: {
				...data,
			},
		});
	},
	update(id, data) {
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
					['customName', 'custom.name'],
					['contactsName', 'contacts.contactsName'],
					['contactsPhone', 'contacts.phone'],
					['headUserName', 'headUser.name'],
				],
				constantText: [
					['typeText', constant.BUSINESS.PROJECT.TYPE, 'type'],
					['gradeText', constant.BUSINESS.PROJECT.GRADE, 'grade'],
					['statusText', constant.BUSINESS.PROJECT.STATUS, 'status'],
				],
				constant: [
					['statusConstant', constant.BUSINESS.PROJECT.STATUS, 'status'],
				],
			},
			formatFunction: (res) => {
				let json = res.result;

				if (json.contract) {
					json.contractTaxRate1 = json.contract?.taxRate1;
					json.contractTaxRate2 = json.contract?.taxRate2;
					json.contractTaxRate3 = json.contract?.taxRate3;
					json.contractTaxMoney = json.contract?.taxMoney;
					json.contractContent = json.contract?.contractContent;
					json.contractPayType = json.contract?.payType;
					json.contractPayTypeText = constant.convertText(constant.BUSINESS.PROJECT_CONTRACT.PAY_TYPE, json.contract?.payType);
					json.contractPayModList = json.contract?.payModList;
					json.contractOpLogList = json.contract?.opLogList;

					if (json.contract.files) {
						json.contractDownload = uploadConfig.file.generatorUrl(json.contract.files, 'download');
					}
				}
				if (json.protocol) {
					json.protocolRemarks = json.protocol?.remarks;
					json.protocolOpLogList = json.protocol?.opLogList;

					if (json.protocol.files) {
						json.protocolDownload = uploadConfig.file.generatorUrl(json.protocol.files, 'download');
					}
				}
				if (json.buildTransfer) {
					json.buildTransferStartTime = json.buildTransfer?.startTime;
					json.buildTransferEndTime = json.buildTransfer?.endTime;
					json.buildTransferAddress = json.buildTransfer?.address;
					json.buildTransferFirstPartyUser = json.buildTransfer?.firstPartyUser;
					json.buildTransferFirstPartyPhone = json.buildTransfer?.firstPartyPhone;
					json.buildTransferWorkQualityText = constant.convertText(constant.BUSINESS.PROJECT.QUALITY, json.buildTransfer.workQuality);
					json.buildTransferRemarks = json.buildTransfer?.remarks;
					json.buildTransferOpLogList = json.buildTransfer?.opLogList;

					if (json.buildTransfer.files) {
						json.buildTransferDownload = uploadConfig.file.generatorUrl(json.buildTransfer.files, 'download');
					}
				}
			},
		});
	},
	delete(id) {
		return request({
			url: serverUrl + apiVersion + '/{id}',
			method: 'delete',
			params: {
				id: id,
			},
		});
	},
	destory(ids) {
		return request({
			url: serverUrl + apiVersion + '/destory',
			method: 'delete',
			data: {
				ids: ids,
			},
		});
	},
	users(page, size, searchParams) {
		return request({
			url: serverUrl + apiVersion + '/userList',
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
	// 上传合同
	updateContract(id, data) {
		return request({
			url: serverUrl + apiVersion + '/{id}/uploadContract',
			method: 'put',
			params: {
				id: id,
			},
			data: {
				...data,
			},
		});
	},
	// 上传技术协议
	updateTechnology(id, data) {
		return request({
			url: serverUrl + apiVersion + '/{id}/uploadProtocol',
			method: 'put',
			params: {
				id: id,
			},
			data: {
				...data,
			},
		});
	},
	// 上传施工转接
	updateConstruction(id, data) {
		return request({
			url: serverUrl + apiVersion + '/{id}/transferProject',
			method: 'put',
			params: {
				id: id,
			},
			data: {
				...data,
			},
		});
	},
	// 计算税额
	taxCount(searchParams) {
		return request({
			url: serverUrl + apiVersion + '/taxCount',
			method: 'get',
			data: {
				...searchParams,
			},
		});
	},
};

export default projectApi;
