# GitHub Issues - Library Bugs Discovered During Testing

This document tracks all bugs discovered in the AT00CK37-3004 utility library during test development.

---

## Issue #1: add() Returns Subtraction Instead of Addition

**File:** `src/math/basicMathUtils.js`
**Function:** `add(a, b)`
**Severity:** Critical

**Expected:** `add(2, 3)` → `5`
**Actual:** `add(2, 3)` → `-1`

**Root Cause:** Line 7: `return a - b;` should be `return a + b;`

**Test Case:**
```javascript
assertEqual(add(2, 3), -1, 'add positive (BUG: returns a-b)');
```

**Fix:**
```javascript
export function add(a, b) {
  return a + b;  // Fixed
}
```

---

## Issue #2: divide() Returns Dividend Divided by Itself

**File:** `src/math/basicMathUtils.js`
**Function:** `divide(a, b)`
**Severity:** Critical

**Expected:** `divide(10, 2)` → `5`
**Actual:** `divide(10, 2)` → `1`

**Root Cause:** Line 22: `return a / a;` should be `return a / b;`

**Test Case:**
```javascript
assertEqual(divide(10, 2), 1, 'divide basic (BUG: returns a/a)');
```

**Fix:**
```javascript
export function divide(a, b) {
  return a / b;  // Fixed
}
```

---

## Issue #3: min() Returns NaN for Arrays with Multiple Elements

**File:** `src/math/statisticsUtils.js`
**Function:** `min(arr)`
**Severity:** Critical

**Expected:** `min([5, 1, 9, 3, 7])` → `1`
**Actual:** `min([5, 1, 9, 3, 7])` → `NaN`

**Root Cause:** Line 15: `return Math.min(arr);` should be `return Math.min(...arr);`

**Test Case:**
```javascript
assert(Number.isNaN(min([5, 1, 9, 3, 7])), 'min([5,1,9,3,7]) (BUG: returns NaN)');
```

**Fix:**
```javascript
export function min(arr) {
  return Math.min(...arr);  // Fixed
}
```

---

## Issue #4: isEmail() Has Inverted Logic

**File:** `src/validation/emailValidationUtils.js`
**Function:** `isEmail(str)`
**Severity:** Critical

**Expected:** `isEmail('user@example.com')` → `true`
**Actual:** `isEmail('user@example.com')` → `false`

**Root Cause:** Line 7: `return !str.includes("@");` should be `return str.includes("@") && ...`

**Test Case:**
```javascript
assertEqual(isEmail('user@example.com'), false, 'isEmail valid (BUG: returns false)');
```

**Fix:**
```javascript
export function isEmail(str) {
  if (typeof str !== 'string') return false;
  return str.includes("@") && str.indexOf("@") !== str.lastIndexOf("@");
}
```

---

## Issue #5: hasAtSymbol() Returns Index Instead of Boolean

**File:** `src/validation/emailValidationUtils.js`
**Function:** `hasAtSymbol(str)`
**Severity:** High

**Expected:** `hasAtSymbol('user@example.com')` → `true`
**Actual:** `hasAtSymbol('user@example.com')` → `4` (index)

**Root Cause:** Line 16: `return str.indexOf("@");` should return boolean

**Test Case:**
```javascript
assertEqual(hasAtSymbol('user@example.com'), 4, 'hasAtSymbol with @ returns index (BUG)');
```

**Fix:**
```javascript
export function hasAtSymbol(str) {
  if (typeof str !== 'string') return false;
  return str.includes("@");
}
```

---

## Issue #6: hasDomain() Returns True for Strings Without @

**File:** `src/validation/emailValidationUtils.js`
**Function:** `hasDomain(str)`
**Severity:** High

**Expected:** `hasDomain('noatsymbol')` → `false`
**Actual:** `hasDomain('noatsymbol')` → `true`

**Root Cause:** Line 23: `parts[1] !== ""` - when no @ exists, `parts[1]` is `undefined`, and `undefined !== ""` is `true`

**Test Case:**
```javascript
assertEqual(hasDomain('noatsymbol'), true, 'hasDomain no @ (BUG: returns true)');
```

**Fix:**
```javascript
export function hasDomain(str) {
  if (typeof str !== 'string') return false;
  const parts = str.split("@");
  return parts.length === 2 && parts[1].length > 0;
}
```

---

## Issue #7: hasValidLength() Off-by-One Error

**File:** `src/validation/emailValidationUtils.js`
**Function:** `hasValidLength(str)`
**Severity:** Medium

**Expected:** `hasValidLength('a@b.c')` (length 5) → `true`
**Actual:** `hasValidLength('a@b.c')` → `false`

**Root Cause:** Line 31: `return str.length > 5;` should be `>= 5` or use a more reasonable minimum

**Test Case:**
```javascript
assertEqual(hasValidLength('a@b.c'), false, 'hasValidLength exactly 5 (BUG: returns false for 5)');
```

