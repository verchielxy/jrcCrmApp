export default [
	{
		title: '开工日期',
		type: 'text',
		name: 'buildTransferStartTime',
	},
	{
		title: '完工日期',
		type: 'text',
		name: 'buildTransferEndTime',
	},
	{
		title: '施工质量',
		type: 'text',
		name: 'buildTransferWorkQualityText',
	},
	{
		title: '附件',
		type: 'download',
		name: 'buildTransferDownload',
	},
	{
		title: '施工地址',
		type: 'text',
		name: 'buildTransferAddress',
	},
	{
		title: '甲方负责人',
		type: 'text',
		name: 'buildTransferFirstPartyUser',
	},
	{
		title: '甲方电话',
		type: 'text',
		name: 'buildTransferFirstPartyPhone',
	},

	{
		title: '施工转接备注',
		type: 'content',
		name: 'buildTransferRemarks',
	},
	{
		title: '审核进度',
		type: 'slotList',
		name: 'buildTransferOpLogList',
		slot: 'buildTransferReview',
	},
];
