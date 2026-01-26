const projectTract = {
	PROJECT_CONTRACT: {
		TYPE: [
			{
				label: '销售合同',
				key: 1,
			},
			{
				label: '工程合同',
				key: 2,
			},
			{
				label: '采购合同',
				key: 3,
			},
		],
		PAY_TYPE: [
			{
				label: '全额支付',
				key: 1,
			},
			{
				label: '部分支付',
				key: 2,
			},
		],
		STATUS: [
			{
				label: '待发布',
				key: 0,
				badge: 'default',
			},
			{
				label: '待审核',
				key: 1,
				badge: 'warning',
			},
			{
				label: '审核失败',
				key: 2,
				badge: 'error',
			},
			{
				label: '审核通过',
				key: 3,
				badge: 'success',
			},
		],
	},
}

export default projectTract;
