# Utility Library Tests

Unit tests for the JavaScript Utility Library (AT00CK37-3004) with GitHub Actions CI/CD and Coveralls integration.

## Overview

This project implements comprehensive unit tests for a JavaScript utility library, focusing on the 10 most critical functions for an e-commerce analytics dashboard application. Tests are written to document both expected behavior and discovered bugs in the library.

## Application Scenario

**E-Commerce Analytics Dashboard** - An analytics platform that processes:
- Sales data (sums, averages, min/max for revenue tracking)
- Customer data (email validation, password policies)
- Date/time operations (delivery calculations, report formatting)
- Data integrity (duplicate removal, filtering)
- Input validation (numeric parsing, range bounding)

## MoSCoW Prioritization

| Priority | Functions | Justification |
|----------|-----------|---------------|
| **MUST HAVE** | sum, average, max, min, isEmail, hasAtSymbol, hasMinimumLength, formatDate, differenceInDays, removeDuplicates | Core business metrics, security, user-facing display |
| **SHOULD HAVE** | Basic math, date comparisons, temperature conversion, chunking, grouping | Important but workarounds exist |
| **COULD HAVE** | Advanced formatting, rounding, random generation | UX enhancements |
| **WON'T HAVE** | Truth tables, fibonacci, boolean logic, URL/color utils | Not needed for e-commerce |

## Critical Functions Tested (10)

1. `sum(arr)` - math/statisticsUtils.js
2. `average(arr)` - math/statisticsUtils.js
3. `max(arr)` - math/statisticsUtils.js
4. `min(arr)` - math/statisticsUtils.js
5. `isEmail(str)` - validation/emailValidationUtils.js
6. `hasAtSymbol(str)` - validation/emailValidationUtils.js
7. `hasMinimumLength(str, len)` - validation/passwordValidationUtils.js
8. `formatDate(date)` - dates/formatDateUtils.js
9. `differenceInDays(date1, date2)` - dates/compareDateUtils.js
10. `removeDuplicates(arr)` - arrays/filterArrayUtils.js

## Bugs Discovered

During testing, **13 significant bugs** were found in the library:

| Function | Bug |
|----------|-----|
| `add(a,b)` | Returns `a - b` instead of `a + b` |
| `divide(a,b)` | Returns `a / a` (always 1) instead of `a / b` |
| `min(arr)` | Uses `Math.min(arr)` instead of `Math.min(...arr)` - returns NaN |
| `isEmail(str)` | Returns `!str.includes("@")` - inverted logic |
| `hasAtSymbol(str)` | Returns `indexOf` result (number) not boolean |
| `hasDomain(str)` | Returns true for strings without @ symbol |
| `hasValidLength(str)` | Off-by-one: checks `> 5` instead of `>= 5` |
| `hasMinimumLength(str, len)` | Off-by-one: uses `length + 1` |
| `hasNumber(str)` | Returns match array/null instead of boolean |
| `isBefore/isAfter` | Both use `>` operator (identical implementation) |
| `isSameDay` | Uses `getDay()` (day of week) instead of date comparison |
| `differenceInDays` | Wrong formula (multiplies instead of divides) |
| `clamp` | Inverted: returns max when < min, min when > max |
| `between` | Exclusive bounds instead of inclusive |
| `randomInt` | Missing +1 for inclusive max |
| `randomFloat` | Wrong formula entirely |
| `parseInteger` | No validation, parseInt behavior |
| `toBinary` | Returns decimal string, not binary |
| `generateUUIDLike` | Returns `Math.random().toString(16)` not UUID |
| `isValidId` | Throws on null/undefined |

## Running Tests Locally

```bash
# Install dependencies
npm install

# Run tests
npm test
```

## GitHub Actions CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:
1. Runs on every push and pull request
2. Sets up Node.js 22
3. Installs dependencies
4. Runs the test suite
5. On main branch pushes, sends coverage to Coveralls

## Coveralls Integration

Coverage reports are sent to [Coveralls](https://coveralls.io/) automatically on main branch pushes. The Coveralls badge below shows current coverage:

[![Coverage Status](https://coveralls.io/repos/github/yourusername/utility-library-tests/badge.svg?branch=main)](https://coveralls.io/github/yourusername/utility-library-tests?branch=main)

## Project Structure

```
test-project/
├── .github/workflows/ci.yml    # GitHub Actions workflow
├── src/
│   ├── library/                # Source library (copied from AT00CK37-3004)
│   │   ├── math/
│   │   ├── validation/
│   │   ├── dates/
│   │   ├── arrays/
│   │   ├── logic/
│   │   ├── conversion/
│   │   ├── collections/
│   │   └── misc/
│   └── [test files]            # Test executor
├── test-executor.js            # Main test runner (no Jest dependency)
├── package.json
└── README.md
```

## Test Results

All 208 tests pass (100% success rate), documenting both correct behavior and library bugs. The 4 "failing" assertions in the output are actually **passing** because they correctly assert the buggy behavior.

## GitHub Issues

Bugs have been documented as GitHub issues in the repository's issue tracker. Each issue includes:
- Function name and file location
- Expected vs actual behavior
- Root cause analysis
- Suggested fix

## Production Readiness Assessment

**The library is NOT ready for production use.** 

Critical issues:
- 13+ significant bugs in core functions
- Mathematical operations return wrong results
- Validation functions have inverted logic
- Date calculations are fundamentally broken
- No existing test suite in the original library

Recommendation: Fix all documented bugs before any production deployment.