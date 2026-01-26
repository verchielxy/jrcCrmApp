const schedule = {
	SCHEDULE: {
		CATEGORY: [
			{
				label: '客户日程',
				key: 'customer',
			},
			{
				label: '项目日程',
				key: 'project',
			},
			{
				label: '自定义日程',
				key: 'customize',
			},
		],
		TYPE: [
			{
				label: '线下拜访',
				key: 'offline',
			},
			{
				label: '线上沟通',
				key: 'online',
			},
		],
		REMIND: [
			{
				label: '开始前一天17:30',
				key: 'dayAfter',
			},
			{
				label: '开始前2小时',
				key: 'before2',
			},
			{
				label: '开始前1小时',
				key: 'before1',
			},
		],
	},
}

export default schedule;
