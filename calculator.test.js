'use strict';

const {
  computeResult,
  formatResult,
  appendNumber,
  setOperator,
  calculate,
  clearAll,
  backspace,
  getState,
  setState,
} = require('./calculator.js');

beforeEach(() => {
  clearAll();
});

describe('computeResult', () => {
  test('1-01: adds two positive integers', () => {
    expect(computeResult(3, '+', 5)).toBe(8);
  });
  test('1-02: adds a positive and a negative number', () => {
    expect(computeResult(10, '+', -4)).toBe(6);
  });
  test('1-03: subtracts two positive integers', () => {
    expect(computeResult(9, '-', 4)).toBe(5);
  });
  test('1-04: subtraction yielding a negative result', () => {
    expect(computeResult(3, '-', 7)).toBe(-4);
  });
  test('1-05: multiplies two positive integers', () => {
    expect(computeResult(6, '*', 7)).toBe(42);
  });
  test('1-06: multiplies by zero', () => {
    expect(computeResult(99, '*', 0)).toBe(0);
  });
  test('1-07: multiplies two negative numbers', () => {
    expect(computeResult(-3, '*', -4)).toBe(12);
  });
  test('1-08: divides two positive integers', () => {
    expect(computeResult(10, '/', 2)).toBe(5);
  });
  test('1-09: division by zero returns "Error"', () => {
    expect(computeResult(5, '/', 0)).toBe('Error');
  });
  test('1-10: divides zero by a number', () => {
    expect(computeResult(0, '/', 7)).toBe(0);
  });
  test('1-11: adds two decimal numbers', () => {
    const raw = computeResult(0.1, '+', 0.2);
    expect(parseFloat(formatResult(raw))).toBeCloseTo(0.3, 9);
  });
  test('1-12: subtracts decimals', () => {
    const raw = computeResult(1.5, '-', 0.4);
    expect(parseFloat(formatResult(raw))).toBeCloseTo(1.1, 9);
  });
  test('1-13: multiplies decimals', () => {
    expect(computeResult(2.5, '*', 4)).toBe(10);
  });
  test('1-14: divides with decimal result', () => {
    expect(computeResult(1, '/', 4)).toBe(0.25);
  });
  test('1-15: negative result from subtraction', () => {
    expect(computeResult(5, '-', 15)).toBe(-10);
  });
  test('1-16: negative result from multiplication', () => {
    expect(computeResult(-3, '*', 5)).toBe(-15);
  });
});

describe('formatResult', () => {
  test('2-01: formats an integer', () => {
    expect(formatResult(42)).toBe('42');
  });
  test('2-02: strips unnecessary trailing zeros', () => {
    expect(formatResult(1.50)).toBe('1.5');
  });
  test('2-03: allows exponent notation for large numbers', () => {
    const str = formatResult(1e20);
    expect(typeof str).toBe('string');
    expect(str.length).toBeGreaterThan(0);
  });
  test('2-04: returns "Error" for Infinity', () => {
    expect(formatResult(Infinity)).toBe('Error');
  });
  test('2-05: returns "Error" for -Infinity', () => {
    expect(formatResult(-Infinity)).toBe('Error');
  });
  test('2-06: handles negative numbers', () => {
    expect(formatResult(-7)).toBe('-7');
  });
  test('2-07: handles zero', () => {
    expect(formatResult(0)).toBe('0');
  });
});

