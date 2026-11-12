# Application Design and Function Prioritization

## Chosen Application: **E-Commerce Analytics Dashboard**

An analytics dashboard for an e-commerce platform that processes sales data, customer information, product catalogs, and generates reports. The application needs to:
- Process and validate customer data (emails, passwords)
- Analyze sales data (sums, averages, min/max)
- Format dates and times for reports
- Transform and filter arrays of products/orders
- Convert between units (temperature for international shipping, time for delivery estimates)
- Validate input data at API boundaries
- Generate unique IDs for orders, customers, sessions

---

## MoSCoW Prioritization of Library Functions

### **MUST HAVE** (Critical for core functionality)
These functions are essential for the e-commerce analytics dashboard to function correctly:

1. **`sum(arr)`** (math/statisticsUtils.js) - Calculate total revenue, order totals
2. **`average(arr)`** (math/statisticsUtils.js) - Average order value, conversion rates
3. **`max(arr)` / `min(arr)`** (math/statisticsUtils.js) - Peak sales, lowest performing products
4. **`isEmail(str)`** (validation/emailValidationUtils.js) - Validate customer emails at registration/checkout
5. **`hasAtSymbol(str)`** (validation/emailValidationUtils.js) - Quick email format check
6. **`hasMinimumLength(str, length)`** (validation/passwordValidationUtils.js) - Password policy enforcement
7. **`formatDate(date)`** (dates/formatDateUtils.js) - Display dates in reports (YYYY-MM-DD)
8. **`differenceInDays(date1, date2)`** (dates/compareDateUtils.js) - Calculate delivery times, subscription durations
9. **`removeDuplicates(arr)`** (arrays/filterArrayUtils.js) - Deduplicate product lists, customer emails
10. **`clamp(value, min, max)`** (logic/rangeUtils.js) - Bound values for ratings, discounts (0-100%)
11. **`between(value, min, max)`** (logic/rangeUtils.js) - Validate price ranges, quantities
12. **`parseInteger(str)`** (conversion/numberConversionUtils.js) - Parse quantities, IDs from strings

### **SHOULD HAVE** (Important but workarounds exist)
1. **`add(a, b)` / `subtract(a, b)` / `multiply(a, b)` / `divide(a, b)`** (math/basicMathUtils.js) - Basic calculations
2. **`isAfter(date1, date2)` / `isBefore(date1, date2)`** (dates/compareDateUtils.js) - Date comparisons
3. **`celsiusToFahrenheit(c)` / `fahrenheitToCelsius(f)`** (conversion/temperatureUtils.js) - International shipping temps
4. **`chunk(arr, size)`** (collections/arrayCollectionUtils.js) - Paginate product listings
5. **`groupBy(arr, key)`** (collections/groupCollectionUtils.js) - Group orders by customer, category
6. **`frequency(arr)`** (collections/frequencyCollectionUtils.js) - Top selling products
7. **`contains(arr, value)`** (arrays/searchArrayUtils.js) - Check product in cart
8. **`trim(str)`** (strings/trimUtils.js) - Clean user input
9. **`generateId()`** (misc/idUtils.js) - Generate order/customer IDs
10. **`isNumber(value)`** (validation/numberValidationUtils.js) - Validate numeric inputs

### **COULD HAVE** (Nice to have, enhances UX)
1. **`formatISO(date)` / `formatTime(date)`** (dates/formatDateUtils.js) - Alternative date formats
2. **`roundTo(n, decimals)`** (math/roundingUtils.js) - Currency formatting
3. **`toPercent(value)`** (misc/formatUtils.js) - Display conversion rates
4. **`splitWords(str)` / `splitByComma(str)`** (strings/splitUtils.js) - Parse search queries, tags
5. **`capitalize(str)` / `lowercase(str)`** (strings/caseUtils.js) - Normalize display text
4. **`randomInt(min, max)`** (logic/rangeUtils.js) - A/B test bucketing
5. **`hexToRgb(hex)` / `rgbToHex(r,g,b)`** (misc/colorUtils.js) - Theme customization
6. **`getExtension(filename)`** (misc/fileUtils.js) - File upload validation

