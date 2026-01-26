import request from '@/plugins/request';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';

const apiVersion = '/api/v1/maintainOrderCheck';

const approvalMaintainWorkOrderApi = {
  get(page, size, searchParams) {
    let url = '/todoList';
    if (searchParams.searchType === 'result') {
      url = '/doneList';
    }
    return request({
      url: serverUrl + apiVersion + url,
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
      formatFunction: (res) => {
        let json = res.result;
        json.records.map(function (item, index) {
          item.deviceId = item.device?.id;
          item.deviceText = item.device?.name;
          item.applyUserId = item.applyUserId?.id;
          item.applyUserText = item.applyUser?.name;

          item.checkStatusText = constant.convertText(constant.NORMAL.APPLY_STATUS, item.checkStatus);
          item.checkStatusConstant = constant.convertItem(constant.NORMAL.APPLY_STATUS, item.checkStatus);
          item.statusText = constant.convertText(constant.BUSINESS.MAINTAIN_WORK_ORDER.STATUS, item.status);
          item.statusConstant = constant.convertItem(constant.BUSINESS.MAINTAIN_WORK_ORDER.STATUS, item.status);

          if (item.checkInfo) {
            item.resultText = item.checkInfo.opinion;
          }
        })
      }
    });
  },
  view(id, searchParams) {
    return request({
      url: serverUrl + apiVersion + '/{id}/',
      method: 'get',
      params: {
        id: id,
      },
      data: {
        ...searchParams,
      },
      formatFunction: (res) => {
        let json = res.result;

        json.deviceId = json.device?.id;
        json.deviceText = json.device?.name;
        json.applyUserId = json.applyUserId?.id;
        json.applyUserText = json.applyUser?.name;
        json.headUserId = json.headUser?.id;
        json.headUserText = json.headUser?.name;

        json.checkStatusText = constant.convertText(constant.NORMAL.APPLY_STATUS, json.checkStatus);
        json.checkStatusConstant = constant.convertItem(constant.NORMAL.APPLY_STATUS, json.checkStatus);
        json.statusText = constant.convertText(constant.BUSINESS.MAINTAIN_WORK_ORDER.STATUS, json.status);
        json.statusConstant = constant.convertItem(constant.BUSINESS.MAINTAIN_WORK_ORDER.STATUS, json.status);

        if (json.opLogList && json.opLogList.length > 0) {
          json.checkInfo = json.opLogList;
        }
      },
    });
  },
  approval(id, data) {
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
};

export default approvalMaintainWorkOrderApi;
