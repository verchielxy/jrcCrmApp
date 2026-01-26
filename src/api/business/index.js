import common from './common';
// import home from './home/index';

// my
import myCheck from '@api/business/my/check';
import myRepair from '@api/business/my/repair';
import myMaintain from '@api/business/my/maintain';

// business
import equipment from '@api/business/equipment/index';

// review
import reviewSaleContract from './review/saleContract';
import reviewEngineeringContract from './review/engineeringContract';
import reviewPurchaseContract from './review/purchaseContract';
import reviewTechnology from './review/technology';
import reviewConstruction from './review/construction';
import reviewMaterialApply from './review/materialApply';
import reviewReceipt from './review/receipt';


const businessApi = {
	common,
	// home,

	myCheck,
	myRepair,
	myMaintain,
	equipment,

	// review,
	reviewSaleContract,
	reviewEngineeringContract,
	reviewPurchaseContract,
	reviewTechnology,
	reviewConstruction,
	reviewMaterialApply,
	reviewReceipt,
}

export default businessApi;
