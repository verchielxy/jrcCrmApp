
const engineeringConfig = {
	project: {
		keys: ['engineering:all'],
		canUserSet: (record) => {
			return authentication.auths(engineeringConfig.project.keys);
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
	},
	materialApply : {
		// 是否可以提交审核
		canPush: (status) => {
			return status === 0 || status === 2;
		},
		// 是否可以编辑和删除
		canEdit: (status) => {
			return status === 0 || status === 2;
		},
	},
	spotPurchase : {
		// 是否可以提交审核
		canPush: (status) => {
			return status === 0 || status === 2;
		},
		// 是否可以编辑和删除
		canEdit: (status) => {
			return status === 0 || status === 2;
		},
	},
};

export default engineeringConfig;