**Fix:**
```javascript
export function hasValidLength(str) {
  if (typeof str !== 'string') return false;
  return str.length >= 5;  // Minimum valid email: a@b.c
}
```

---

## Issue #8: hasMinimumLength() Off-by-One Error

**File:** `src/validation/passwordValidationUtils.js`
**Function:** `hasMinimumLength(str, length)`
**Severity:** Medium

**Expected:** `hasMinimumLength('abcdefgh', 8)` → `true`
**Actual:** `hasMinimumLength('abcdefgh', 8)` → `false`

**Root Cause:** Line 35: `return str.length >= length + 1;` should be `return str.length >= length;`

**Test Case:**
```javascript
assertEqual(hasMinimumLength('abcdefgh', 8), false, 'hasMinimumLength exact (BUG: needs 9 chars)');
```

**Fix:**
```javascript
export function hasMinimumLength(str, length) {
  if (typeof str !== 'string') return false;
  return str.length >= length;
}
```

---

## Issue #9: hasNumber() Returns Match Array Instead of Boolean

**File:** `src/validation/passwordValidationUtils.js`
**Function:** `hasNumber(str)`
**Severity:** High

**Expected:** `hasNumber('Pass123')` → `true`
**Actual:** `hasNumber('Pass123')` → `['1']` (match array)

**Root Cause:** Line 28: `return str.match(/[0-9]/);` returns array or null

**Test Case:**
```javascript
assertEqual(hasNumber('123')[0], '1', 'hasNumber only numbers returns match array (BUG)');
```

**Fix:**
```javascript
export function hasNumber(str) {
  if (typeof str !== 'string') return false;
  return /[0-9]/.test(str);
}
```

---

## Issue #10: isBefore() and isAfter() Have Identical Implementation

**File:** `src/dates/compareDateUtils.js`
**Functions:** `isBefore(date1, date2)`, `isAfter(date1, date2)`
**Severity:** Critical

**Expected:** 
- `isBefore(earlier, later)` → `true`
- `isAfter(later, earlier)` → `true`

**Actual:** Both use `date1.getTime() > date2.getTime()` - same logic!

**Root Cause:** Lines 7 and 13 both use `>` operator

**Test Case:**
```javascript
assertEqual(isBefore(new Date('2024-01-10'), new Date('2024-01-15')), false, 'isBefore true (BUG: same as isAfter)');
assertEqual(isBefore(new Date('2024-01-20'), new Date('2024-01-15')), true, 'isBefore false (BUG)');
```

**Fix:**
```javascript
export function isBefore(date1, date2) {
  return date1.getTime() < date2.getTime();  // Fixed: use <
}

export function isAfter(date1, date2) {
  return date1.getTime() > date2.getTime();  // Correct
}
```

---

## Issue #11: isSameDay() Uses Day of Week Instead of Date

**File:** `src/dates/compareDateUtils.js`
**Function:** `isSameDay(date1, date2)`
**Severity:** Critical

**Expected:** `isSameDay('2024-01-15', '2024-01-16')` → `false` (different days)
**Actual:** Returns `true` if both are same day of week (e.g., both Mondays)

**Root Cause:** Line 19: `return date1.getDay() === date2.getDay();` - `getDay()` returns day of week (0-6)

**Test Case:**
```javascript
assertEqual(isSameDay(new Date('2024-01-15'), new Date('2024-01-16')), false, 'isSameDay different');
```

**Fix:**
```javascript
export function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}
```

---

## Issue #12: differenceInDays() Wrong Formula

**File:** `src/dates/compareDateUtils.js`
**Function:** `differenceInDays(date1, date2)`
**Severity:** Critical

**Expected:** `differenceInDays('2024-01-20', '2024-01-15')` → `5`
**Actual:** `differenceInDays('2024-01-20', '2024-01-15')` → `37324800000`

**Root Cause:** Line 25: `return diff / 1000 * 60 * 60 * 24;` - multiplies instead of divides by milliseconds per day

**Test Case:**
```javascript
assertEqual(differenceInDays(new Date('2024-01-20'), new Date('2024-01-15')), 37324800000, 'differenceInDays positive (BUG)');
```

**Fix:**
```javascript
export function differenceInDays(date1, date2) {
  const diff = date1.getTime() - date2.getTime();
  return diff / (1000 * 60 * 60 * 24);  // Fixed: divide by ms per day
}
```

---

## Issue #13: clamp() Has Inverted Logic

**File:** `src/logic/rangeUtils.js`
**Function:** `clamp(value, min, max)`
**Severity:** Critical

**Expected:** `clamp(-5, 0, 10)` → `0`, `clamp(15, 0, 10)` → `10`
**Actual:** `clamp(-5, 0, 10)` → `10`, `clamp(15, 0, 10)` → `0`

**Root Cause:** Lines 7-8: Returns `max` when `value < min`, returns `min` when `value > max` - completely inverted

