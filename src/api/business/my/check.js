import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';

const apiVersion = '/api/v1/checkRecord';

const api = {
  get(page, size, searchParams) {
    return request({
      url: serverUrl + apiVersion + '',
      method: 'get',
      data: {
        pageNo: page,
        pageSize: size,
        ...searchParams,
      },
      formatFunction: (res) => {
        let json = res.result;
        json.records.map(function (item, index) {
          item.planTypeText = constant.convertText(constant.BUSINESS.CHECK_PLAN.TYPE, item.planType);
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
      formatFunction: (res) => {
        let json = res.result;

        json.planTypeText = constant.convertText(constant.BUSINESS.CHECK_PLAN.TYPE, json.planType);
      },
    });
  },
  saveCheck(id, data) {
    return request({
      url: serverUrl + apiVersion + '/saveCheck',
      method: 'post',
      data: {
        itemId: id,
        ...data,
      },
    });
  },
  checkDeviceNfc(recordId, pointId, nfcId) {
    return request({
      url: serverUrl + apiVersion + '/checkDeviceNfc',
      method: 'post',
      data: {
        recordId: recordId,
        pointId: pointId,
        nfcId: nfcId,
      },
    });
  },
};

export default api;
