import { describe, it, expect } from '@jest/globals';
import { generateId, generateNumericId, generateUUIDLike, isValidId } from '../src/library/misc/idUtils.js';

describe('idUtils - Critical for Order/Customer ID Generation', () => {

  describe('generateId()', () => {
    it('should generate a string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate different IDs on each call', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      // Should have high uniqueness (allowing for tiny collision chance)
      expect(ids.size).toBeGreaterThan(90);
    });
  });

  describe('generateNumericId(length)', () => {
    it('should generate numeric string of specified length', () => {
      expect(generateNumericId(6)).toMatch(/^\d{6}$/);
      expect(generateNumericId(10)).toMatch(/^\d{10}$/);
      expect(generateNumericId(1)).toMatch(/^\d{1}$/);
    });

    it('should generate different IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 50; i++) {
        ids.add(generateNumericId(8));
      }
      expect(ids.size).toBeGreaterThan(40);
    });

    it('should throw for invalid length', () => {
      expect(() => generateNumericId(0)).toThrow();
      expect(() => generateNumericId(-1)).toThrow();
    });
  });

  describe('generateUUIDLike()', () => {
    it('should generate UUID-like string', () => {
      const uuid = generateUUIDLike();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should generate different UUIDs', () => {
      const uuids = new Set();
      for (let i = 0; i < 100; i++) {
        uuids.add(generateUUIDLike());
      }
      expect(uuids.size).toBe(100);
    });
  });

  describe('isValidId(str)', () => {
    it('should return true for valid generated IDs', () => {
      expect(isValidId(generateId())).toBe(true);
      expect(isValidId(generateNumericId(10))).toBe(true);
      expect(isValidId(generateUUIDLike())).toBe(true);
    });

    it('should return false for invalid strings', () => {
      expect(isValidId('')).toBe(false);
      expect(isValidId('abc')).toBe(false);
      expect(isValidId('123')).toBe(false); // Too short for default
    });

    it('should return false for null/undefined', () => {
      expect(isValidId(null)).toBe(false);
      expect(isValidId(undefined)).toBe(false);
    });
  });
});