import { describe, it, expect } from '@jest/globals';
import { parseInteger, toBinary, toString } from '../src/library/conversion/numberConversionUtils.js';

describe('numberConversionUtils - Critical Functions for Input Parsing', () => {

  describe('parseInteger(str)', () => {
    it('should parse positive integers', () => {
      expect(parseInteger('42')).toBe(42);
      expect(parseInteger('0')).toBe(0);
      expect(parseInteger('1000')).toBe(1000);
    });

    it('should parse negative integers', () => {
      expect(parseInteger('-42')).toBe(-42);
      expect(parseInteger('-1')).toBe(-1);
    });

    it('should handle leading/trailing whitespace', () => {
      expect(parseInteger('  42  ')).toBe(42);
      expect(parseInteger('\t100\n')).toBe(100);
    });

    it('should return NaN for invalid strings', () => {
      expect(parseInteger('abc')).toBeNaN();
      expect(parseInteger('12.34')).toBeNaN(); // Not an integer
      expect(parseInteger('')).toBeNaN();
      expect(parseInteger('123abc')).toBeNaN();
    });

    it('should handle large integers', () => {
      expect(parseInteger('2147483647')).toBe(2147483647);
      expect(parseInteger('-2147483648')).toBe(-2147483648);
    });

    it('should parse quantities from user input (e-commerce use case)', () => {
      expect(parseInteger('5')).toBe(5);
      expect(parseInteger('10')).toBe(10);
      expect(parseInteger('  3  ')).toBe(3);
    });
  });

  describe('toBinary(n)', () => {
    it('should convert positive numbers to binary', () => {
      expect(toBinary(0)).toBe('0');
      expect(toBinary(1)).toBe('1');
      expect(toBinary(2)).toBe('10');
      expect(toBinary(5)).toBe('101');
      expect(toBinary(10)).toBe('1010');
      expect(toBinary(255)).toBe('11111111');
    });

    it('should handle negative numbers', () => {
      expect(toBinary(-1)).toContain('1'); // Two's complement
      expect(toBinary(-5)).toContain('1');
    });
  });

  describe('toString(value)', () => {
    it('should convert numbers to strings', () => {
      expect(toString(42)).toBe('42');
      expect(toString(0)).toBe('0');
      expect(toString(-10)).toBe('-10');
      expect(toString(3.14)).toBe('3.14');
    });

    it('should handle special values', () => {
      expect(toString(Infinity)).toBe('Infinity');
      expect(toString(-Infinity)).toBe('-Infinity');
      expect(toString(NaN)).toBe('NaN');
    });
  });
});