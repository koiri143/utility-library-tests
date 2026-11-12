import { describe, it, expect } from '@jest/globals';
import { sum, average, max, min } from '../src/library/math/statisticsUtils.js';

describe('statisticsUtils - Critical Functions for E-Commerce Analytics', () => {

  describe('sum(arr)', () => {
    it('should return the sum of an array of positive numbers', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
    });

    it('should return the sum of an array with negative numbers', () => {
      expect(sum([-1, -2, 3, 4])).toBe(4);
    });

    it('should return the sum of an array with decimals', () => {
      expect(sum([1.5, 2.5, 3.0])).toBeCloseTo(7.0);
    });

    it('should return 0 for an empty array', () => {
      expect(sum([])).toBe(0);
    });

    it('should return the single element for array with one element', () => {
      expect(sum([42])).toBe(42);
    });

    it('should handle large numbers', () => {
      expect(sum([1e10, 2e10, 3e10])).toBe(6e10);
    });

    it('should handle order totals (e-commerce use case)', () => {
      const orderTotals = [29.99, 49.99, 19.99, 99.99];
      expect(sum(orderTotals)).toBeCloseTo(199.96);
    });

    it('should return NaN for array with NaN', () => {
      expect(sum([1, NaN, 3])).toBeNaN();
    });

    it('should handle very small decimals (financial precision)', () => {
      expect(sum([0.1, 0.2, 0.3])).toBeCloseTo(0.6);
    });
  });

  describe('average(arr)', () => {
    it('should return the average of an array of numbers', () => {
      expect(average([2, 4, 6, 8])).toBe(5);
    });

    it('should return the average with decimal result', () => {
      expect(average([1, 2, 3])).toBeCloseTo(2);
    });

    it('should return the single element for array with one element', () => {
      expect(average([10])).toBe(10);
    });

    it('should handle negative numbers', () => {
      expect(average([-10, 0, 10])).toBe(0);
    });

    it('should handle average order value calculation', () => {
      const orderValues = [25.50, 75.00, 150.00, 50.00];
      expect(average(orderValues)).toBeCloseTo(75.125);
    });

    it('should return NaN for empty array (division by zero)', () => {
      expect(average([])).toBeNaN();
    });

    it('should return NaN if array contains NaN', () => {
      expect(average([1, NaN, 3])).toBeNaN();
    });

    it('should handle large arrays', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i + 1);
      expect(average(largeArray)).toBe(500.5);
    });
  });

  describe('max(arr)', () => {
    it('should return the maximum value in an array', () => {
      expect(max([1, 5, 3, 9, 2])).toBe(9);
    });

    it('should return the maximum with negative numbers', () => {
      expect(max([-10, -5, -1, -20])).toBe(-1);
    });

    it('should return the single element for array with one element', () => {
      expect(max([42])).toBe(42);
    });

    it('should handle decimal numbers', () => {
      expect(max([1.1, 2.2, 3.3])).toBe(3.3);
    });

    it('should identify peak sales day', () => {
      const dailySales = [1200, 3400, 2100, 5500, 4300];
      expect(max(dailySales)).toBe(5500);
    });

    it('should return -Infinity for empty array', () => {
      expect(max([])).toBe(-Infinity);
    });

    it('should return NaN if array contains NaN', () => {
      expect(max([1, NaN, 3])).toBeNaN();
    });
  });

  describe('min(arr)', () => {
    it('should return the minimum value in an array', () => {
      expect(min([5, 1, 9, 3, 7])).toBe(1);
    });

    it('should return the minimum with negative numbers', () => {
      expect(min([-1, -5, -3, -9])).toBe(-9);
    });

    it('should return the single element for array with one element', () => {
      expect(min([42])).toBe(42);
    });

    it('should handle decimal numbers', () => {
      expect(min([3.3, 1.1, 2.2])).toBe(1.1);
    });

    it('should identify lowest performing product', () => {
      const productSales = [150, 89, 234, 67, 445];
      expect(min(productSales)).toBe(67);
    });

    it('should return Infinity for empty array', () => {
      expect(min([])).toBe(Infinity);
    });

    it('should return NaN if array contains NaN', () => {
      expect(min([1, NaN, 3])).toBeNaN();
    });
  });
});