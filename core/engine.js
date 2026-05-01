'use strict';

import RULES from './rules.js';
import {
  percent,
  withBankFee,
  calcStamp,
  calcRegFee,
  calcIncomeTax,
  multiply,
  toInt
} from './utils.js';

function computeBase(rule, input) {
  const deed = toInt(input.deed_amount || 0);

  switch (rule.type) {
    case 'STAMP':
      return calcStamp(deed, input.stamp_attached || 0);

    case 'REG_FEE':
      return calcRegFee(deed);

    case 'PERCENT':
      return percent(deed, rule.rate);

    case 'LAND_FIXED':
      return multiply(input.land_size || 0, 2500);

    case 'DSM_PERCENT':
      return percent(input.per_dsm_price || 0, rule.rate);

    case 'INCOME':
      return calcIncomeTax(input.square_feet || 0, rule.rate);

    default:
      throw new Error(`Unknown rule type: ${rule.type}`);
  }
}

export function calculate(deedType, input) {
  const rules = RULES[deedType];

  if (!rules) {
    throw new Error(`Invalid deed type: ${deedType}`);
  }

  const breakdown = [];
  let grandTotal = 0;

  for (const rule of rules) {
    const base = computeBase(rule, input);
    const result = withBankFee(base);

    breakdown.push({
      name: rule.name,
      base: result.base,
      bank_fee: result.bank_fee,
      total: result.total
    });

    grandTotal += result.total;
  }

  return {
    breakdown,
    grand_total: grandTotal
  };
}
