import constant from '@/constant';

export default [
	{
		title: '产品名称',
		key: 'goodsName',
		width: 120,
		fixed: 'left',
	},
	{
		title: '规格参数',
		key: 'goodsSpec',
		width: 250,
	},
	{
		title: '产品型号',
		key: 'goodsModel',
		width: 200,
	},
	{
		title: '数量',
		key: 'amount',
		width: 60,
	},
	{
		title: '单价',
		key: 'salePrice',
		dataIndex: 'salePrice',
		width: 80,
	},
	{
		title: '总价',
		key: 'totalMoney',
		dataIndex: 'totalMoney',
		width: 90,
	},
	{
		title: '创建人',
		key: 'createByName',
		dataIndex: 'createByName',
		width: 100,
	},
	{
		title: '创建时间',
		key: 'createTime',
		dataIndex: 'createTime',
		width: 150,
	},
	{
		title: '报价人',
		key: 'offerByName',
		dataIndex: 'offerByName',
		width: 100,
	},
	{
		title: '报价时间',
		key: 'offerTime',
		dataIndex: 'offerTime',
		width: 120,
	},
	{
		title: '报价备注',
		key: 'purchaseRemarks',
		dataIndex: 'purchaseRemarks',
		width: 160,
	},
];
