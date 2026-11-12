import { describe, it, expect } from '@jest/globals';
import { celsiusToFahrenheit, fahrenheitToCelsius, celsiusToKelvin, kelvinToCelsius } from '../src/library/conversion/temperatureUtils.js';

describe('temperatureUtils - Important for International Shipping', () => {

  describe('celsiusToFahrenheit(c)', () => {
    it('should convert freezing point', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);
    });

    it('should convert boiling point', () => {
      expect(celsiusToFahrenheit(100)).toBe(212);
    });

    it('should convert room temperature', () => {
      expect(celsiusToFahrenheit(20)).toBe(68);
      expect(celsiusToFahrenheit(25)).toBe(77);
    });

    it('should handle negative temperatures', () => {
      expect(celsiusToFahrenheit(-40)).toBe(-40); // Same in both scales
      expect(celsiusToFahrenheit(-10)).toBe(14);
    });

    it('should handle decimal temperatures', () => {
      expect(celsiusToFahrenheit(37.5)).toBeCloseTo(99.5);
    });
  });

  describe('fahrenheitToCelsius(f)', () => {
    it('should convert freezing point', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
    });

    it('should convert boiling point', () => {
      expect(fahrenheitToCelsius(212)).toBe(100);
    });

    it('should convert room temperature', () => {
      expect(fahrenheitToCelsius(68)).toBe(20);
      expect(fahrenheitToCelsius(77)).toBe(25);
    });

    it('should handle negative temperatures', () => {
      expect(fahrenheitToCelsius(-40)).toBe(-40);
      expect(fahrenheitToCelsius(14)).toBe(-10);
    });

    it('should handle decimal temperatures', () => {
      expect(fahrenheitToCelsius(99.5)).toBeCloseTo(37.5);
    });
  });

  describe('celsiusToKelvin(c)', () => {
    it('should convert freezing point', () => {
      expect(celsiusToKelvin(0)).toBe(273.15);
    });

    it('should convert boiling point', () => {
      expect(celsiusToKelvin(100)).toBe(373.15);
    });

    it('should convert absolute zero', () => {
      expect(celsiusToKelvin(-273.15)).toBe(0);
    });

    it('should handle room temperature', () => {
      expect(celsiusToKelvin(20)).toBe(293.15);
      expect(celsiusToKelvin(25)).toBe(298.15);
    });
  });

  describe('kelvinToCelsius(k)', () => {
    it('should convert absolute zero', () => {
      expect(kelvinToCelsius(0)).toBe(-273.15);
    });

    it('should convert freezing point', () => {
      expect(kelvinToCelsius(273.15)).toBe(0);
    });

    it('should convert boiling point', () => {
      expect(kelvinToCelsius(373.15)).toBe(100);
    });

    it('should handle room temperature', () => {
      expect(kelvinToCelsius(293.15)).toBe(20);
      expect(kelvinToCelsius(298.15)).toBe(25);
    });
  });

  describe('round-trip conversions', () => {
    it('should maintain precision for C -> F -> C', () => {
      const original = 25.5;
      const fahrenheit = celsiusToFahrenheit(original);
      const back = fahrenheitToCelsius(fahrenheit);
      expect(back).toBeCloseTo(original);
    });

    it('should maintain precision for C -> K -> C', () => {
      const original = 25.5;
      const kelvin = celsiusToKelvin(original);
      const back = kelvinToCelsius(kelvin);
      expect(back).toBeCloseTo(original);
    });
  });
});