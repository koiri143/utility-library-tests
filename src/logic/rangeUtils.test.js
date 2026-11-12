import { describe, it, expect } from '@jest/globals';
import { clamp, between, randomInt, randomFloat } from '../src/library/logic/rangeUtils.js';

describe('rangeUtils - Critical Functions for Value Validation & Bounding', () => {

  describe('clamp(value, min, max)', () => {
    it('should return value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('should return min when value is below min', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(-100, 0, 10)).toBe(0);
    });

    it('should return max when value is above max', () => {
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(100, 0, 10)).toBe(10);
    });

    it('should handle negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
      expect(clamp(-15, -10, -1)).toBe(-10);
      expect(clamp(0, -10, -1)).toBe(-1);
    });

    it('should handle decimal values', () => {
      expect(clamp(5.5, 0, 10)).toBe(5.5);
      expect(clamp(-1.5, 0, 10)).toBe(0);
      expect(clamp(15.5, 0, 10)).toBe(10);
    });

    it('should bound discount percentages (e-commerce use case)', () => {
      expect(clamp(150, 0, 100)).toBe(100); // Cap at 100%
      expect(clamp(-10, 0, 100)).toBe(0);   // Floor at 0%
      expect(clamp(25, 0, 100)).toBe(25);   // Normal discount
    });

    it('should bound rating values (1-5 stars)', () => {
      expect(clamp(6, 1, 5)).toBe(5);
      expect(clamp(0, 1, 5)).toBe(1);
      expect(clamp(3.5, 1, 5)).toBe(3.5);
    });
  });

  describe('between(value, min, max)', () => {
    it('should return true for value strictly between min and max', () => {
      expect(between(5, 0, 10)).toBe(true);
      expect(between(1, 0, 10)).toBe(true);
      expect(between(9, 0, 10)).toBe(true);
    });

    it('should return false for value equal to min (exclusive)', () => {
      expect(between(0, 0, 10)).toBe(false);
    });

    it('should return false for value equal to max (exclusive)', () => {
      expect(between(10, 0, 10)).toBe(false);
    });

    it('should return false for value below min', () => {
      expect(between(-1, 0, 10)).toBe(false);
      expect(between(-100, 0, 10)).toBe(false);
    });

    it('should return false for value above max', () => {
      expect(between(11, 0, 10)).toBe(false);
      expect(between(100, 0, 10)).toBe(false);
    });

    it('should handle negative ranges', () => {
      expect(between(-5, -10, -1)).toBe(true);
      expect(between(-10, -10, -1)).toBe(false);
      expect(between(-1, -10, -1)).toBe(false);
    });

    it('should handle decimal values', () => {
      expect(between(5.5, 0, 10)).toBe(true);
      expect(between(0.1, 0, 10)).toBe(true);
      expect(between(9.9, 0, 10)).toBe(true);
    });

    it('should validate price ranges (e-commerce use case)', () => {
      // Product must be between $10 and $1000
      expect(between(50, 10, 1000)).toBe(true);
      expect(between(5, 10, 1000)).toBe(false);
      expect(between(1500, 10, 1000)).toBe(false);
    });

    it('should validate quantity ranges', () => {
      // Quantity must be between 1 and 100
      expect(between(10, 1, 100)).toBe(true);
      expect(between(0, 1, 100)).toBe(false);
      expect(between(101, 1, 100)).toBe(false);
    });
  });

  describe('randomInt(min, max)', () => {
    it('should return integer within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(0, 10);
        expect(Number.isInteger(result)).toBe(true);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(10);
      }
    });

    it('should handle negative ranges', () => {
      for (let i = 0; i < 50; i++) {
        const result = randomInt(-10, -1);
        expect(Number.isInteger(result)).toBe(true);
        expect(result).toBeGreaterThanOrEqual(-10);
        expect(result).toBeLessThanOrEqual(-1);
      }
    });

    it('should return min when min === max', () => {
      expect(randomInt(5, 5)).toBe(5);
    });
  });

  describe('randomFloat(min, max)', () => {
    it('should return float within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(0, 10);
        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(10);
      }
    });

    it('should handle negative ranges', () => {
      for (let i = 0; i < 50; i++) {
        const result = randomFloat(-10, -1);
        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThanOrEqual(-10);
        expect(result).toBeLessThanOrEqual(-1);
      }
    });
  });
});