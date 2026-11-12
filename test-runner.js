/**
 * Simple test runner for the utility library tests
 * Runs without Jest - uses native Node.js
 */

import fs from 'fs';
import path from 'path';

const testFiles = [
  'src/math/statisticsUtils.test.js',
  'src/validation/emailValidationUtils.test.js',
  'src/validation/passwordValidationUtils.test.js',
  'src/dates/formatDateUtils.test.js',
  'src/dates/compareDateUtils.test.js',
  'src/arrays/filterArrayUtils.test.js',
  'src/logic/rangeUtils.test.js',
  'src/conversion/numberConversionUtils.test.js',
  'src/conversion/temperatureUtils.test.js',
  'src/math/basicMathUtils.test.js',
  'src/collections/arrayCollectionUtils.test.js',
  'src/misc/idUtils.test.js'
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

async function runTests() {
  console.log('🧪 Starting test suite...\n');

  for (const testFile of testFiles) {
    const fullPath = path.join(process.cwd(), testFile);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Test file not found: ${testFile}`);
      continue;
    }

    try {
      const module = await import('file://' + fullPath);
      // Tests are executed on import due to top-level await/describe/it pattern
      // We need a different approach - let's execute the test functions
    } catch (error) {
      console.log(`❌ Error loading ${testFile}: ${error.message}`);
    }
  }

  // Actually, let's use a simpler approach - execute each test file as a script
  console.log('Using alternative test execution...\n');

  // We'll create a test executor that runs the actual test logic
  const testModules = await import('./test-executor.js');
  await testModules.runAllTests();
}

runTests().catch(console.error);