import { describe, it, expect } from '@jest/globals';
import { formatDate, formatISO, formatTime, getWeekday } from '../src/library/dates/formatDateUtils.js';

describe('formatDateUtils - Critical Functions for Report Display', () => {

  describe('formatDate(date)', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(formatDate(date)).toBe('2024-01-15');
    });

    it('should handle different months and days', () => {
      expect(formatDate(new Date('2024-12-31'))).toBe('2024-12-31');
      expect(formatDate(new Date('2024-02-29'))).toBe('2024-02-29'); // leap year
      expect(formatDate(new Date('2024-06-05'))).toBe('2024-06-05');
    });

    it('should handle year boundaries', () => {
      expect(formatDate(new Date('2024-01-01'))).toBe('2024-01-01');
      expect(formatDate(new Date('2024-12-31'))).toBe('2024-12-31');
    });

    it('should handle dates in different timezones', () => {
      const date = new Date('2024-01-15T23:00:00Z'); // Could be different day in some timezones
      // formatDate should use local date components
      const result = formatDate(date);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should throw for invalid date', () => {
      expect(() => formatDate(new Date('invalid'))).toThrow();
    });

    it('should throw for null/undefined', () => {
      expect(() => formatDate(null)).toThrow();
      expect(() => formatDate(undefined)).toThrow();
    });
  });

  describe('formatISO(date)', () => {
    it('should format date as ISO string', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      expect(formatISO(date)).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should handle different dates', () => {
      const date = new Date('2024-12-31T23:59:59.999Z');
      expect(formatISO(date)).toBe('2024-12-31T23:59:59.999Z');
    });
  });

  describe('formatTime(date)', () => {
    it('should format time as HH:MM:SS', () => {
      const date = new Date('2024-01-15T10:30:45Z');
      expect(formatTime(date)).toBe('10:30:45');
    });

    it('should handle midnight', () => {
      const date = new Date('2024-01-15T00:00:00Z');
      expect(formatTime(date)).toBe('00:00:00');
    });

    it('should handle end of day', () => {
      const date = new Date('2024-01-15T23:59:59Z');
      expect(formatTime(date)).toBe('23:59:59');
    });
  });

  describe('getWeekday(date)', () => {
    it('should return correct weekday name', () => {
      // Jan 15, 2024 is a Monday
      expect(getWeekday(new Date('2024-01-15'))).toBe('Monday');
      // Jan 16, 2024 is a Tuesday
      expect(getWeekday(new Date('2024-01-16'))).toBe('Tuesday');
      // Jan 17, 2024 is a Wednesday
      expect(getWeekday(new Date('2024-01-17'))).toBe('Wednesday');
      // Jan 18, 2024 is a Thursday
      expect(getWeekday(new Date('2024-01-18'))).toBe('Thursday');
      // Jan 19, 2024 is a Friday
      expect(getWeekday(new Date('2024-01-19'))).toBe('Friday');
      // Jan 20, 2024 is a Saturday
      expect(getWeekday(new Date('2024-01-20'))).toBe('Saturday');
      // Jan 21, 2024 is a Sunday
      expect(getWeekday(new Date('2024-01-21'))).toBe('Sunday');
    });
  });
});