const scheduleConfig = {
	badge: {
		customer: 'success',
		project: 'processing',
		customize: 'warning',
	},

	titleName: (schedule) => {
		const names = {
			customer: '客户',
			project: '项目',
			customize: '日程标题',
		}
		return names[schedule.category] ? names[schedule.category] : '';
	},

	title: (schedule) => {
		return schedule.category === 'customize' ? schedule.title : schedule.relatedEntity?.name;
	},

	canOperate: (schedule, user) => {
		return schedule.createBy.id === user.id;
	},
};

export default scheduleConfig;
