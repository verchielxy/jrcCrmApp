export default [
	{
		title: '项目成交金额',
		type: 'text',
		name: 'dealMoney',
	},
	{
		title: '1%税率金额',
		type: 'text',
		name: 'contractTaxRate4',
	},
	{
		title: '6%税率金额',
		type: 'text',
		name: 'contractTaxRate1',
	},
	{
		title: '9%税率金额',
		type: 'text',
		name: 'contractTaxRate2',
	},
	{
		title: '13%税率金额',
		type: 'text',
		name: 'contractTaxRate3',
	},
	{
		title: '税额',
		type: 'text',
		name: 'contractTaxMoney',
	},
	{
		title: '付款类型',
		type: 'text',
		name: 'contractPayTypeText',
	},
	{
		title: '合同下载',
		type: 'download',
		name: 'contractDownload',
	},
	{
		title: '合同主要内容',
		type: 'content',
		name: 'contractContent',
	},
	{
		title: '合同付款方式',
		type: 'slotList',
		name: 'contractPayModList',
		slot: 'payModList',
	},
	{
		title: '审核进度',
		type: 'slotList',
		name: 'contractOpLogList',
		slot: 'contractReview',
	},
];
