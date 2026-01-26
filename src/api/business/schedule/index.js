import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from "@/constant";
import scheduleConfig from "@/config/business/schedule";

const apiVersion = '/api/v1/schedule';

const scheduleApi = {
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
					['relatedEntityId', 'relatedEntity.id'],
					['relatedEntityName', 'relatedEntity.name'],
					['createById', 'createBy.id'],
					['createByName', 'createBy.name'],
				],
				constantText: [
					['categoryText', constant.BUSINESS.SCHEDULE.CATEGORY, 'category'],
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
					['relatedEntityId', 'relatedEntity.id'],
					['relatedEntityName', 'relatedEntity.name'],
					['createUserId', 'createUser.id'],
					['createUserName', 'createUser.name'],
					['partnerUserId', 'partnerUser.id'],
					['partnerUserName', 'partnerUser.name'],
				],
				constantText: [
					['categoryText', constant.BUSINESS.SCHEDULE.CATEGORY, 'category'],
					['remindSetText', constant.BUSINESS.SCHEDULE.REMIND, 'remindSet'],
				],
				constant: [
				],
			},
			formatFunction: (res) => {
				let json = res.result;

				json.title = scheduleConfig.title(json);
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
	flow(id, data) {
		return request({
			url: serverUrl + apiVersion + '/{id}/addFlow',
			method: 'put',
			params: {
				id: id,
			},
			data: {
				...data,
			},
		});
	},
	parentUsers(page, size, searchParams) {
		return request({
			url: serverUrl + apiVersion + '/parentUserList',
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
	headUsers(page, size, searchParams) {
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
	export(searchParams) {
		return request({
			url: serverUrl + apiVersion + '/export',
			method: 'get',
			data: {
				...searchParams,
			},
			responseType: 'blob',
		});
	},
};

export default scheduleApi;
