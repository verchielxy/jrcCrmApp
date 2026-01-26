import request from '@/plugins/request/index';
import serverUrl from '@api/serviceUrl';
import constant from '@/constant';
import { isNullOrUndefined } from '@utils/tools';

const commonApi = {
  users(page, size, searchParams) {
    return request({
      url: serverUrl + '/api/v1/base/user/list',
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
  departments(searchParams) {
    return request({
      url: serverUrl + '/api/v1/base/tree',
      method: 'get',
      data: {
        ...searchParams,
      },
    });
  },
  equipmentCategorys(page, size, searchParams) {
    return request({
      url: serverUrl + '/api/v1/base/cate/list',
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
  equipments(page, size, searchParams) {
    return request({
      url: serverUrl + '/api/v1/base/device/list',
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

        if (!searchParams.existIds || searchParams.existIds.length <= 0) {
          json.records = [];
        }

        json.records.map(function (item, index) {
          item.depreciationText = item.depreciation?.name;
          item.cateText = item.cate?.name;
          item.belongOfficeText = item.belongOffice?.name;
          item.headUserText = item.headUser?.name;

          item.levelText = constant.convertText(constant.BUSINESS.EQUIPMENT.LEVEL, item.level);
          item.unitText = constant.convertText(constant.BUSINESS.EQUIPMENT.UNIT, item.unit);
          item.isSpecialText = constant.convertText(constant.NORMAL.YES_OR_NO, item.isSpecial);
          item.isMeteringText = constant.convertText(constant.NORMAL.YES_OR_NO, item.isMetering);
          item.runningStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, item.runningStatus);
          item.runningStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, item.runningStatus);
          item.useStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.USE_STATUS, item.useStatus);
          item.useStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.USE_STATUS, item.useStatus);
        })
      },
    });
  },
  equipmentCrates(page, size, searchParams) {
    return request({
      url: serverUrl + '/api/v1/base/device/list',
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
          item.depreciationText = item.depreciation?.name;
          item.cateText = item.cate?.name;
          item.belongOfficeText = item.belongOffice?.name;
          item.headUserText = item.headUser?.name;

          item.levelText = constant.convertText(constant.BUSINESS.EQUIPMENT.LEVEL, item.level);
          item.unitText = constant.convertText(constant.BUSINESS.EQUIPMENT.UNIT, item.unit);
          item.isSpecialText = constant.convertText(constant.NORMAL.YES_OR_NO, item.isSpecial);
          item.isMeteringText = constant.convertText(constant.NORMAL.YES_OR_NO, item.isMetering);
          item.runningStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, item.runningStatus);
          item.runningStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, item.runningStatus);
          item.useStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.USE_STATUS, item.useStatus);
          item.useStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.USE_STATUS, item.useStatus);
        })
      },
    });
  },
  equipmentView(id, searchParams) {
    return request({
      url: serverUrl + '/api/v1/base/device/{id}',
      method: 'get',
      params: {
        id: id,
      },
      data: {
        ...searchParams,
      },
      formatFunction: (res) => {
        let json = res.result;

        json.depreciationId = json.depreciation?.id;
        json.cateId = json.cate?.id;
        json.belongOfficeId = json.belongOffice?.id;
        json.headUserId = json.headUser?.id;

        json.depreciationText = json.depreciation?.name;
        json.cateText = json.cate?.name;
        json.belongOfficeText = json.belongOffice?.name;
        json.headUserText = json.headUser?.name;

        json.levelText = constant.convertText(constant.BUSINESS.EQUIPMENT.LEVEL, json.level);
        json.unitText = constant.convertText(constant.BUSINESS.EQUIPMENT.UNIT, json.unit);
        json.isSpecialText = constant.convertText(constant.NORMAL.YES_OR_NO, json.isSpecial);
        json.isMeteringText = constant.convertText(constant.NORMAL.YES_OR_NO, json.isMetering);
        json.runningStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, json.runningStatus);
        json.runningStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.RUNNING_STATUS, json.runningStatus);
        json.useStatusText = constant.convertText(constant.BUSINESS.EQUIPMENT.USE_STATUS, json.useStatus);
        json.useStatusConstant = constant.convertItem(constant.BUSINESS.EQUIPMENT.USE_STATUS, json.useStatus);
      },
    });
  },
  maintainCategorys(page, size, searchParams) {
    return request({
      url: serverUrl + '/api/v1/base/maintainCate/list',
      method: 'get',
      data: {
        ...searchParams,
      },
    });
  },
  maintainItems(page, size, searchParams) {
    return request({
      url: serverUrl + '/api/v1/base/maintainItem/list',
      method: 'get',
      data: {
        ...searchParams,
      },
      formatAppend: {
        key: 'id',
        serial: true,
      },
      formatFunction: (res) => {
        let json = res.result;

        if (!searchParams.existIds || searchParams.existIds.length <= 0) {
          json.records = [];
        }

        json.records.map(function (item) {
          item.cateText = item.cate?.name;

          item.gradeText = constant.convertText(constant.BUSINESS.MAINTAIN_ITEM.GRADE, item.grade);
          item.methodText = constant.convertText(constant.BUSINESS.MAINTAIN_ITEM.METHOD, item.method);
          item.cycleUnitText = constant.convertText(constant.BUSINESS.MAINTAIN_ITEM.CYCLE_UNIT, item.cycleUnit);
        })
      }
    });
  },
  repairCategorys(page, size, searchParams) {
    return request({
      url: serverUrl + '/api/v1/base/repairCate/list',
      method: 'get',
      data: {
        ...searchParams,
      },
    });
  },
  repairItems(page, size, searchParams) {
    return request({
      url: serverUrl + '/api/v1/base/repairItem/list',
      method: 'get',
      data: {
        ...searchParams,
      },
      formatAppend: {
        key: 'id',
        serial: true,
      },
      formatFunction: (res) => {
        let json = res.result;

        if (!searchParams.existIds || searchParams.existIds.length <= 0) {
          json.records = [];
        }

        json.records.map(function (item) {
          item.cateId = item.cate?.id;
          item.cateText = item.cate?.name;
          item.deviceId = item.device?.id;
          item.deviceText = item.device?.name;
          item.orderId = item.order?.id;
          item.orderText = item.order?.name;
        })
      }
    });
  },
  checkPoints(page, size, searchParams) {
    return request({
      url: serverUrl + '/api/v1/base/checkPoint/list',
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

        if (!searchParams.existIds || searchParams.existIds.length <= 0) {
          json.records = [];
        }

        json.records.map(function (item) {
          item.officeId = item.office?.id;
          item.officeText = item.office?.name;

          item.typeText = constant.convertText(constant.BUSINESS.CHECK_POINT.TYPE, item.type);
          item.checkTypeText = constant.convertText(constant.BUSINESS.CHECK_POINT.CHECK_TYPE, item.checkType);
          item.inUseText = constant.convertText(constant.NORMAL.YES_OR_NO_BOOL, item.inUse);
        })
      }
    });
  },
};

export default commonApi;
