import request from '@/plugins/request';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';

const apiVersion = '/api/v1/maintainPlanCheck';

const approvalMaintainPlanApi = {
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

          item.cycleTypeText = constant.convertText(constant.BUSINESS.MAINTAIN_PLAN.CYCLE_TYPE, item.cycleType);
          item.maintainCycleUnitText = constant.convertText(constant.BUSINESS.MAINTAIN_PLAN.CYCLE_UNIT, item.maintainCycleUnit);
          item.remainAdvUnitText = constant.convertText(constant.BUSINESS.MAINTAIN_PLAN.REMINDER_TIME_UNIT, item.remainAdvUnit);
          item.enableText = constant.convertText(constant.NORMAL.YES_OR_NO, item.enable);

          item.checkStatusText = constant.convertText(constant.NORMAL.APPLY_STATUS, item.checkStatus);
          item.checkStatusConstant = constant.convertItem(constant.NORMAL.APPLY_STATUS, item.checkStatus);

          item.orderVidText = item.orderVid + '日';
          item.createAdvText = item.createAdv + '日';
          item.remainAdvText = item.remainAdvVal + item.remainAdvUnitText;
          item.maintenance = item.cycleType === 1 ? '周期循环：' + item.maintainCycleVal + item.maintainCycleUnitText + '1次' : '指定日期：' + item.maintainDate;

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

        json.applyUserId = json.applyUser?.id;
        json.applyUserText = json.applyUser?.name;

        json.cycleTypeText = constant.convertText(constant.BUSINESS.MAINTAIN_PLAN.CYCLE_TYPE, json.cycleType);
        json.maintainCycleUnitText = constant.convertText(constant.BUSINESS.MAINTAIN_PLAN.CYCLE_UNIT, json.maintainCycleUnit);
        json.remainAdvUnitText = constant.convertText(constant.BUSINESS.MAINTAIN_PLAN.REMINDER_TIME_UNIT, json.remainAdvUnit);
        json.enableText = constant.convertText(constant.NORMAL.YES_OR_NO, json.enable);

        json.checkStatusText = constant.convertText(constant.NORMAL.APPLY_STATUS, json.checkStatus);
        json.checkStatusConstant = constant.convertItem(constant.NORMAL.APPLY_STATUS, json.checkStatus);

        json.orderVidText = json.orderVid + '日';
        json.createAdvText = json.createAdv + '日';
        json.remainAdvText = json.remainAdvVal + json.remainAdvUnitText;
        json.maintenance = json.cycleType === 1 ? '周期循环：' + json.maintainCycleVal + json.maintainCycleUnitText + '1次' : '指定日期：' + json.maintainDate;

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

export default approvalMaintainPlanApi;