### **WON'T HAVE** (Not needed for this application)
1. **`truthTableUtils`** (logic/truthTableUtils.js) - Academic/logic exercise, not business need
2. **`fibonacci(n)` / `factorial(n)`** (math/advancedMathUtils.js) - Mathematical curiosities
3. **`xor / and / or / not`** (logic/booleanUtils.js) - Primitive operations available in JS
4. **`comparisonUtils`** (logic/comparisonUtils.js) - Native JS operators sufficient
5. **`guardUtils`** (logic/guardUtils.js) - Native type checks sufficient
6. **`colorUtils`** (misc/colorUtils.js) - Beyond scope (theme handled by CSS)
7. **`urlUtils`** (misc/urlUtils.js) - Handled by browser URL API
8. **`pathObjectUtils`** (objects/pathObjectUtils.js) - Complex nested objects not in domain
9. **`transformObjectUtils`** (objects/transformObjectUtils.js) - Not needed for flat e-commerce data
10. **`stringConversionUtils`** (conversion/stringConversionUtils.js) - Native JSON/array methods sufficient

---

## Selected 10 Most Critical Functions for Testing

Based on the MUST HAVE category, the **10 most critical functions** to test extensively are:

| # | Function | File | Reason |
|---|----------|------|--------|
| 1 | `sum(arr)` | math/statisticsUtils.js | Core revenue calculation - financial accuracy critical |
| 2 | `average(arr)` | math/statisticsUtils.js | Average order value - key business metric |
| 3 | `max(arr)` | math/statisticsUtils.js | Peak performance identification |
| 4 | `min(arr)` | math/statisticsUtils.js | Lowest performance identification |
| 5 | `isEmail(str)` | validation/emailValidationUtils.js | Customer registration - security & UX critical |
| 6 | `hasAtSymbol(str)` | validation/emailValidationUtils.js | Quick email validation gate |
| 7 | `hasMinimumLength(str, len)` | validation/passwordValidationUtils.js | Security policy enforcement |
| 8 | `formatDate(date)` | dates/formatDateUtils.js | Report display - user-facing |
| 9 | `differenceInDays(date1, date2)` | dates/compareDateUtils.js | Delivery/shipping calculations |
| 10 | `removeDuplicates(arr)` | arrays/filterArrayUtils.js | Data integrity for catalogs, customer lists |

**Note:** We also include `clamp` and `between` from logic/rangeUtils.js and `parseInteger` from conversion/numberConversionUtils.js as they're equally critical but we're limited to 10. These will be tested as bonus coverage.

---

## Bugs Discovered During Analysis

During the prioritization analysis, the following bugs were identified in the source library:

1. **`add(a, b)`** in math/basicMathUtils.js: Returns `a - b` instead of `a + b`
2. **`divide(a, b)`** in math/basicMathUtils.js: Returns `a / a` instead of `a / b`
3. **`isEmail(str)`** in validation/emailValidationUtils.js: Returns `!str.includes("@")` - inverted logic!
4. **`hasAtSymbol(str)`** in validation/emailValidationUtils.js: Returns `str.indexOf("@")` (number) instead of boolean
5. **`isBefore(date1, date2)`** in dates/compareDateUtils.js: Uses `>` instead of `<`
6. **`isAfter(date1, date2)`** in dates/compareDateUtils.js: Same as isBefore (both use `>`)
7. **`isSameDay(date1, date2)`** in dates/compareDateUtils.js: Uses `getDay()` (day of week) instead of date comparison
8. **`differenceInDays(date1, date2)`** in dates/compareDateUtils.js: Wrong formula - should divide by `(1000 * 60 * 60 * 24)`
9. **`min(arr)`** in math/statisticsUtils.js: Uses `Math.min(arr)` instead of `Math.min(...arr)`
10. **`clamp(value, min, max)`** in logic/rangeUtils.js: Returns `max` when `value < min` and `min` when `value > max` - inverted!
11. **`between(value, min, max)`** in logic/rangeUtils.js: Uses strict `>` and `<` instead of `>=` and `<=`
12. **`randomInt(min, max)`** in logic/rangeUtils.js: Missing `+ 1` for inclusive max
13. **`randomFloat(min, max)`** in logic/rangeUtils.js: Formula is `Math.random() * min + max` - completely wrong

These bugs will be documented as GitHub issues and tests will be written to expose them.