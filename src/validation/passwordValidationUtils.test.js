import { describe, it, expect } from '@jest/globals';
import { hasMinimumLength, hasUppercase, hasLowercase, hasNumber } from '../src/library/validation/passwordValidationUtils.js';

describe('passwordValidationUtils - Critical Functions for Security Policy', () => {

  describe('hasMinimumLength(str, length)', () => {
    it('should return true when string meets minimum length', () => {
      expect(hasMinimumLength('password123', 8)).toBe(true);
      expect(hasMinimumLength('abcdefgh', 8)).toBe(true);
      expect(hasMinimumLength('verylongpassword', 10)).toBe(true);
    });

    it('should return false when string is shorter than minimum', () => {
      expect(hasMinimumLength('short', 8)).toBe(false);
      expect(hasMinimumLength('abc', 5)).toBe(false);
      expect(hasMinimumLength('', 1)).toBe(false);
    });

    it('should return true when string exactly equals minimum length', () => {
      expect(hasMinimumLength('abcdefgh', 8)).toBe(true);
      expect(hasMinimumLength('12345', 5)).toBe(true);
    });

    it('should handle edge cases', () => {
      expect(hasMinimumLength('', 0)).toBe(true);
      expect(hasMinimumLength('a', 1)).toBe(true);
    });

    it('should return false for null/undefined', () => {
      expect(hasMinimumLength(null, 8)).toBe(false);
      expect(hasMinimumLength(undefined, 8)).toBe(false);
    });
  });

  describe('hasUppercase(str)', () => {
    it('should return true when string contains uppercase letters', () => {
      expect(hasUppercase('Password')).toBe(true);
      expect(hasUppercase('PASSWORD')).toBe(true);
      expect(hasUppercase('Pass123')).toBe(true);
      expect(hasUppercase('pAssword')).toBe(true);
    });

    it('should return false when string has no uppercase letters', () => {
      expect(hasUppercase('password')).toBe(false);
      expect(hasUppercase('123456')).toBe(false);
      expect(hasUppercase('!@#$%^')).toBe(false);
      expect(hasUppercase('')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(hasUppercase(null)).toBe(false);
      expect(hasUppercase(undefined)).toBe(false);
    });
  });

  describe('hasLowercase(str)', () => {
    it('should return true when string contains lowercase letters', () => {
      expect(hasLowercase('Password')).toBe(true);
      expect(hasLowercase('password')).toBe(true);
      expect(hasLowercase('Pass123')).toBe(true);
      expect(hasLowercase('PASSword')).toBe(true);
    });

    it('should return false when string has no lowercase letters', () => {
      expect(hasLowercase('PASSWORD')).toBe(false);
      expect(hasLowercase('123456')).toBe(false);
      expect(hasLowercase('!@#$%^')).toBe(false);
      expect(hasLowercase('')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(hasLowercase(null)).toBe(false);
      expect(hasLowercase(undefined)).toBe(false);
    });
  });

  describe('hasNumber(str)', () => {
    it('should return true when string contains numeric characters', () => {
      expect(hasNumber('Pass123')).toBe(true);
      expect(hasNumber('password1')).toBe(true);
      expect(hasNumber('123')).toBe(true);
      expect(hasNumber('Pass0')).toBe(true);
    });

    it('should return false when string has no numeric characters', () => {
      expect(hasNumber('Password')).toBe(false);
      expect(hasNumber('password')).toBe(false);
      expect(hasNumber('!@#$%^')).toBe(false);
      expect(hasNumber('')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(hasNumber(null)).toBe(false);
      expect(hasNumber(undefined)).toBe(false);
    });
  });
});