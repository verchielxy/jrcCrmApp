const project = {
	PROJECT: {
		TYPE: [
			{
				label: '数字化转型',
				key: 10,
				// 研发部审批
			},
			{
				label: '电力需求侧管理',
				key: 1,
				//工程部审批
			},
			{
				label: '能耗在线监测',
				key: 2,
				//工程部审批
			},
			{
				label: '能源管理系统',
				key: 3,
				//工程部审批
			},
			{
				label: '节能技术及改造',
				key: 4,
				//节能部审批
			},
			{
				label: '能源管理咨询',
				key: 5,
				//节能部审批
			},
			{
				label: '能源托管及运维',
				key: 6,
				//节能部审批
			},
			{
				label: '安全生产管控平台',
				key: 7,
				//工程部审批
			},
			{
				label: '自动化控制系统',
				key: 8,
				//研发部审批
			},
			{
				label: '软件开发',
				key: 9,
				//软件部审批
			},
		],
		GRADE: [
			{
				label: 'A级 - 周期3天',
				key: 1,
			},
			{
				label: 'B级 - 周期7天',
				key: 2,
			},
			{
				label: 'C级 - 周期15天',
				key: 3,
			},
			{
				label: 'D级 - 周期30天',
				key: 4,
			},
		],
		STATUS: [
			{
				label: '跟进中',
				key: 0,
				badge: 'default',
			},
			{
				label: '待技术支持',
				key: 1,
				badge: 'default',
			},
			{
				label: '待报价',
				key: 2,
				badge: 'default',
			},
			{
				label: '销售合同待审核',
				key: 3,
				badge: 'warning',
			},
			{
				label: '销售合同审核失败',
				key: 4,
				badge: 'error',
			},
			{
				label: '销售合同已签订',
				key: 5,
				badge: 'success',
			},
			{
				label: '技术协议待审核',
				key: 6,
				badge: 'warning',
			},
			{
				label: '技术协议审核失败',
				key: 7,
				badge: 'error',
			},
			{
				label: '技术协议已通过',
				key: 8,
				badge: 'success',
			},
			{
				label: '施工转接待审核',
				key: 9,
				badge: 'warning',
			},
			{
				label: '施工转接审核失败',
				key: 10,
				badge: 'error',
			},
			{
				label: '施工转接已通过',
				key: 11,
				badge: 'success',
			},
			{
				label: '施工结束',
				key: 12,
				badge: 'default',
			},
			{
				label: '施工已验收',
				key: 13,
				badge: 'success',
			},
			{
				label: '暂停',
				key: 99,
				badge: 'default',
			},
		],
		QUALITY: [
			{
				label: '优秀',
				key: 1,
			},
			{
				label: '良好',
				key: 2,
			},
			{
				label: '合格',
				key: 3,
			},
		],
	},
}

export default project;
