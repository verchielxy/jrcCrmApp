import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';
import { treeFindParents } from "@utils/tools";
import pcaJson from "@/static/area/pca-code.json";

const apiVersion = '/api/v1/custom';

const customerApi = {
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
					['industryText', constant.BUSINESS.CUSTOMER.INDUSTRY, 'industry'],
					['sourceText', constant.BUSINESS.CUSTOMER.SOURCE, 'source'],
					['gradeText', constant.BUSINESS.CUSTOMER.GRADE, 'grade'],
					['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
				],
				constant: [
				],
			},
			formatFunction: (res) => {
				let json = res.result;
				json.records.map(function (item) {
					if (item.provinces) {
						item.provincesArr = treeFindParents(pcaJson, 'code', item.provinces).reverse();
					} else {
						item.provincesArr = [];
					}
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
					['contactsName', 'contacts.name'],
					['contactsPhone', 'contacts.phone'],
					['headUserName', 'headUser.name'],
				],
				constantText: [
					['industryText', constant.BUSINESS.CUSTOMER.INDUSTRY, 'industry'],
					['sourceText', constant.BUSINESS.CUSTOMER.SOURCE, 'source'],
					['gradeText', constant.BUSINESS.CUSTOMER.GRADE, 'grade'],
					['projectTypeText', constant.BUSINESS.PROJECT.TYPE, 'projectType'],
				],
				constant: [],
			},
			formatFunction: (res) => {
				let json = res.result;
				if (json.provinces) {
					json.provincesArr = treeFindParents(pcaJson, 'code', json.provinces).reverse();
				} else {
					json.provincesArr = [];
				}
			}
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
};

export default customerApi;
