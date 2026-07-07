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
					image: '/static/images/home/customerList.png',
					name: '客户列表',
				},
				{
					key: '/manage/customer/contact',
					url: '/pages/business/customer/contact/index',
					icon: 'inbox_text_person',
					image: '/static/images/home/customerContact.png',
					name: '客户联系人',
				},
			],
		},
		{
			key: '/manage/project',
			name: '项目管理',
			// hide: true,
			children: [
				{
					key: '/manage/project/list',
					url: '/pages/business/project/list/index',
					icon: 'auto_awesome_mosaic',
					image: '/static/images/home/projectList.png',
					name: '项目列表',
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
				{
					key: '/manage/engineering/project',
					url: '/pages/business/engineering/project/index',
					icon: 'auto_awesome_mosaic',
					image: '/static/images/home/projectList.png',
					name: '项目列表',
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
			key: '/manage/workflow/approval',
			name: '审批管理',
			children: [
				{
					key: '/manage/workflow/approval/pending',
					url: '/pages/business/review/pending/index',
					icon: 'redeem',
					image: '/static/images/home/reviewEngineeringContract.png',
					name: '待处理的',
				},
				{
					key: '/manage/workflow/approval/processed',
					url: '/pages/business/review/processed/index',
					icon: 'construction',
					image: '/static/images/home/reviewTechnology.png',
					name: '已处理的',
				},
				{
					key: '/manage/workflow/approval/initiated',
					url: '/pages/business/review/initiated/index',
					icon: 'add_shopping_cart',
					image: '/static/images/home/reviewPurchaseContract.png',
					name: '我发起的',
				},
				{
					key: '/manage/workflow/approval/cc',
					url: '/pages/business/review/cc/index',
					icon: 'dataset_linked',
					image: '/static/images/home/reviewSaleContract.png',
					name: '抄送我的',
				},
			]
		},
	],
};

export default menuConfig;