describe('appendNumber', () => {
  test('3-01: appends a digit to initial "0"', () => {
    appendNumber('5');
    expect(getState().currentInput).toBe('5');
  });
  test('3-02: prevents leading zeros', () => {
    appendNumber('0');
    expect(getState().currentInput).toBe('0');
  });
  test('3-03: replaces leading zero with non-zero digit', () => {
    appendNumber('7');
    expect(getState().currentInput).toBe('7');
  });
  test('3-04: appends multiple digits', () => {
    appendNumber('1'); appendNumber('2'); appendNumber('3');
    expect(getState().currentInput).toBe('123');
  });
  test('3-05: appends decimal point', () => {
    appendNumber('3'); appendNumber('.');
    expect(getState().currentInput).toBe('3.');
  });
  test('3-06: prevents duplicate decimal point', () => {
    appendNumber('3'); appendNumber('.'); appendNumber('1'); appendNumber('.');
    expect(getState().currentInput).toBe('3.1');
  });
  test('3-07: decimal on bare "0" produces "0."', () => {
    appendNumber('.');
    expect(getState().currentInput).toBe('0.');
  });
  test('3-08: after result starts fresh entry', () => {
    setState({ currentInput: '10', shouldReset: true, operator: null, previousInput: null });
    appendNumber('5');
    expect(getState().currentInput).toBe('5');
    expect(getState().shouldReset).toBe(false);
  });
  test('3-09: ignores input when display shows "Error"', () => {
    setState({ currentInput: 'Error' });
    appendNumber('9');
    expect(getState().currentInput).toBe('Error');
  });
});

describe('setOperator', () => {
  test('4-01: stores the operator and first operand', () => {
    appendNumber('8'); setOperator('+');
    const s = getState();
    expect(s.operator).toBe('+');
    expect(s.previousInput).toBe('8');
    expect(s.shouldReset).toBe(true);
  });
  test('4-02: changes operator before entering second operand', () => {
    appendNumber('5'); setOperator('+'); setOperator('-');
    expect(getState().operator).toBe('-');
  });
  test('4-03: chained calculation computes intermediate result', () => {
    appendNumber('3'); setOperator('+'); appendNumber('4'); setOperator('*');
    expect(getState().previousInput).toBe('7');
    expect(getState().operator).toBe('*');
  });
  test('4-04: ignores operator after "Error" display', () => {
    setState({ currentInput: 'Error', operator: null, previousInput: null });
    setOperator('+');
    expect(getState().operator).toBeNull();
  });
});

describe('calculate', () => {
  test('5-01: basic addition', () => {
    appendNumber('2'); setOperator('+'); appendNumber('3'); calculate();
    expect(getState().currentInput).toBe('5');
  });
  test('5-02: basic subtraction', () => {
    appendNumber('9'); setOperator('-'); appendNumber('4'); calculate();
    expect(getState().currentInput).toBe('5');
  });
  test('5-03: basic multiplication', () => {
    appendNumber('6'); setOperator('*'); appendNumber('7'); calculate();
    expect(getState().currentInput).toBe('42');
  });
  test('5-04: basic division', () => {
    appendNumber('8'); setOperator('/'); appendNumber('2'); calculate();
    expect(getState().currentInput).toBe('4');
  });
  test('5-05: division by zero shows "Error"', () => {
    appendNumber('5'); setOperator('/'); appendNumber('0'); calculate();
    expect(getState().currentInput).toBe('Error');
  });
  test('5-06: decimal addition', () => {
    appendNumber('0'); appendNumber('.'); appendNumber('1');
    setOperator('+');
    appendNumber('0'); appendNumber('.'); appendNumber('2');
    calculate();
    expect(parseFloat(getState().currentInput)).toBeCloseTo(0.3, 9);
  });
  test('5-07: negative result', () => {
    appendNumber('3'); setOperator('-'); appendNumber('8'); calculate();
    expect(getState().currentInput).toBe('-5');
  });
  test('5-08: ignores = when no operator set', () => {
    appendNumber('7');
    const before = getState().currentInput;
    calculate();
    expect(getState().currentInput).toBe(before);
  });
  test('5-09: ignores = immediately after operator', () => {
    appendNumber('5'); setOperator('+');
    const stateBefore = { ...getState() };
    calculate();
    expect(getState().currentInput).toBe(stateBefore.currentInput);
    expect(getState().operator).toBe(stateBefore.operator);
  });
  test('5-10: result is set as first operand for next chain', () => {
    appendNumber('4'); setOperator('+'); appendNumber('6'); calculate();
    setOperator('*'); appendNumber('2'); calculate();
    expect(getState().currentInput).toBe('20');
  });
  test('5-11: large number result uses string representation', () => {
    '999999999'.split('').forEach(d => appendNumber(d));
    setOperator('*');
    '999999999'.split('').forEach(d => appendNumber(d));
    calculate();
    expect(typeof getState().currentInput).toBe('string');
    expect(getState().currentInput.length).toBeGreaterThan(0);
  });
});

