'use strict';

let currentInput = '0';
let operator = null;
let previousInput = null;
let shouldReset = false;

function computeResult(a, op, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/':
      if (b === 0) return 'Error';
      return a / b;
    default:
      return 'Error';
  }
}

function formatResult(value) {
  if (!isFinite(value)) return 'Error';
  return parseFloat(value.toPrecision(10)).toString();
}

function updateDisplay() {
  if (typeof document === 'undefined') return;

  const displayEl = document.getElementById('display');
  const exprEl    = document.getElementById('expression');

  if (!displayEl) return;

  displayEl.textContent = currentInput;

  displayEl.classList.toggle('long-text',  currentInput.length > 10);
  displayEl.classList.toggle('error-text', currentInput === 'Error');

  if (exprEl) {
    if (operator && previousInput !== null) {
      exprEl.textContent = `${previousInput} ${operatorSymbol(operator)}`;
    } else {
      exprEl.textContent = '';
    }
  }

  if (typeof document !== 'undefined') {
    document.querySelectorAll('.btn-operator').forEach(btn => {
      btn.classList.remove('active-operator');
    });
    if (operator && shouldReset) {
      const activeBtn = document.querySelector(`[data-op="${operator}"]`);
      if (activeBtn) activeBtn.classList.add('active-operator');
    }
  }
}

function operatorSymbol(op) {
  return { '+': '+', '-': '-', '*': '×', '/': '÷' }[op] || op;
}

function appendNumber(n) {
  if (currentInput === 'Error') return;

  if (shouldReset) {
    currentInput = '0';
    shouldReset = false;
  }

  if (n === '.') {
    if (currentInput.includes('.')) return;
    currentInput = currentInput === '' ? '0.' : currentInput + '.';
    updateDisplay();
    return;
  }

  if (currentInput === '0' && n !== '.') {
    currentInput = n;
  } else {
    currentInput += n;
  }

  updateDisplay();
}

function setOperator(op) {
  if (currentInput === 'Error') return;

  if (operator !== null && previousInput !== null && !shouldReset) {
    const a = parseFloat(previousInput);
    const b = parseFloat(currentInput);
    if (!isNaN(a) && !isNaN(b)) {
      const result = computeResult(a, operator, b);
      if (result === 'Error') {
        currentInput = 'Error';
        operator = null;
        previousInput = null;
        shouldReset = false;
        updateDisplay();
        return;
      }
      currentInput = formatResult(result);
    }
  }

  previousInput = currentInput;
  operator = op;
  shouldReset = true;

  updateDisplay();
}

function calculate() {
  if (operator === null || previousInput === null) return;
  if (shouldReset) return;
  if (currentInput === 'Error') return;

  const a = parseFloat(previousInput);
  const b = parseFloat(currentInput);

  if (isNaN(a) || isNaN(b)) return;

  const result = computeResult(a, operator, b);

  if (result === 'Error') {
    currentInput = 'Error';
  } else {
    currentInput = formatResult(result);
  }

  operator      = null;
  previousInput = null;
  shouldReset   = true;

  updateDisplay();
}

function clearAll() {
  currentInput  = '0';
  operator      = null;
  previousInput = null;
  shouldReset   = false;
  updateDisplay();
}

function backspace() {
  if (currentInput === 'Error' || shouldReset) {
    clearAll();
    return;
  }
  if (currentInput.length <= 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '-') currentInput = '0';
  }
  updateDisplay();
}

function handleKeyboard(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  switch (e.key) {
    case '0': case '1': case '2': case '3': case '4':
    case '5': case '6': case '7': case '8': case '9':
      e.preventDefault();
      appendNumber(e.key);
      animateButton(`[aria-label="${e.key}"]`);
      break;
    case '.':
      e.preventDefault();
      appendNumber('.');
      animateButton('[aria-label="소수점"]');
      break;
    case '+':
      e.preventDefault();
      setOperator('+');
      animateButton('[aria-label="더하기"]');
      break;
    case '-':
      e.preventDefault();
      setOperator('-');
      animateButton('[aria-label="빼기"]');
      break;
    case '*':
      e.preventDefault();
      setOperator('*');
      animateButton('[aria-label="곱하기"]');
      break;
    case '/':
      e.preventDefault();
      setOperator('/');
      animateButton('[aria-label="나누기"]');
      break;
    case 'Enter':
    case '=':
      e.preventDefault();
      calculate();
      animateButton('[aria-label="등호"]');
      break;
    case 'Backspace':
      e.preventDefault();
      backspace();
      animateButton('[aria-label="마지막 문자 삭제"]');
      break;
    case 'Escape':
      e.preventDefault();
      clearAll();
      animateButton('[aria-label="전체 초기화"]');
      break;
  }
}

function animateButton(selector) {
  const btn = document.querySelector(selector);
  if (!btn) return;
  btn.classList.add('key-pressed');
  setTimeout(() => btn.classList.remove('key-pressed'), 150);
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const opMap = { '÷': '/', '×': '*', '-': '-', '+': '+' };
    document.querySelectorAll('.btn-operator').forEach(btn => {
      const sym = btn.textContent.trim();
      if (opMap[sym]) btn.setAttribute('data-op', opMap[sym]);
    });

    document.addEventListener('keydown', handleKeyboard);
    updateDisplay();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    computeResult,
    formatResult,
    appendNumber,
    setOperator,
    calculate,
    clearAll,
    backspace,
    getState: () => ({ currentInput, operator, previousInput, shouldReset }),
    setState: (s) => {
      if (s.currentInput  !== undefined) currentInput  = s.currentInput;
      if (s.operator      !== undefined) operator      = s.operator;
      if (s.previousInput !== undefined) previousInput = s.previousInput;
      if (s.shouldReset   !== undefined) shouldReset   = s.shouldReset;
    },
  };
}
