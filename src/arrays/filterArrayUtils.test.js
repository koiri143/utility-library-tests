import { describe, it, expect } from '@jest/globals';
import { removeDuplicates, removeFalsy, onlyEven, onlyOdd } from '../src/library/arrays/filterArrayUtils.js';

describe('filterArrayUtils - Critical Functions for Data Integrity', () => {

  describe('removeDuplicates(arr)', () => {
    it('should remove duplicate values from array', () => {
      expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should handle string arrays', () => {
      expect(removeDuplicates(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
    });

    it('should handle mixed types', () => {
      expect(removeDuplicates([1, '1', 2, '2', 1])).toEqual([1, '1', 2, '2']);
    });

    it('should return empty array for empty input', () => {
      expect(removeDuplicates([])).toEqual([]);
    });

    it('should return same array for no duplicates', () => {
      expect(removeDuplicates([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should deduplicate product IDs (e-commerce use case)', () => {
      const productIds = ['SKU001', 'SKU002', 'SKU001', 'SKU003', 'SKU002'];
      expect(removeDuplicates(productIds)).toEqual(['SKU001', 'SKU002', 'SKU003']);
    });

    it('should deduplicate customer emails', () => {
      const emails = ['a@b.com', 'c@d.com', 'a@b.com', 'e@f.com'];
      expect(removeDuplicates(emails)).toEqual(['a@b.com', 'c@d.com', 'e@f.com']);
    });

    it('should preserve order of first occurrence', () => {
      expect(removeDuplicates([3, 1, 2, 1, 3, 2])).toEqual([3, 1, 2]);
    });

    it('should handle objects (by reference)', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const arr = [obj1, obj2, obj1];
      expect(removeDuplicates(arr)).toEqual([obj1, obj2]);
    });
  });

  describe('removeFalsy(arr)', () => {
    it('should remove all falsy values', () => {
      expect(removeFalsy([0, 1, false, 2, '', 3, null, undefined, NaN])).toEqual([1, 2, 3]);
    });

    it('should keep truthy values', () => {
      expect(removeFalsy([1, 'hello', true, {}, [], 42])).toEqual([1, 'hello', true, {}, [], 42]);
    });

    it('should return empty array if all falsy', () => {
      expect(removeFalsy([0, false, '', null, undefined, NaN])).toEqual([]);
    });

    it('should return empty array for empty input', () => {
      expect(removeFalsy([])).toEqual([]);
    });

    it('should filter out invalid product data', () => {
      const products = [
        { name: 'Product A', price: 10 },
        null,
        { name: '', price: 0 },
        undefined,
        { name: 'Product B', price: 20 }
      ];
      expect(removeFalsy(products)).toEqual([
        { name: 'Product A', price: 10 },
        { name: '', price: 0 },
        { name: 'Product B', price: 20 }
      ]);
    });
  });

  describe('onlyEven(arr)', () => {
    it('should return only even numbers', () => {
      expect(onlyEven([1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
    });

    it('should return empty array if no evens', () => {
      expect(onlyEven([1, 3, 5])).toEqual([]);
    });

    it('should handle negative even numbers', () => {
      expect(onlyEven([-4, -3, -2, -1, 0, 1, 2])).toEqual([-4, -2, 0, 2]);
    });

    it('should return empty array for empty input', () => {
      expect(onlyEven([])).toEqual([]);
    });

    it('should filter even quantities', () => {
      const quantities = [1, 2, 3, 4, 5, 6, 7, 8];
      expect(onlyEven(quantities)).toEqual([2, 4, 6, 8]);
    });
  });

  describe('onlyOdd(arr)', () => {
    it('should return only odd numbers', () => {
      expect(onlyOdd([1, 2, 3, 4, 5, 6])).toEqual([1, 3, 5]);
    });

    it('should return empty array if no odds', () => {
      expect(onlyOdd([2, 4, 6])).toEqual([]);
    });

    it('should handle negative odd numbers', () => {
      expect(onlyOdd([-5, -4, -3, -2, -1, 0, 1])).toEqual([-5, -3, -1, 1]);
    });

    it('should return empty array for empty input', () => {
      expect(onlyOdd([])).toEqual([]);
    });
  });
});