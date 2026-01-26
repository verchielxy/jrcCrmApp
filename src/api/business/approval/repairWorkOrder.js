import request from '@/plugins/request';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';

const apiVersion = '/api/v1/repairOrderCheck';

const approvalRepairWorkOrderApi = {
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
          item.headUserId = item.headUser?.id;
          item.headUserText = item.headUser?.name;

          item.rankText = constant.convertText(constant.BUSINESS.REPAIR_WORK_ORDER.RANK, item.rank);
          item.enableText = constant.convertText(constant.NORMAL.YES_OR_NO, item.enable);
          item.equipmentRunStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, item.equipmentRunStatus);
          item.equipmentRunStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, item.equipmentRunStatus);

          item.statusText = constant.convertText(constant.BUSINESS.REPAIR_WORK_ORDER.STATUS, item.status);
          item.statusConstant = constant.convertItem(constant.BUSINESS.REPAIR_WORK_ORDER.STATUS, item.status);
          item.checkStatusText = constant.convertText(constant.NORMAL.APPLY_STATUS, item.checkStatus);
          item.checkStatusConstant = constant.convertItem(constant.NORMAL.APPLY_STATUS, item.checkStatus);
          item.runningStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, item.runningStatus);
          item.runningStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, item.runningStatus);

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

        json.deviceId = json.device?.id;
        json.deviceText = json.device?.name;
        json.applyUserId = json.applyUserId?.id;
        json.applyUserText = json.applyUser?.name;
        json.headUserId = json.headUser?.id;
        json.headUserText = json.headUser?.name;

        json.rankText = constant.convertText(constant.BUSINESS.REPAIR_WORK_ORDER.RANK, json.rank);
        json.enableText = constant.convertText(constant.NORMAL.YES_OR_NO, json.enable);
        json.equipmentRunStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, json.equipmentRunStatus);
        json.equipmentRunStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, json.equipmentRunStatus);

        json.statusText = constant.convertText(constant.BUSINESS.REPAIR_WORK_ORDER.STATUS, json.status);
        json.statusConstant = constant.convertItem(constant.BUSINESS.REPAIR_WORK_ORDER.STATUS, json.status);
        json.checkStatusText = constant.convertText(constant.NORMAL.APPLY_STATUS, json.checkStatus);
        json.checkStatusConstant = constant.convertItem(constant.NORMAL.APPLY_STATUS, json.checkStatus);
        json.runningStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, json.runningStatus);
        json.runningStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, json.runningStatus);

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

export default approvalRepairWorkOrderApi;
