'use strict';

import { calculate } from './core/engine.js';
import { validate } from './core/validator.js';

/**
 * State
 */
let lastResult = null;

const HISTORY_KEY = 'ttm_history';
const HISTORY_LIMIT = 10;

/**
 * DOM references
 */
const deedTypeEl = document.getElementById('deedType');
const calculateBtn = document.getElementById('calculateBtn');

const errorBox = document.getElementById('errorBox');
const resultBox = document.getElementById('resultBox');
const resultBody = document.getElementById('resultBody');
const grandTotalEl = document.getElementById('grandTotal');

const historyList = document.getElementById('historyList');

/**
 * Input fields
 */
const fields = {
  deed_amount: document.getElementById('deed_amount'),
  stamp_attached: document.getElementById('stamp_attached'),
  land_size: document.getElementById('land_size'),
  square_feet: document.getElementById('square_feet'),
  per_dsm_price: document.getElementById('per_dsm_price')
};

/**
 * Helpers
 */
function toggle(el, show) {
  el.classList.toggle('hidden', !show);
}

function resetUI() {
  errorBox.classList.add('hidden');
  resultBox.classList.add('hidden');
  resultBody.innerHTML = '';
  grandTotalEl.textContent = '0';
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
}

function getInput() {
  return {
    deed_amount: Number(fields.deed_amount.value),
    stamp_attached: Number(fields.stamp_attached.value),
    land_size: Number(fields.land_size.value),
    square_feet: Number(fields.square_feet.value),
    per_dsm_price: Number(fields.per_dsm_price.value)
  };
}

/**
 * Download helper
 */
function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

/**
 * Export
 */
function exportJSON(data) {
  const content = JSON.stringify(data, null, 2);
  downloadFile('pay_order.json', content, 'application/json');
}

function exportCSV(result) {
  let csv = 'Name,Base,Bank Fee,Total\n';

  result.breakdown.forEach(r => {
    csv += `${r.name},${r.base},${r.bank_fee},${r.total}\n`;
  });

  csv += `\nGRAND TOTAL,, ,${result.grand_total}`;

  downloadFile('pay_order.csv', csv, 'text/csv');
}

/**
 * History storage
 */
function saveHistory(entry) {
  let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

  history.unshift(entry);

  if (history.length > HISTORY_LIMIT) {
    history = history.slice(0, HISTORY_LIMIT);
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function loadHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
}

/**
 * History UI
 */
function renderHistory() {
  if (!historyList) return;

  historyList.innerHTML = '';

  const history = loadHistory();

  history.forEach(item => {
    const li = document.createElement('li');

    const time = new Date(item.timestamp).toLocaleTimeString();

    const input = item.input;

    // Build compact input summary
    const parts = [
      `Deed: ${input.deed_amount}`,
      `Stamp: ${input.stamp_attached}`
    ];

    if (input.land_size > 0) {
      parts.push(`Land: ${input.land_size}`);
    }

    if (input.square_feet > 0) {
      parts.push(`Sqft: ${input.square_feet}`);
    }

    if (input.per_dsm_price > 0) {
      parts.push(`DSM: ${input.per_dsm_price}`);
    }

    const inputSummary = parts.join(', ');

    li.textContent =
      `${time} | ${item.type} | ${inputSummary} | Total: ${item.result.grand_total}`;

    historyList.appendChild(li);
  });
}

/**
 * Dynamic field control
 */
function handleDeedChange() {
  const type = deedTypeEl.value;

  toggle(document.getElementById('land_size_field'), false);
  toggle(document.getElementById('square_feet_field'), false);
  toggle(document.getElementById('per_dsm_price_field'), false);

  if (type === 'SALE_TOWN_LAND') {
    toggle(document.getElementById('land_size_field'), true);
  }

  if (type === 'SALE_TOWN_FLAT' || type === 'SALE_TOWN_SHOP') {
    toggle(document.getElementById('square_feet_field'), true);
    toggle(document.getElementById('per_dsm_price_field'), true);
  }
}

/**
 * Render result
 */
function render(result) {
  resultBody.innerHTML = '';

  result.breakdown.forEach(item => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.base}</td>
      <td>${item.bank_fee}</td>
      <td>${item.total}</td>
    `;

    resultBody.appendChild(row);
  });

  grandTotalEl.textContent = result.grand_total;
  resultBox.classList.remove('hidden');
}

/**
 * Main calculation
 */
function handleCalculate() {
  resetUI();

  try {
    const type = deedTypeEl.value;

    if (!type) {
      throw new Error('Please select deed type');
    }

    const input = getInput();

    validate(type, input);

    const result = calculate(type, input);

    lastResult = result;

    saveHistory({
      timestamp: Date.now(),
      type,
      input,
      result
    });

    render(result);
    renderHistory();
	resultBox.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    showError(err.message);
  }
}

/**
 * Events
 */
deedTypeEl.addEventListener('change', handleDeedChange);
calculateBtn.addEventListener('click', handleCalculate);

const exportJsonBtn = document.getElementById('exportJsonBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');

if (exportJsonBtn) {
  exportJsonBtn.addEventListener('click', () => {
    if (lastResult) exportJSON(lastResult);
  });
}

if (exportCsvBtn) {
  exportCsvBtn.addEventListener('click', () => {
    if (lastResult) exportCSV(lastResult);
  });
}

/**
 * Init
 */
renderHistory();


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
