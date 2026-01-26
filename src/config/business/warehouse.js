import constant from '@/constant';
import { isNullOrUndefined, floatMul } from '@utils/tools';

const warehouseConfig = {
	order: {
		modalWidth: '1350px',
		tableColumns: [
			{
				title: '产品名称',
				key: 'productName',
				dataIndex: 'productName',
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

		productAdd: (products, productId, price, amount, addons = {}) => {
			let row;
			products.map(function (product) {
				if (product.id === productId) {
					row = {
						...addons,
						key: addons && addons.id ? addons.id : 'product_' + productId,
						goodsId: productId,
						productId: productId,
						productName: product.name,
						productCategoryName: product.category.name,
						productBrandName: product.brand.name,
						productSpec: product.spec,
						productModel:  product.model,
					};

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
		productRebuild: (products, list) => {
			let rows = [];

			list.map(function (item) {
				let row = warehouseConfig.order.productAdd(products, item.goods?.id, item.price, item.amount, item);
				if (row) {
					rows.push(row);
				}
			})

			return rows;
		},
	},
};

export default warehouseConfig;
