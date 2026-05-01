'use strict';

const RULES = {
  SALE_VILLAGE: [
    { name: 'STAMP', type: 'STAMP' },
    { name: 'REG_FEE', type: 'REG_FEE' },
    { name: 'LOCAL_TAX', type: 'PERCENT', rate: 2 },
    { name: 'TOWN_TAX', type: 'PERCENT', rate: 3 }
  ],

  SALE_TOWN: [
    { name: 'STAMP', type: 'STAMP' },
    { name: 'REG_FEE', type: 'REG_FEE' },
    { name: 'LOCAL_TAX', type: 'PERCENT', rate: 3 },
    { name: 'TOWN_TAX', type: 'PERCENT', rate: 3 }
  ],

  SALE_TOWN_LAND: [
    { name: 'STAMP', type: 'STAMP' },
    { name: 'REG_FEE', type: 'REG_FEE' },
    { name: 'LOCAL_TAX', type: 'LAND_FIXED' },
    { name: 'TOWN_TAX', type: 'PERCENT', rate: 3 }
  ],

  SALE_TOWN_FLAT: [
    { name: 'STAMP', type: 'STAMP' },
    { name: 'REG_FEE', type: 'REG_FEE' },
    { name: 'LOCAL_TAX_1', type: 'DSM_PERCENT', rate: 3 },
    { name: 'LOCAL_TAX_2', type: 'DSM_PERCENT', rate: 3 },
    { name: 'TOWN_TAX', type: 'PERCENT', rate: 3 },
    { name: 'INCOME_TAX', type: 'INCOME', rate: 300 },
    { name: 'VAT', type: 'PERCENT', rate: 2 }
  ],

  SALE_TOWN_SHOP: [
    { name: 'STAMP', type: 'STAMP' },
    { name: 'REG_FEE', type: 'REG_FEE' },
    { name: 'LOCAL_TAX_1', type: 'DSM_PERCENT', rate: 3 },
    { name: 'LOCAL_TAX_2', type: 'DSM_PERCENT', rate: 3 },
    { name: 'TOWN_TAX', type: 'PERCENT', rate: 3 },
    { name: 'INCOME_TAX', type: 'INCOME', rate: 1000 },
    { name: 'VAT', type: 'PERCENT', rate: 2 }
  ],

  DEED_GIFT: [
    { name: 'STAMP', type: 'STAMP' },
    { name: 'REG_FEE', type: 'REG_FEE' },
    { name: 'TOWN_TAX', type: 'PERCENT', rate: 3 }
  ]
};

export default RULES;
