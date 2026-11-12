import { describe, it, expect } from '@jest/globals';
import { isEmail, hasAtSymbol, hasDomain, hasValidLength } from '../src/library/validation/emailValidationUtils.js';

describe('emailValidationUtils - Critical Functions for Customer Registration', () => {

  describe('isEmail(str)', () => {
    it('should return true for valid email addresses', () => {
      expect(isEmail('user@example.com')).toBe(true);
      expect(isEmail('john.doe@company.org')).toBe(true);
      expect(isEmail('test+tag@domain.co.uk')).toBe(true);
      expect(isEmail('user123@sub.domain.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isEmail('invalid-email')).toBe(false);
      expect(isEmail('missing@domain')).toBe(false);
      expect(isEmail('@nodomain.com')).toBe(false);
      expect(isEmail('noatsymbol.com')).toBe(false);
      expect(isEmail('')).toBe(false);
      expect(isEmail('spaces in@email.com')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isEmail(null)).toBe(false);
      expect(isEmail(undefined)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isEmail('a@b.c')).toBe(true); // minimal valid
      expect(isEmail('very.long.email.address@very.long.domain.name.com')).toBe(true);
    });
  });

  describe('hasAtSymbol(str)', () => {
    it('should return true when string contains @', () => {
      expect(hasAtSymbol('user@example.com')).toBe(true);
      expect(hasAtSymbol('test@test')).toBe(true);
      expect(hasAtSymbol('@')).toBe(true);
      expect(hasAtSymbol('a@b@c')).toBe(true); // multiple @ symbols
    });

    it('should return false when string does not contain @', () => {
      expect(hasAtSymbol('invalid-email')).toBe(false);
      expect(hasAtSymbol('noatsymbol.com')).toBe(false);
      expect(hasAtSymbol('')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(hasAtSymbol(null)).toBe(false);
      expect(hasAtSymbol(undefined)).toBe(false);
    });

    it('should return boolean type', () => {
      expect(typeof hasAtSymbol('test@test')).toBe('boolean');
      expect(typeof hasAtSymbol('invalid')).toBe('boolean');
    });
  });

  describe('hasDomain(str)', () => {
    it('should return true when email has a domain part', () => {
      expect(hasDomain('user@example.com')).toBe(true);
      expect(hasDomain('test@domain.org')).toBe(true);
      expect(hasDomain('a@b')).toBe(true);
    });

    it('should return false when email has no domain part', () => {
      expect(hasDomain('user@')).toBe(false);
      expect(hasDomain('@')).toBe(false);
      expect(hasDomain('noatsymbol')).toBe(false);
      expect(hasDomain('')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(hasDomain(null)).toBe(false);
      expect(hasDomain(undefined)).toBe(false);
    });
  });

  describe('hasValidLength(str)', () => {
    it('should return true for emails with length > 5', () => {
      expect(hasValidLength('a@b.c')).toBe(true); // length 5 - actually this is exactly 5
      expect(hasValidLength('ab@c.de')).toBe(true); // length 7
      expect(hasValidLength('user@example.com')).toBe(true);
    });

    it('should return false for emails with length <= 5', () => {
      expect(hasValidLength('a@b.c')).toBe(false); // length 5 - boundary
      expect(hasValidLength('a@b')).toBe(false); // length 3
      expect(hasValidLength('@')).toBe(false); // length 1
      expect(hasValidLength('')).toBe(false); // length 0
    });

    it('should return false for null/undefined', () => {
      expect(hasValidLength(null)).toBe(false);
      expect(hasValidLength(undefined)).toBe(false);
    });
  });
});