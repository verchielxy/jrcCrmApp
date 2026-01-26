
const engineeringConfig = {
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
};

export default engineeringConfig;
