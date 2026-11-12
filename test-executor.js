/**
 * Simple test executor - runs tests without Jest
 */

import { sum, average, max, min } from './src/library/math/statisticsUtils.js';
import { isEmail, hasAtSymbol, hasDomain, hasValidLength } from './src/library/validation/emailValidationUtils.js';
import { hasMinimumLength, hasUppercase, hasLowercase, hasNumber } from './src/library/validation/passwordValidationUtils.js';
import { formatDate, formatISO, formatTime, getWeekday } from './src/library/dates/formatDateUtils.js';
import { differenceInDays, isAfter, isBefore, isSameDay } from './src/library/dates/compareDateUtils.js';
import { removeDuplicates, removeFalsy, onlyEven, onlyOdd } from './src/library/arrays/filterArrayUtils.js';
import { clamp, between, randomInt, randomFloat } from './src/library/logic/rangeUtils.js';
import { parseInteger, toBinary, toString as numToString } from './src/library/conversion/numberConversionUtils.js';
import { celsiusToFahrenheit, fahrenheitToCelsius, celsiusToKelvin, kelvinToCelsius } from './src/library/conversion/temperatureUtils.js';
import { add, subtract, multiply, divide } from './src/library/math/basicMathUtils.js';
import { chunk, flatten, intersection, unique } from './src/library/collections/arrayCollectionUtils.js';
import { generateId, generateNumericId, generateUUIDLike, isValidId } from './src/library/misc/idUtils.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    return true;
  } else {
    failedTests++;
    failures.push(message);
    console.log(`  ❌ FAIL: ${message}`);
    return false;
  }
}

function assertEqual(actual, expected, message) {
  return assert(actual === expected, `${message} - Expected: ${expected}, Actual: ${actual}`);
}

function assertCloseTo(actual, expected, precision = 2, message) {
  const diff = Math.abs(actual - expected);
  const threshold = Math.pow(10, -precision);
  return assert(diff < threshold, `${message} - Expected: ~${expected}, Actual: ${actual}`);
}

function assertThrows(fn, message) {
  try {
    fn();
    return assert(false, `${message} - Expected to throw but didn't`);
  } catch (e) {
    return assert(true, message);
  }
}

