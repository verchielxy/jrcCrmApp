import request from '@/plugins/request';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';

const apiVersion = '/api/v1/transferCheck';

const approvalChangeTransferApi = {
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
          item.toDepId = item.toDep?.id;
          item.applyUserId = item.applyUserId?.id;

          item.toDepText = item.toDep?.name;
          item.applyUserText = item.applyUser?.name;

          item.typeText = constant.convertText(constant.BUSINESS.CHANGE_TRANSFER.TYPE, item.type);
          item.checkStatusText = constant.convertText(constant.NORMAL.APPLY_STATUS, item.checkStatus);
          item.checkStatusConstant = constant.convertItem(constant.NORMAL.APPLY_STATUS, item.checkStatus);

          if (item.checkInfo) {
            item.resultText = item.checkInfo.opinion;
          }
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

        json.toDepId = json.toDep?.id;
        json.applyUserId = json.applyUserId?.id;

        json.toDepText = json.toDep?.name;
        json.applyUserText = json.applyUser?.name;

        json.typeText = constant.convertText(constant.BUSINESS.CHANGE_TRANSFER.TYPE, json.type);
        json.checkStatusText = constant.convertText(constant.NORMAL.APPLY_STATUS, json.checkStatus);
        json.checkStatusConstant = constant.convertItem(constant.NORMAL.APPLY_STATUS, json.checkStatus);

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

export default approvalChangeTransferApi;
