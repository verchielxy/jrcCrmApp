/* 公用枚举类型导入 */
import normal from './modules/normal';
import user from './modules/user';
import permission from './modules/permission';
import message from './modules/message';

/* 业务枚举类型导入 */
import departments from './modules/business/departments';
import customer from './modules/business/customer';
import project from './modules/business/project';
import projectContract from './modules/business/projectContract';
import schedule from './modules/business/schedule';
import purchase from './modules/business/purchase';
import support from './modules/business/support';
import materialApply from './modules/business/materialApply';
import parityReview from './modules/business/parityReview';

/* 枚举类型 */
const constant = {
	...normal,
	...user,
	...permission,
	...message,

	BUSINESS: {
		...departments,
		...customer,
		...project,
		...projectContract,
		...schedule,
		...purchase,
		...support,
		...materialApply,
		...parityReview,
		MATERIAL_DEPARTMENTS: [
			{
				label: '工程部',
				key: 1,
			},
		],
	},
};

constant.convertText = (list, value, showKey = 'label') => {
	let text = value;
	list.map(function (item) {
		if (item.key === value || item.key === parseInt(value)) {
			text = item[showKey];
		}
	})
	return text;
}

constant.convertItem = (list, value) => {
	let row;
	list.map(function (item) {
		if (item.key === value || item.key === parseInt(value)) {
			row = item;
		}
	})
	return row;
}

export default constant;