describe('clearAll', () => {
  test('6-01: resets all state to initial values', () => {
    appendNumber('5'); setOperator('+'); appendNumber('3'); clearAll();
    const s = getState();
    expect(s.currentInput).toBe('0');
    expect(s.operator).toBeNull();
    expect(s.previousInput).toBeNull();
    expect(s.shouldReset).toBe(false);
  });
  test('6-02: clears error state', () => {
    setState({ currentInput: 'Error' }); clearAll();
    expect(getState().currentInput).toBe('0');
  });
});

describe('backspace', () => {
  test('7-01: deletes last digit from multi-digit number', () => {
    appendNumber('1'); appendNumber('2'); appendNumber('3'); backspace();
    expect(getState().currentInput).toBe('12');
  });
  test('7-02: single digit reverts to "0"', () => {
    appendNumber('7'); backspace();
    expect(getState().currentInput).toBe('0');
  });
  test('7-03: deletes decimal point', () => {
    appendNumber('3'); appendNumber('.'); backspace();
    expect(getState().currentInput).toBe('3');
  });
  test('7-04: after = acts as clearAll', () => {
    appendNumber('4'); setOperator('+'); appendNumber('4'); calculate(); backspace();
    const s = getState();
    expect(s.currentInput).toBe('0');
    expect(s.shouldReset).toBe(false);
  });
  test('7-05: on "Error" state acts as clearAll', () => {
    setState({ currentInput: 'Error' }); backspace();
    expect(getState().currentInput).toBe('0');
  });
  test('7-06: deletes decimal digit leaving integer', () => {
    appendNumber('1'); appendNumber('.'); appendNumber('5'); backspace();
    expect(getState().currentInput).toBe('1.');
    backspace();
    expect(getState().currentInput).toBe('1');
  });
});

describe('chained calculation (FR-05)', () => {
  test('8-01: three-step chain 2 + 3 * 4 = 20', () => {
    appendNumber('2'); setOperator('+'); appendNumber('3'); setOperator('*'); appendNumber('4'); calculate();
    expect(getState().currentInput).toBe('20');
  });
  test('8-02: result then operator then number', () => {
    appendNumber('1'); appendNumber('0'); setOperator('-'); appendNumber('3'); calculate();
    setOperator('/'); appendNumber('7'); calculate();
    expect(getState().currentInput).toBe('1');
  });
  test('8-03: chain after division by zero is blocked', () => {
    appendNumber('5'); setOperator('/'); appendNumber('0'); calculate();
    expect(getState().currentInput).toBe('Error');
    setOperator('+');
    expect(getState().operator).toBeNull();
  });
});

describe('edge cases', () => {
  test('9-01: 0 + 0 = 0 (no second operand => ignored)', () => {
    setOperator('+'); calculate();
    expect(getState().currentInput).toBe('0');
  });
  test('9-02: negative decimal result', () => {
    appendNumber('0'); appendNumber('.'); appendNumber('5');
    setOperator('-');
    appendNumber('1'); appendNumber('.'); appendNumber('5');
    calculate();
    expect(parseFloat(getState().currentInput)).toBeCloseTo(-1, 9);
  });
  test('9-03: decimal input on fresh state starts with "0."', () => {
    appendNumber('.');
    expect(getState().currentInput).toBe('0.');
    appendNumber('7');
    expect(getState().currentInput).toBe('0.7');
  });
  test('9-04: multiple operators without new digit only changes operator', () => {
    appendNumber('9'); setOperator('+'); setOperator('-'); setOperator('*');
    expect(getState().operator).toBe('*');
    expect(getState().previousInput).toBe('9');
  });
});
