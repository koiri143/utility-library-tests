import { describe, it, expect } from '@jest/globals';
import { chunk, flatten, intersection, unique } from '../src/library/collections/arrayCollectionUtils.js';

describe('arrayCollectionUtils - Important for Data Processing', () => {

  describe('chunk(arr, size)', () => {
    it('should split array into chunks of specified size', () => {
      expect(chunk([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
      expect(chunk([1, 2, 3, 4, 5], 3)).toEqual([[1, 2, 3], [4, 5]]);
    });

    it('should handle size larger than array', () => {
      expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });

    it('should handle size of 1', () => {
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });

    it('should return empty array for empty input', () => {
      expect(chunk([], 3)).toEqual([]);
    });

    it('should paginate products (e-commerce use case)', () => {
      const products = Array.from({ length: 25 }, (_, i) => `Product ${i + 1}`);
      const pages = chunk(products, 10);
      expect(pages).toHaveLength(3);
      expect(pages[0]).toHaveLength(10);
      expect(pages[1]).toHaveLength(10);
      expect(pages[2]).toHaveLength(5);
    });
  });

  describe('flatten(arr)', () => {
    it('should flatten nested array by one level', () => {
      expect(flatten([[1, 2], [3, 4], [5, 6]])).toEqual([1, 2, 3, 4, 5, 6]);
      expect(flatten([[1], [2], [3]])).toEqual([1, 2, 3]);
    });

    it('should handle empty nested arrays', () => {
      expect(flatten([[], [1, 2], []])).toEqual([1, 2]);
      expect(flatten([[], [], []])).toEqual([]);
    });

    it('should return empty array for empty input', () => {
      expect(flatten([])).toEqual([]);
    });

    it('should not flatten deeply nested arrays', () => {
      expect(flatten([[1, [2, 3]], [4]])).toEqual([1, [2, 3], 4]);
    });
  });

  describe('intersection(a, b)', () => {
    it('should return common elements', () => {
      expect(intersection([1, 2, 3, 4], [3, 4, 5, 6])).toEqual([3, 4]);
      expect(intersection(['a', 'b', 'c'], ['b', 'c', 'd'])).toEqual(['b', 'c']);
    });

    it('should return empty array for no intersection', () => {
      expect(intersection([1, 2, 3], [4, 5, 6])).toEqual([]);
    });

    it('should handle empty arrays', () => {
      expect(intersection([], [1, 2, 3])).toEqual([]);
      expect(intersection([1, 2, 3], [])).toEqual([]);
    });

    it('should find common products in orders', () => {
      const order1 = ['SKU001', 'SKU002', 'SKU003'];
      const order2 = ['SKU002', 'SKU003', 'SKU004'];
      expect(intersection(order1, order2)).toEqual(['SKU002', 'SKU003']);
    });
  });

  describe('unique(arr)', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should handle strings', () => {
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should return empty array for empty input', () => {
      expect(unique([])).toEqual([]);
    });

    it('should preserve order', () => {
      expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
    });
  });
});