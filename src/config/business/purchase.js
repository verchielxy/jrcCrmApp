import constant from '@/constant';
import { isNullOrUndefined, floatMul } from '@utils/tools';

const common = {
	dataTableColumns: [
		{
			title: '产品名称',
			key: 'productName',
			dataIndex: 'productName',
			width: 160,
		},
		{
			title: '产品分类',
			key: 'productCategoryName',
			dataIndex: 'productCategoryName',
		},
		{
			title: '产品品牌',
			key: 'productBrandName',
			dataIndex: 'productBrandName',
		},
		{
			title: '规格参数',
			key: 'productSpec',
			dataIndex: 'productSpec',
			width: 220,
		},
		{
			title: '产品型号',
			key: 'productModel',
			dataIndex: 'productModel',
		},
	],
	productAdd: (products, productId, suppliers, supplierId, price, amount, addons = {}) => {
		let row;
		products.map(function (product) {
			if (product.id === productId) {
				let rowKey = addons && addons.id ? addons.id : 'product_' + productId;
				if (supplierId) {
					rowKey = rowKey + '_' + supplierId;
				}
				row = {
					...addons,
					key: rowKey,
					goodsId: productId,
					productId: productId,
					productName: product.name,
					productCategoryName: product.category.name,
					productBrandName: product.brand.name,
					productSpec: product.spec,
					productModel: product.model,
					supplier: suppliers.find(item => item.id === supplierId),
				};
				if (row.supplier) {
					row.supplierId = row.supplier.id;
					row.supplierName = row.supplier.name;
				}

				if (!isNullOrUndefined(price)) {
					row.price = price;
				}
				if (!isNullOrUndefined(amount)) {
					row.amount = amount;
				}
				if (!isNullOrUndefined(price) && !isNullOrUndefined(amount)) {
					row.totalMoney = floatMul(price, amount);
				}

				if (!isNullOrUndefined(row.payStatus)) {
					row.statusText = constant.convertText(constant.BUSINESS.PURCHASE.ORDER.PRODUCT_STATUS, row.payStatus);
					row.statusConstant = constant.convertItem(constant.BUSINESS.PURCHASE.ORDER.PRODUCT_STATUS, row.payStatus);
				}
			}
		})
		return row;
	},
	productRebuild: (products, suppliers, list) => {
		let rows = [];

		list.map(function (item) {
			let row = common.productAdd(products, item.goods?.id, suppliers, item.supplier ? item.supplier.id : item.supplierId, item.price, item.amount, item);
			if (row) {
				rows.push(row);
			}
		})

		return rows;
	},
}

const purchaseConfig = {
	order: {
		modalWidth: '1450px',
		dataTableColumns: [
			...common.dataTableColumns,
			{
				title: '单价',
				key: 'price',
				dataIndex: 'price',
				width: 80,
			},
			{
				title: '数量',
				key: 'amount',
				dataIndex: 'amount',
				width: 80,
			},
			{
				title: '总价',
				key: 'totalMoney',
				dataIndex: 'totalMoney',
				width: 90,
			},
		],

		canEdit: (record) => {
			return record && ( record.payStatus === 0 || record.payStatus === 1 );
		},
		canDelete: (record) => {
			return record && ( record.payStatus === 0 );
		},
		canProductPaid: (record) => {
			return (record && record.payStatus === 0) || (record && record.payStatus === 1);
		},
		productAdd: common.productAdd,
		productRebuild: common.productRebuild,
		productCanOperate: (record) => {
			return record && record.payStatus === 0;
		},
		productCanPaid: (record) => {
			return record && record.payStatus === 0;
		},
	},
	receipt: {
		modalWidth: '1500px',
		dataTableColumns: [
			...common.dataTableColumns,
			{
				title: '单价',
				key: 'price',
				dataIndex: 'price',
				width: 80,
			},
		],

		canPush: (record) => {
			return record && ( record.status === 0 || record.status === 2 );
		},
		canEdit: (record) => {
			return record && ( record.status === 0 || record.status === 2 );
		},
		canDelete: (record) => {
			return record && ( record.status === 0 || record.status === 2 );
		},
		productAdd: common.productAdd,
		productRebuild: common.productRebuild,
	},
	parity: {
		modalWidth: '1500px',
		dataTableColumns: [
			...common.dataTableColumns,
			{
				title: '单价',
				key: 'price',
				dataIndex: 'price',
				width: 120,
			},
		],

		canPush: (record) => {
			return record && record.status === 0;
		},
		canEdit: (record) => {
			return record && record.status === 0;
		},
		canDelete: (record) => {
			return record && record.status === 0;
		},
		productAdd: common.productAdd,
		productRebuild: common.productRebuild,
	},
	parityReview: {
		canPush: (record) => {
			return record && record.status === 0;
		},
	},
};

export default purchaseConfig;