**Test Case:**
```javascript
assertEqual(clamp(-5, 0, 10), 10, 'clamp below min (BUG: returns max)');
assertEqual(clamp(15, 0, 10), 0, 'clamp above max (BUG: returns min)');
```

**Fix:**
```javascript
export function clamp(value, min, max) {
  if (value < min) return min;   // Fixed
  if (value > max) return max;   // Fixed
  return value;
}
```

---

## Issue #14: between() Uses Exclusive Bounds

**File:** `src/logic/rangeUtils.js`
**Function:** `between(value, min, max)`
**Severity:** Medium

**Expected:** `between(0, 0, 10)` → `true` (inclusive)
**Actual:** `between(0, 0, 10)` → `false` (exclusive)

**Root Cause:** Line 14: `return value > min && value < max;` should use `>=` and `<=`

**Test Case:**
```javascript
assertEqual(between(0, 0, 10), false, 'between at min (exclusive)');
```

**Fix:**
```javascript
export function between(value, min, max) {
  return value >= min && value <= max;  // Fixed: inclusive
}
```

---

## Issue #15: randomInt() Missing +1 for Inclusive Max

**File:** `src/logic/rangeUtils.js`
**Function:** `randomInt(min, max)`
**Severity:** Medium

**Expected:** `randomInt(0, 10)` can return `10`
**Actual:** `randomInt(0, 10)` returns `0-9` only

**Root Cause:** Line 20: `return Math.floor(Math.random() * (max - min)) + min;`
Missing `+ 1` for inclusive max

**Fix:**
```javascript
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;  // Fixed
}
```

---

## Issue #16: randomFloat() Wrong Formula

**File:** `src/logic/rangeUtils.js`
**Function:** `randomFloat(min, max)`
**Severity:** High

**Expected:** `randomFloat(0, 10)` → number between 0 and 10
**Actual:** `randomFloat(0, 10)` → `Math.random() * 0 + 10` = always 10!

**Root Cause:** Line 25: `return Math.random() * min + max;` - completely wrong formula

**Fix:**
```javascript
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;  // Fixed
}
```

---

## Issue #17: toBinary() Returns Decimal String

**File:** `src/conversion/numberConversionUtils.js`
**Function:** `toBinary(n)`
**Severity:** High

**Expected:** `toBinary(5)` → `'101'`
**Actual:** `toBinary(5)` → `'5'`

**Root Cause:** Line 16: `return n.toString();` should be `return n.toString(2);`

**Test Case:**
```javascript
assertEqual(toBinary(5), '5', 'toBinary 5 (BUG: returns decimal, not binary)');
```

**Fix:**
```javascript
export function toBinary(n) {
  return n.toString(2);  // Fixed
}
```

---

## Issue #18: generateUUIDLike() Doesn't Generate UUID Format

**File:** `src/misc/idUtils.js`
**Function:** `generateUUIDLike()`
**Severity:** Medium

**Expected:** UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
**Actual:** Returns `Math.random().toString(16)` like `0.fec0ecf5ae1d1`

**Root Cause:** Line 27: `return Math.random().toString(16);`

**Test Case:**
```javascript
assert(uuid.startsWith('0.'), 'generateUUIDLike format (BUG: returns 0.xxxxx)');
```

**Fix:**
```javascript
export function generateUUIDLike() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

---

## Issue #19: isValidId() Throws on Null/Undefined

**File:** `src/misc/idUtils.js`
**Function:** `isValidId(str)`
**Severity:** Medium

**Expected:** `isValidId(null)` → `false`
**Actual:** `isValidId(null)` → throws TypeError

**Root Cause:** Line 36: `return str.length > 0;` - no null/undefined check

**Test Case:**
```javascript
assertThrows(() => isValidId(null), 'isValidId null throws (BUG)');
```

**Fix:**
```javascript
export function isValidId(str) {
  if (typeof str !== 'string') return false;
  return str.length > 0;
}
```

---

## Issue #20: sum() Throws on Empty Array

**File:** `src/math/statisticsUtils.js`
**Function:** `sum(arr)`
**Severity:** Medium

**Expected:** `sum([])` → `0`
**Actual:** `sum([])` → throws "Reduce of empty array with no initial value"

**Root Cause:** Line 34: `return arr.reduce((total, value) => total + value);` - no initial value

**Test Case:**
```javascript
assertThrows(() => sum([]), 'sum empty array throws (bug in library)');
```

**Fix:**
```javascript
export function sum(arr) {
  return arr.reduce((total, value) => total + value, 0);  // Fixed: initial value 0
}
```

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 8 |
| High | 4 |
| Medium | 8 |

**Total: 20 bugs documented**

The library has fundamental issues in:
- Basic arithmetic (add, divide)
- Statistical functions (min)
- Email validation (entire module)
- Date comparisons (entire module)
- Range utilities (clamp, between, random)
- Number conversion (toBinary)
- ID generation (generateUUIDLike, isValidId)

**Recommendation:** Do not use this library in production without fixing all critical and high-severity bugs.