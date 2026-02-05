const menuConfig = {
	overrideFields: {
		icon: 'icon',
		url: 'url',
		image: 'image',
		hide: 'hide',
	},
	allows: [
		{
			key: '/manage/schedule',
			url: '/pages/business/schedule/index',
			icon: 'calendar_month',
			image: '/static/images/home/schedule.png',
			name: '日程管理',
		},
		{
			key: '/manage/customer',
			name: '客户管理',
			// hide: true,
			children: [
				{
					key: '/manage/customer/list',
					url: '/pages/business/customer/list/index',
					icon: 'account_child',
					image: '/static/images/home/customer_list.png',
					name: '客户列表',
				},
				{
					key: '/manage/customer/contact',
					url: '/pages/business/customer/contact/index',
					icon: 'inbox_text_person',
					image: '/static/images/home/customer_contact.png',
					name: '客户联系人',
				},
			],
		},
		{
			key: '/manage/engineering',
			name: '工程管理',
			children: [
				{
					key: '/manage/engineering/support',
					url: '/pages/business/engineering/support/index',
					icon: 'flowsheet',
					image: '/static/images/home/support.png',
					name: '技术支持',
				},
				{
					key: '/manage/engineering/budgetChecklist',
					url: '/pages/business/engineering/budgetChecklist/index',
					icon: 'list_alt',
					image: '/static/images/home/budgetChecklist.png',
					name: '预算清单',
				},
			],
		},
		{
			key: '/manage/research',
			name: '研发管理',
			children: [
				{
					key: '/manage/research/support',
					url: '/pages/business/research/support/index',
					icon: 'flowsheet',
					image: '/static/images/home/support.png',
					name: '技术支持',
				},
				{
					key: '/manage/research/budgetChecklist',
					url: '/pages/business/research/budgetChecklist/index',
					icon: 'list_alt',
					image: '/static/images/home/budgetChecklist.png',
					name: '预算清单',
				},
			],
		},
		{
			key: '/manage/software',
			name: '软件管理',
			children: [
				{
					key: '/manage/software/support',
					url: '/pages/business/software/support/index',
					icon: 'flowsheet',
					image: '/static/images/home/support.png',
					name: '技术支持',
				},
				{
					key: '/manage/software/budgetChecklist',
					url: '/pages/business/software/budgetChecklist/index',
					icon: 'list_alt',
					image: '/static/images/home/budgetChecklist.png',
					name: '预算清单',
				},
			],
		},
		{
			key: '/manage/energy',
			name: '节能管理',
			children: [
				{
					key: '/manage/energy/support',
					url: '/pages/business/energy/support/index',
					icon: 'flowsheet',
					image: '/static/images/home/support.png',
					name: '技术支持',
				},
				{
					key: '/manage/energy/budgetChecklist',
					url: '/pages/business/energy/budgetChecklist/index',
					icon: 'list_alt',
					image: '/static/images/home/budgetChecklist.png',
					name: '预算清单',
				},
			],
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
