const materialApply = {
	MATERIAL_APPLY: {
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
		]
	}
}

export default materialApply;
