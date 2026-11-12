import { describe, it, expect } from '@jest/globals';
import { differenceInDays, isAfter, isBefore, isSameDay } from '../src/library/dates/compareDateUtils.js';

describe('compareDateUtils - Critical Functions for Delivery/Shipping Calculations', () => {

  describe('differenceInDays(date1, date2)', () => {
    it('should return positive difference when date1 is after date2', () => {
      const date1 = new Date('2024-01-20');
      const date2 = new Date('2024-01-15');
      expect(differenceInDays(date1, date2)).toBe(5);
    });

    it('should return negative difference when date1 is before date2', () => {
      const date1 = new Date('2024-01-10');
      const date2 = new Date('2024-01-15');
      expect(differenceInDays(date1, date2)).toBe(-5);
    });

    it('should return 0 for same day', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-15');
      expect(differenceInDays(date1, date2)).toBe(0);
    });

    it('should handle leap years', () => {
      const date1 = new Date('2024-03-01');
      const date2 = new Date('2024-02-28');
      expect(differenceInDays(date1, date2)).toBe(2); // Feb 29 exists in 2024
    });

    it('should handle year boundaries', () => {
      const date1 = new Date('2025-01-01');
      const date2 = new Date('2024-12-31');
      expect(differenceInDays(date1, date2)).toBe(1);
    });

    it('should calculate delivery time (e-commerce use case)', () => {
      const orderDate = new Date('2024-01-15');
      const deliveryDate = new Date('2024-01-20');
      expect(differenceInDays(deliveryDate, orderDate)).toBe(5);
    });

    it('should handle fractional days (time component)', () => {
      const date1 = new Date('2024-01-15T12:00:00');
      const date2 = new Date('2024-01-15T00:00:00');
      // 12 hours = 0.5 days
      expect(differenceInDays(date1, date2)).toBeCloseTo(0.5);
    });
  });

  describe('isAfter(date1, date2)', () => {
    it('should return true when date1 is after date2', () => {
      expect(isAfter(new Date('2024-01-20'), new Date('2024-01-15'))).toBe(true);
    });

    it('should return false when date1 is before date2', () => {
      expect(isAfter(new Date('2024-01-10'), new Date('2024-01-15'))).toBe(false);
    });

    it('should return false when dates are equal', () => {
      expect(isAfter(new Date('2024-01-15'), new Date('2024-01-15'))).toBe(false);
    });

    it('should handle time components', () => {
      expect(isAfter(new Date('2024-01-15T12:00:00'), new Date('2024-01-15T10:00:00'))).toBe(true);
    });
  });

  describe('isBefore(date1, date2)', () => {
    it('should return true when date1 is before date2', () => {
      expect(isBefore(new Date('2024-01-10'), new Date('2024-01-15'))).toBe(true);
    });

    it('should return false when date1 is after date2', () => {
      expect(isBefore(new Date('2024-01-20'), new Date('2024-01-15'))).toBe(false);
    });

    it('should return false when dates are equal', () => {
      expect(isBefore(new Date('2024-01-15'), new Date('2024-01-15'))).toBe(false);
    });

    it('should handle time components', () => {
      expect(isBefore(new Date('2024-01-15T10:00:00'), new Date('2024-01-15T12:00:00'))).toBe(true);
    });
  });

  describe('isSameDay(date1, date2)', () => {
    it('should return true for same day', () => {
      expect(isSameDay(new Date('2024-01-15T10:00:00'), new Date('2024-01-15T20:00:00'))).toBe(true);
    });

    it('should return false for different days', () => {
      expect(isSameDay(new Date('2024-01-15'), new Date('2024-01-16'))).toBe(false);
    });

    it('should return true for same date different times', () => {
      expect(isSameDay(new Date('2024-01-15T00:00:00'), new Date('2024-01-15T23:59:59'))).toBe(true);
    });

    it('should handle year boundaries', () => {
      expect(isSameDay(new Date('2024-12-31'), new Date('2025-01-01'))).toBe(false);
    });
  });
});