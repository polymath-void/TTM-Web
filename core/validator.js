'use strict';

const REQUIRED_FIELDS = {
  SALE_VILLAGE: ['deed_amount', 'stamp_attached'],
  SALE_TOWN: ['deed_amount', 'stamp_attached'],
  SALE_TOWN_LAND: ['deed_amount', 'stamp_attached', 'land_size'],
  SALE_TOWN_FLAT: ['deed_amount', 'stamp_attached', 'square_feet', 'per_dsm_price'],
  SALE_TOWN_SHOP: ['deed_amount', 'stamp_attached', 'square_feet', 'per_dsm_price'],
  DEED_GIFT: ['deed_amount', 'stamp_attached']
};

function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

export function validate(deedType, input) {
  const required = REQUIRED_FIELDS[deedType];

  if (!required) {
    throw new Error(`Unknown deed type: ${deedType}`);
  }

  for (const field of required) {
    if (!(field in input)) {
      throw new Error(`Missing field: ${field}`);
    }

    if (!isValidNumber(input[field])) {
      throw new Error(`Invalid number for: ${field}`);
    }

    if (input[field] < 0) {
      throw new Error(`Negative value not allowed: ${field}`);
    }
  }

  return true;
}
