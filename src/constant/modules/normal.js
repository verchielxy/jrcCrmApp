const normal = {
	NORMAL: {
		YES_OR_NO: [
			{
				label: '否',
				key: 0,
			},
			{
				label: '是',
				key: 1,
			},
		],
		YES_OR_NO_BOOL: [
			{
				label: '否',
				key: false,
			},
			{
				label: '是',
				key: true,
			},
		],
		TREE_SEARCH_LEVEL: [
			{
				label: '本级和子级',
				key: 1,
			},
			{
				label: '仅本级',
				key: 2,
			},
			{
				label: '仅子级',
				key: 3,
			},
		],
		APPLY_STATUS: [
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
		REVIEW_STATUS: [
			{
				label: '审核未通过',
				key: 0,
				badge: 'error',
			},
			{
				label: '审核已通过',
				key: 1,
				badge: 'success',
			},
		],
	},
}

export default normal;