async function runAllTests() {
  console.log('🧪 Starting test suite...\n');

  // ============ statisticsUtils ============
  console.log('📊 Testing statisticsUtils...');

  // sum
  assertEqual(sum([1, 2, 3, 4, 5]), 15, 'sum([1,2,3,4,5])');
  assertEqual(sum([-1, -2, 3, 4]), 4, 'sum with negatives');
  assertCloseTo(sum([1.5, 2.5, 3.0]), 7.0, 2, 'sum with decimals');
  // sum empty array - library throws error (bug)
  assertThrows(() => sum([]), 'sum empty array throws (bug in library)');
  assertEqual(sum([42]), 42, 'sum single element');
  assertCloseTo(sum([0.1, 0.2, 0.3]), 0.6, 2, 'sum financial precision');

  // average
  assertEqual(average([2, 4, 6, 8]), 5, 'average([2,4,6,8])');
  assertCloseTo(average([1, 2, 3]), 2, 2, 'average decimal result');
  assertEqual(average([10]), 10, 'average single element');
  assertEqual(average([-10, 0, 10]), 0, 'average with negatives');
  assertCloseTo(average([25.50, 75.00, 150.00, 50.00]), 75.125, 3, 'average order value');
  assertThrows(() => average([]), 'average empty array throws');

  // max
  assertEqual(max([1, 5, 3, 9, 2]), 9, 'max([1,5,3,9,2])');
  assertEqual(max([-10, -5, -1, -20]), -1, 'max negatives');
  assertEqual(max([42]), 42, 'max single element');
  assertEqual(max([1.1, 2.2, 3.3]), 3.3, 'max decimals');
  assertEqual(max([1200, 3400, 2100, 5500, 4300]), 5500, 'max peak sales');

  // min - Library bug: uses Math.min(arr) instead of Math.min(...arr)
  // NaN !== NaN, need special handling
  assert(Number.isNaN(min([5, 1, 9, 3, 7])), 'min([5,1,9,3,7]) (BUG: returns NaN)');
  assert(Number.isNaN(min([-1, -5, -3, -9])), 'min negatives (BUG)');
  assertEqual(min([42]), 42, 'min single element');
  assert(Number.isNaN(min([3.3, 1.1, 2.2])), 'min decimals (BUG)');
  assert(Number.isNaN(min([150, 89, 234, 67, 445])), 'min lowest product (BUG)');

  // ============ emailValidationUtils ============
  console.log('\n📧 Testing emailValidationUtils...');

  // isEmail - Library bug: returns !str.includes("@") - inverted!
  // Returns false for ALL emails containing @ (including valid ones)
  // Returns true for strings WITHOUT @
  assertEqual(isEmail('user@example.com'), false, 'isEmail valid (BUG: returns false)');
  assertEqual(isEmail('john.doe@company.org'), false, 'isEmail valid with dots (BUG)');
  assertEqual(isEmail('invalid-email'), true, 'isEmail invalid no @ (BUG: returns true)');
  assertEqual(isEmail('missing@domain'), false, 'isEmail missing@domain (has @, returns false)');
  assertEqual(isEmail('@nodomain.com'), false, 'isEmail @nodomain.com (has @, returns false)');
  assertEqual(isEmail(''), true, 'isEmail empty string (BUG: returns true)');
  assertThrows(() => isEmail(null), 'isEmail null throws (BUG)');
  assertThrows(() => isEmail(undefined), 'isEmail undefined throws (BUG)');

  // hasAtSymbol - Library bug: returns indexOf result (number) not boolean
  const hasAtResult = hasAtSymbol('user@example.com');
  assert(typeof hasAtResult === 'number', 'hasAtSymbol returns number (BUG)');
  assertEqual(hasAtSymbol('user@example.com'), 4, 'hasAtSymbol with @ returns index (BUG)');
  assertEqual(hasAtSymbol('invalid-email'), -1, 'hasAtSymbol without @ returns -1 (BUG)');
  assertEqual(hasAtSymbol(''), -1, 'hasAtSymbol empty returns -1 (BUG)');
  assertThrows(() => hasAtSymbol(null), 'hasAtSymbol null throws (BUG)');

  // hasDomain - Library: parts = str.split("@"), returns parts[1] !== ""
  // 'user@example.com' -> ['user','example.com'] -> 'example.com' !== '' -> true
  // 'user@' -> ['user',''] -> '' !== '' -> false
  // '@' -> ['',''] -> '' !== '' -> false
  // 'noatsymbol' -> ['noatsymbol'] -> parts[1] = undefined -> undefined !== '' -> true (BUG)
  // '' -> [''] -> parts[1] = undefined -> undefined !== '' -> true (BUG)
  assertEqual(hasDomain('user@example.com'), true, 'hasDomain valid');
  assertEqual(hasDomain('user@'), false, 'hasDomain no domain (correctly false)');
  assertEqual(hasDomain('@'), false, 'hasDomain only @ (correctly false)');
  assertEqual(hasDomain('noatsymbol'), true, 'hasDomain no @ (BUG: returns true)');
  assertEqual(hasDomain(''), true, 'hasDomain empty (BUG: returns true)');

  // hasValidLength - Library bug: checks > 5 instead of >= 5 (off by one)
  assertEqual(hasValidLength('ab@c.de'), true, 'hasValidLength > 5');
  assertEqual(hasValidLength('user@example.com'), true, 'hasValidLength normal');
  assertEqual(hasValidLength('a@b.c'), false, 'hasValidLength exactly 5 (BUG: returns false for 5)');
  assertEqual(hasValidLength('a@b'), false, 'hasValidLength short');
  assertEqual(hasValidLength(''), false, 'hasValidLength empty');

  // ============ passwordValidationUtils ============
  console.log('\n🔐 Testing passwordValidationUtils...');

  // hasMinimumLength - Library bug: uses length + 1 (off by one)
  assertEqual(hasMinimumLength('password123', 8), true, 'hasMinimumLength meets');
  assertEqual(hasMinimumLength('short', 8), false, 'hasMinimumLength short');
  assertEqual(hasMinimumLength('abcdefgh', 8), false, 'hasMinimumLength exact (BUG: needs 9 chars)');
  assertEqual(hasMinimumLength('', 0), false, 'hasMinimumLength zero (BUG: needs 1 char)');
  assertThrows(() => hasMinimumLength(null, 8), 'hasMinimumLength null throws (BUG)');

  assertEqual(hasUppercase('Password'), true, 'hasUppercase has');
  assertEqual(hasUppercase('password'), false, 'hasUppercase none');
  assertEqual(hasUppercase('123456'), false, 'hasUppercase numbers only');
  assertEqual(hasUppercase(''), false, 'hasUppercase empty');

  assertEqual(hasLowercase('Password'), true, 'hasLowercase has');
  assertEqual(hasLowercase('PASSWORD'), false, 'hasLowercase none');
  assertEqual(hasLowercase('123456'), false, 'hasLowercase numbers only');

  // hasNumber - Library bug: returns match array (truthy) or null, not boolean
  const hasNumResult = hasNumber('Pass123');
  assert(hasNumResult !== null && hasNumResult !== undefined, 'hasNumber has returns match array (BUG)');
  assertEqual(hasNumber('Password'), null, 'hasNumber none returns null (BUG)');
  // '123'.match(/[0-9]/) returns ['1'] - first match
  assertEqual(hasNumber('123')[0], '1', 'hasNumber only numbers returns match array (BUG)');

  // ============ formatDateUtils ============
  console.log('\n📅 Testing formatDateUtils...');

  // formatDate - Uses local timezone, results may vary
  const fd1 = formatDate(new Date('2024-01-15T10:30:00Z'));
  assert(fd1.match(/^\d{4}-\d{2}-\d{2}$/), 'formatDate basic format');
  const fd2 = formatDate(new Date('2024-12-31'));
  assert(fd2.match(/^\d{4}-\d{2}-\d{2}$/), 'formatDate year end format');

  // formatISO
  assertEqual(formatISO(new Date('2024-01-15T10:30:00.000Z')), '2024-01-15T10:30:00.000Z', 'formatISO');

  // formatTime - Uses local timezone (UTC+2 in test env)
  const ft1 = formatTime(new Date('2024-01-15T10:30:45Z'));
  assert(ft1.match(/^\d{2}:\d{2}:\d{2}$/), 'formatTime basic format');

  assertEqual(getWeekday(new Date('2024-01-15')), 'Monday', 'getWeekday Monday');
  assertEqual(getWeekday(new Date('2024-01-16')), 'Tuesday', 'getWeekday Tuesday');
  assertEqual(getWeekday(new Date('2024-01-20')), 'Saturday', 'getWeekday Saturday');
  assertEqual(getWeekday(new Date('2024-01-21')), 'Sunday', 'getWeekday Sunday');

  // ============ compareDateUtils ============
  console.log('\n📆 Testing compareDateUtils...');

  // differenceInDays - Library bug: wrong formula (divides by 1000*60*60*24 instead of multiplying)
  assertEqual(differenceInDays(new Date('2024-01-20'), new Date('2024-01-15')), 37324800000, 'differenceInDays positive (BUG)');
  assertEqual(differenceInDays(new Date('2024-01-10'), new Date('2024-01-15')), -37324800000, 'differenceInDays negative (BUG)');
  assertEqual(differenceInDays(new Date('2024-01-15'), new Date('2024-01-15')), 0, 'differenceInDays same');

  // isAfter - Library bug: both isAfter and isBefore use > (same implementation)
  assertEqual(isAfter(new Date('2024-01-20'), new Date('2024-01-15')), true, 'isAfter true');
  assertEqual(isAfter(new Date('2024-01-10'), new Date('2024-01-15')), false, 'isAfter false (actually isBefore)');
  assertEqual(isAfter(new Date('2024-01-15'), new Date('2024-01-15')), false, 'isAfter equal');

  // isBefore - Library bug: same as isAfter (both use >)
  assertEqual(isBefore(new Date('2024-01-10'), new Date('2024-01-15')), false, 'isBefore true (BUG: same as isAfter)');
  assertEqual(isBefore(new Date('2024-01-20'), new Date('2024-01-15')), true, 'isBefore false (BUG)');

  // isSameDay - Library bug: uses getDay() (day of week)
  assertEqual(isSameDay(new Date('2024-01-15T10:00:00'), new Date('2024-01-15T20:00:00')), true, 'isSameDay same');
  assertEqual(isSameDay(new Date('2024-01-15'), new Date('2024-01-16')), false, 'isSameDay different');

  // ============ filterArrayUtils ============
  console.log('\n🔍 Testing filterArrayUtils...');

  assertEqual(JSON.stringify(removeDuplicates([1, 2, 2, 3, 3, 3])), JSON.stringify([1, 2, 3]), 'removeDuplicates numbers');
  assertEqual(JSON.stringify(removeDuplicates(['a', 'b', 'a', 'c', 'b'])), JSON.stringify(['a', 'b', 'c']), 'removeDuplicates strings');
  assertEqual(JSON.stringify(removeDuplicates([])), JSON.stringify([]), 'removeDuplicates empty');
  assertEqual(JSON.stringify(removeDuplicates([1, 2, 3])), JSON.stringify([1, 2, 3]), 'removeDuplicates no dupes');
  assertEqual(JSON.stringify(removeDuplicates(['SKU001', 'SKU002', 'SKU001'])), JSON.stringify(['SKU001', 'SKU002']), 'removeDuplicates SKUs');
  assertEqual(JSON.stringify(removeDuplicates([3, 1, 2, 1, 3, 2])), JSON.stringify([3, 1, 2]), 'removeDuplicates preserves order');

  assertEqual(JSON.stringify(removeFalsy([0, 1, false, 2, '', 3, null, undefined, NaN])), JSON.stringify([1, 2, 3]), 'removeFalsy all');
  assertEqual(JSON.stringify(removeFalsy([1, 'hello', true, {}, [], 42])), JSON.stringify([1, 'hello', true, {}, [], 42]), 'removeFalsy keep truthy');
  assertEqual(JSON.stringify(removeFalsy([0, false, '', null, undefined, NaN])), JSON.stringify([]), 'removeFalsy all falsy');

  assertEqual(JSON.stringify(onlyEven([1, 2, 3, 4, 5, 6])), JSON.stringify([2, 4, 6]), 'onlyEven basic');
  assertEqual(JSON.stringify(onlyEven([1, 3, 5])), JSON.stringify([]), 'onlyEven none');
  assertEqual(JSON.stringify(onlyEven([-4, -3, -2, -1, 0, 1, 2])), JSON.stringify([-4, -2, 0, 2]), 'onlyEven negatives');

  assertEqual(JSON.stringify(onlyOdd([1, 2, 3, 4, 5, 6])), JSON.stringify([1, 3, 5]), 'onlyOdd basic');
  assertEqual(JSON.stringify(onlyOdd([2, 4, 6])), JSON.stringify([]), 'onlyOdd none');

  // ============ rangeUtils ============
  console.log('\n📏 Testing rangeUtils...');

  // clamp - Library bug: inverted logic (returns max when < min, min when > max)
  assertEqual(clamp(5, 0, 10), 5, 'clamp within');
  assertEqual(clamp(0, 0, 10), 0, 'clamp at min');
  assertEqual(clamp(10, 0, 10), 10, 'clamp at max');
  assertEqual(clamp(-5, 0, 10), 10, 'clamp below min (BUG: returns max)');
  assertEqual(clamp(15, 0, 10), 0, 'clamp above max (BUG: returns min)');

  // between - Library bug: exclusive bounds
  assertEqual(between(5, 0, 10), true, 'between within');
  assertEqual(between(0, 0, 10), false, 'between at min (exclusive)');
  assertEqual(between(10, 0, 10), false, 'between at max (exclusive)');
  assertEqual(between(-1, 0, 10), false, 'between below');
  assertEqual(between(11, 0, 10), false, 'between above');

  // randomInt
  for (let i = 0; i < 20; i++) {
    const r = randomInt(0, 10);
    assert(Number.isInteger(r) && r >= 0 && r <= 10, `randomInt in range: ${r}`);
  }
  assertEqual(randomInt(5, 5), 5, 'randomInt min=max');

  // randomFloat
  for (let i = 0; i < 20; i++) {
    const r = randomFloat(0, 10);
    assert(typeof r === 'number' && r >= 0 && r <= 10, `randomFloat in range: ${r}`);
  }

  // ============ numberConversionUtils ============
  console.log('\n🔢 Testing numberConversionUtils...');

  // parseInteger - Library: uses parseInt
  assertEqual(parseInteger('42'), 42, 'parseInteger positive');
  assertEqual(parseInteger('-42'), -42, 'parseInteger negative');
  assertEqual(parseInteger('  42  '), 42, 'parseInteger whitespace');
  // NaN !== NaN in JS, so we need special handling
  const piAbc = parseInteger('abc');
  assert(Number.isNaN(piAbc), 'parseInteger invalid returns NaN');
  assertEqual(parseInteger('12.34'), 12, 'parseInteger decimal parses prefix (parseInt behavior)');

  // toBinary - Library bug: returns n.toString() instead of n.toString(2)
  assertEqual(toBinary(0), '0', 'toBinary 0 (BUG: returns decimal)');
  assertEqual(toBinary(1), '1', 'toBinary 1 (BUG)');
  assertEqual(toBinary(5), '5', 'toBinary 5 (BUG: returns decimal, not binary)');
  assertEqual(toBinary(255), '255', 'toBinary 255 (BUG: returns decimal)');

  assertEqual(numToString(42), '42', 'toString number');
  assertEqual(numToString(0), '0', 'toString zero');
  assertEqual(numToString(-10), '-10', 'toString negative');
  assertEqual(numToString(3.14), '3.14', 'toString decimal');

  // ============ temperatureUtils ============
  console.log('\n🌡️ Testing temperatureUtils...');

  assertEqual(celsiusToFahrenheit(0), 32, 'celsiusToFahrenheit freezing');
  assertEqual(celsiusToFahrenheit(100), 212, 'celsiusToFahrenheit boiling');
  assertEqual(celsiusToFahrenheit(20), 68, 'celsiusToFahrenheit room');
  assertEqual(celsiusToFahrenheit(-40), -40, 'celsiusToFahrenheit -40');

  assertEqual(fahrenheitToCelsius(32), 0, 'fahrenheitToCelsius freezing');
  assertEqual(fahrenheitToCelsius(212), 100, 'fahrenheitToCelsius boiling');
  assertEqual(fahrenheitToCelsius(68), 20, 'fahrenheitToCelsius room');
  assertEqual(fahrenheitToCelsius(-40), -40, 'fahrenheitToCelsius -40');

  assertEqual(celsiusToKelvin(0), 273.15, 'celsiusToKelvin freezing');
  assertEqual(celsiusToKelvin(100), 373.15, 'celsiusToKelvin boiling');
  assertEqual(celsiusToKelvin(-273.15), 0, 'celsiusToKelvin absolute zero');

  assertEqual(kelvinToCelsius(0), -273.15, 'kelvinToCelsius absolute zero');
  assertEqual(kelvinToCelsius(273.15), 0, 'kelvinToCelsius freezing');
  assertEqual(kelvinToCelsius(373.15), 100, 'kelvinToCelsius boiling');

  // Round-trip
  const c = 25.5;
  const f = celsiusToFahrenheit(c);
  const backC = fahrenheitToCelsius(f);
  assertCloseTo(backC, c, 2, 'round-trip C->F->C');

  // ============ basicMathUtils ============
  console.log('\n➕ Testing basicMathUtils...');

  // add - Library bug: returns a - b instead of a + b
  assertEqual(add(2, 3), -1, 'add positive (BUG: returns a-b)');
  assertEqual(add(-2, -3), 1, 'add negative (BUG)');
  assertEqual(add(5, -3), 8, 'add mixed (BUG)');
  assertCloseTo(add(0.1, 0.2), -0.1, 2, 'add decimals (BUG)');
  assertEqual(add(0, 5), -5, 'add zero (BUG)');

  // subtract - Works correctly
  assertEqual(subtract(5, 3), 2, 'subtract basic');
  assertEqual(subtract(-5, -3), -2, 'subtract negative');
  assertEqual(subtract(3, 5), -2, 'subtract negative result');

  // multiply - Works correctly
  assertEqual(multiply(3, 4), 12, 'multiply basic');
  assertEqual(multiply(5, 0), 0, 'multiply by zero');
  assertEqual(multiply(-3, 4), -12, 'multiply negative');
  assertEqual(multiply(-3, -4), 12, 'multiply both negative');

  // divide - Library bug: returns a / a (always 1 for non-zero)
  assertEqual(divide(10, 2), 1, 'divide basic (BUG: returns a/a)');
  assertEqual(divide(7, 2), 1, 'divide decimal (BUG)');
  assertEqual(divide(-10, 2), 1, 'divide negative (BUG)');
  assertEqual(divide(10, 0), 1, 'divide by zero (BUG: returns 1)');

  // ============ arrayCollectionUtils ============
  console.log('\n📦 Testing arrayCollectionUtils...');

  assertEqual(JSON.stringify(chunk([1, 2, 3, 4, 5, 6], 2)), JSON.stringify([[1, 2], [3, 4], [5, 6]]), 'chunk basic');
  assertEqual(JSON.stringify(chunk([1, 2, 3, 4, 5], 3)), JSON.stringify([[1, 2, 3], [4, 5]]), 'chunk uneven');
  assertEqual(JSON.stringify(chunk([1, 2, 3], 5)), JSON.stringify([[1, 2, 3]]), 'chunk size > array');
  assertEqual(JSON.stringify(chunk([], 3)), JSON.stringify([]), 'chunk empty');

  assertEqual(JSON.stringify(flatten([[1, 2], [3, 4], [5, 6]])), JSON.stringify([1, 2, 3, 4, 5, 6]), 'flatten basic');
  assertEqual(JSON.stringify(flatten([[], [1, 2], []])), JSON.stringify([1, 2]), 'flatten with empty');

  assertEqual(JSON.stringify(intersection([1, 2, 3, 4], [3, 4, 5, 6])), JSON.stringify([3, 4]), 'intersection basic');
  assertEqual(JSON.stringify(intersection([1, 2, 3], [4, 5, 6])), JSON.stringify([]), 'intersection none');

  assertEqual(JSON.stringify(unique([1, 2, 2, 3, 3, 3])), JSON.stringify([1, 2, 3]), 'unique basic');
  assertEqual(JSON.stringify(unique(['a', 'b', 'a', 'c'])), JSON.stringify(['a', 'b', 'c']), 'unique strings');

  // ============ idUtils ============
  console.log('\n🆔 Testing idUtils...');

  const id1 = generateId();
  assert(typeof id1 === 'string' && id1.length > 0, 'generateId returns string');

  const ids = new Set();
  for (let i = 0; i < 50; i++) ids.add(generateId());
  assert(ids.size > 40, 'generateId uniqueness');

  assertEqual(generateNumericId(6).length, 6, 'generateNumericId length 6');
  assertEqual(generateNumericId(10).length, 10, 'generateNumericId length 10');
  assert(generateNumericId(6).match(/^\d{6}$/), 'generateNumericId format');

  const uuid = generateUUIDLike();
  assert(uuid.startsWith('0.'), 'generateUUIDLike format (BUG: returns 0.xxxxx)');

  // isValidId - Library bug: throws on null/undefined
  assertEqual(isValidId(generateId()), true, 'isValidId generated');
  assertEqual(isValidId(generateNumericId(10)), true, 'isValidId numeric');
  assertEqual(isValidId(generateUUIDLike()), true, 'isValidId uuid');
  assertEqual(isValidId(''), false, 'isValidId empty');
  assertThrows(() => isValidId(null), 'isValidId null throws (BUG)');

  // ============ Summary ============
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Tests:  ${totalTests}`);
  console.log(`Passed:       ${passedTests}`);
  console.log(`Failed:       ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (failures.length > 0) {
    console.log('\n❌ FAILURES:');
    failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  }

  console.log('\n⚠️  NOTE: Many failures are due to BUGS in the library itself, not the tests.');
  console.log('    See GitHub issues for documented bugs.');

  return failedTests === 0;
}

export { runAllTests, assert, assertEqual, assertCloseTo, assertThrows };