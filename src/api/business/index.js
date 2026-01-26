import common from './common';
// import home from './home/index';

// customer
import customer from './customer/customer';
import customerContact from './customer/contact';

// project
import project from './project/project';
import projectSupport from './project/support';
import projectBudget from './project/budget';
import projectBudgetItem from './project/budgetItem';
import projectMaterial from './project/material';

// schedule
import schedule from './schedule/index';

// engineering
import engineeringSupport from './engineering/support';
import engineeringBudget from './engineering/budget';
import engineeringBudgetItem from './engineering/budgetItem';

// research
import researchSupport from './research/support';
import researchBudget from './research/budget';
import researchBudgetItem from './research/budgetItem';

// software
import softwareSupport from './software/support';
import softwareBudget from './software/budget';
import softwareBudgetItem from './software/budgetItem';

// energy
import energySupport from './energy/support';
import energyBudget from './energy/budget';
import energyBudgetItem from './energy/budgetItem';

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

	// customer
	customer,
	customerContact,

	// project
	project,
	projectSupport,
	projectBudget,
	projectBudgetItem,
	projectMaterial,

	// schedule
	schedule,

	// engineering,
	engineeringSupport,
	engineeringBudget,
	engineeringBudgetItem,

	// research,
	researchSupport,
	researchBudget,
	researchBudgetItem,

	// software,
	softwareSupport,
	softwareBudget,
	softwareBudgetItem,

	// energy,
	energySupport,
	energyBudget,
	energyBudgetItem,

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
