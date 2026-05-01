'use strict';

export function toInt(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('Invalid number input');
  }
  return Math.trunc(value);
}

export function percent(base, rate) {
  return Math.trunc((base * rate) / 100);
}

export function bankFee(amount) {
  amount = toInt(amount);
  return amount <= 100000 ? 58 : 115;
}

export function withBankFee(base) {
  base = toInt(base);

  const fee = bankFee(base);

  return {
    base,
    bank_fee: fee,
    total: base + fee
  };
}

export function calcStamp(deedAmount, stampAttached) {
  const raw = percent(deedAmount, 1.5);
  const result = raw - toInt(stampAttached);
  return result < 0 ? 0 : result;
}

export function calcRegFee(deedAmount) {
  return percent(deedAmount, 1) + 388;
}

export function calcIncomeTax(squareFeet, rate) {
  if (typeof squareFeet !== 'number' || squareFeet <= 0) {
    throw new Error('Invalid squareFeet');
  }

  const raw = (squareFeet / 10.76) * rate;
  return Math.ceil(raw);
}

export function multiply(a, b) {
  return toInt(a * b);
}
