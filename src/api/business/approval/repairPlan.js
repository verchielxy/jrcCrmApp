import request from '@/plugins/request';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';

const apiVersion = '/api/v1/repairPlanCheck';

const approvalRepairPlanApi = {
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
          item.applyUserId = item.applyUser?.id;
          item.applyUserText = item.applyUser?.name;

          item.remainAdvUnitText = constant.convertText(constant.BUSINESS.REPAIR_PLAN.REMINDER_TIME_UNIT, item.remainAdvUnit);
          item.rankText = constant.convertText(constant.BUSINESS.REPAIR_WORK_ORDER.RANK, item.rank);
          item.enableText = constant.convertText(constant.NORMAL.YES_OR_NO, item.enable);

          item.checkStatusText = constant.convertText(constant.NORMAL.APPLY_STATUS, item.checkStatus);
          item.checkStatusConstant = constant.convertItem(constant.NORMAL.APPLY_STATUS, item.checkStatus);

          item.orderVidText = item.orderVid + '日';
          item.createAdvText = item.createAdv + '日';
          item.remainAdvText = item.remainAdvVal + item.remainAdvUnitText;

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

        json.applyUserId = json.applyUserId?.id;
        json.applyUserText = json.applyUser?.name;

        json.rankText = constant.convertText(constant.BUSINESS.REPAIR_WORK_ORDER.RANK, json.rank);
        json.enableText = constant.convertText(constant.NORMAL.YES_OR_NO, json.enable);
        json.remainAdvUnitText = constant.convertText(constant.BUSINESS.REPAIR_PLAN.REMINDER_TIME_UNIT, json.remainAdvUnit);

        json.checkStatusText = constant.convertText(constant.NORMAL.APPLY_STATUS, json.checkStatus);
        json.checkStatusConstant = constant.convertItem(constant.NORMAL.APPLY_STATUS, json.checkStatus);

        json.orderVidText = json.orderVid + '日';
        json.createAdvText = json.createAdv + '日';
        json.remainAdvText = json.remainAdvVal + json.remainAdvUnitText;

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

export default approvalRepairPlanApi;
