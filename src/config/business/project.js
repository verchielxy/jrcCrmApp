import moment from 'moment/moment'
import {randomCustomNumber} from '@utils/tools'
import serverUrl from '@api/serviceUrl'
import uploadConfig from '@/config/upload'

const projectConfig = {
	// 是否可以进行技术支持
	canSupport: (status) => {
		return true;
	},
	// 是否可以进行预算清单
	canBudgetChecklist: (status) => {
		return true;
	},
	// 是否可以进行合同上传
	canContract: (status) => {
		return status === 2 || status === 4;
	},
	// 是否可以进行技术协议上传
	canTechnology: (status) => {
		return status === 5 || status === 7;
	},
	// 是否可以进行施工转接上传
	canConstruction: (status) => {
		return status === 8 || status === 10;
	},
	// 是否可以进行物料申请
	canMaterialApply: (status) => {
		return status >= 11;
	},
	// 是否可以进行物料到场核验
	canMaterialVerify: (status) => {
		return status >= 11;
	},
	// 是否可以施工结束
	canConstructionEnd: (status) => {
		return status === 11;
	},
	// 是否可以施工验收
	canConstructionAcceptance: (status) => {
		return status >= 12;
	},

};

export default projectConfig;
