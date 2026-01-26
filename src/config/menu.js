const menuConfig = {
	overrideFields: {
		icon: 'icon',
		url: 'url',
	},
	allows: [
		{
			key: '/manage/schedule',
			url: '/pages/business/schedule/index',
			icon: 'calendar_month',
			name: '日程管理',
		},
		{
			key: '/manage/review',
			name: '审批管理',
			children: [
				{
					key: '/manage/review/saleContract',
					url: '/pages/business/review/contract/sale/index',
					icon: 'redeem',
					name: '销售合同审批',
				},
				{
					key: '/manage/review/engineeringContract',
					url: '/pages/business/review/contract/engineering/index',
					icon: 'construction',
					name: '工程合同审批',
				},
				{
					key: '/manage/review/purchaseContract',
					url: '/pages/business/review/contract/purchase/index',
					icon: 'add_shopping_cart',
					name: '采购合同审批',
				},
				{
					key: '/manage/review/technology',
					url: '/pages/business/review/technology/index',
					icon: 'dataset_linked',
					name: '技术协议审批',
				},
				{
					key: '/manage/review/construction',
					url: '/pages/business/review/construction/index',
					icon: 'build',
					name: '施工转接审批',
				},
				{
					key: '/manage/review/materialApply',
					url: '/pages/business/review/materialApply/index',
					icon: 'real_estate_agent',
					name: '物料申请审批',
				},
				{
					key: '/manage/review/receipt',
					url: '/pages/business/review/receipt/index',
					icon: 'credit_card',
					name: '付款申请审批',
				},
			]
		},
	],
};

export default menuConfig;
