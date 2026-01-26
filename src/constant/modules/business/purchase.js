const purchase = {
	PURCHASE: {
		ORDER: {
			STATUS: [
				{
					label: '未付款',
					key: 0,
					badge: 'default',
				},
				// {
				// 	label: '待审核',
				// 	key: 1,
				// 	badge: 'warning',
				// },
				// {
				// 	label: '审核失败',
				// 	key: 2,
				// 	badge: 'error',
				// },
				// {
				// 	label: '审核成功',
				// 	key: 3,
				// 	badge: 'success',
				// },
				{
					label: '部分付款',
					key: 1,
					badge: 'warning',
				},
				{
					label: '已付款',
					key: 2,
					badge: 'success',
				},
			],
			PRODUCT_STATUS: [
				{
					label: '待付款',
					key: 0,
					badge: 'default',
				},
				{
					label: '已付款',
					key: 2,
					badge: 'success',
				},
			],
		},
		RECEIPT: {
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
					label: '审核成功',
					key: 3,
					badge: 'success',
				},
			],
			URGENCY_LEVEL: [
				{
					label: '普通',
					key: 0,
				},
				{
					label: '要紧',
					key: 1,
				},
				{
					label: '紧急',
					key: 2,
				},
			],
		},
		PARITY: {
			STATUS: [
				{
					label: '待发布',
					key: 0,
					badge: 'default',
				},
				{
					label: '已发布',
					key: 1,
					badge: 'success',
				},
			],
		},
	}
}

export default purchase;
