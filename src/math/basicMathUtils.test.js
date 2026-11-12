import { describe, it, expect } from '@jest/globals';
import { add, subtract, multiply, divide } from '../src/library/math/basicMathUtils.js';

describe('basicMathUtils - Core Arithmetic Operations', () => {

  describe('add(a, b)', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it('should add positive and negative', () => {
      expect(add(5, -3)).toBe(2);
    });

    it('should add decimals', () => {
      expect(add(1.5, 2.5)).toBe(4);
      expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
      expect(add(0, 0)).toBe(0);
    });

    it('should handle large numbers', () => {
      expect(add(1e10, 2e10)).toBe(3e10);
    });
  });

  describe('subtract(a, b)', () => {
    it('should subtract two positive numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    it('should subtract negative numbers', () => {
      expect(subtract(-5, -3)).toBe(-2);
    });

    it('should subtract with negative result', () => {
      expect(subtract(3, 5)).toBe(-2);
    });

    it('should handle decimals', () => {
      expect(subtract(5.5, 2.2)).toBeCloseTo(3.3);
    });

    it('should handle zero', () => {
      expect(subtract(5, 0)).toBe(5);
      expect(subtract(0, 5)).toBe(-5);
    });
  });

  describe('multiply(a, b)', () => {
    it('should multiply two positive numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('should multiply by zero', () => {
      expect(multiply(5, 0)).toBe(0);
      expect(multiply(0, 5)).toBe(0);
    });

    it('should multiply negative numbers', () => {
      expect(multiply(-3, 4)).toBe(-12);
      expect(multiply(-3, -4)).toBe(12);
    });

    it('should multiply decimals', () => {
      expect(multiply(2.5, 4)).toBe(10);
      expect(multiply(0.1, 0.2)).toBeCloseTo(0.02);
    });

    it('should handle large numbers', () => {
      expect(multiply(1e5, 1e5)).toBe(1e10);
    });
  });

  describe('divide(a, b)', () => {
    it('should divide two positive numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should handle decimal results', () => {
      expect(divide(7, 2)).toBe(3.5);
      expect(divide(1, 3)).toBeCloseTo(0.3333333333333333);
    });

    it('should handle negative numbers', () => {
      expect(divide(-10, 2)).toBe(-5);
      expect(divide(10, -2)).toBe(-5);
      expect(divide(-10, -2)).toBe(5);
    });

    it('should return Infinity for division by zero', () => {
      expect(divide(10, 0)).toBe(Infinity);
      expect(divide(-10, 0)).toBe(-Infinity);
    });

    it('should return NaN for 0/0', () => {
      expect(divide(0, 0)).toBeNaN();
    });
  });
});