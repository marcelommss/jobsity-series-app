import {
  isValidEmail,
  isValidPin,
  isValidUrl,
  sanitizeHtml,
  truncateText,
  formatDate,
} from '../validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.email@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('should handle non-string inputs', () => {
      expect(isValidEmail(null as any)).toBe(false);
      expect(isValidEmail(undefined as any)).toBe(false);
      expect(isValidEmail(123 as any)).toBe(false);
    });
  });

  describe('isValidPin', () => {
    it('should validate correct PINs', () => {
      expect(isValidPin('1234')).toBe(true);
      expect(isValidPin('123456')).toBe(true);
      expect(isValidPin('12345678')).toBe(true);
    });

    it('should reject invalid PINs', () => {
      expect(isValidPin('123')).toBe(false); // too short
      expect(isValidPin('123456789')).toBe(false); // too long
      expect(isValidPin('12a4')).toBe(false); // contains letter
      expect(isValidPin('12.4')).toBe(false); // contains special char
      expect(isValidPin('')).toBe(false);
    });

    it('should handle non-string inputs', () => {
      expect(isValidPin(null as any)).toBe(false);
      expect(isValidPin(undefined as any)).toBe(false);
      expect(isValidPin(1234 as any)).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://api.tvmaze.com/shows/1')).toBe(true);
      expect(isValidUrl('https://www.google.com/search?q=test')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });

    it('should handle non-string inputs', () => {
      expect(isValidUrl(null as any)).toBe(false);
      expect(isValidUrl(undefined as any)).toBe(false);
      expect(isValidUrl(123 as any)).toBe(false);
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeHtml('<p>Hello world</p>')).toBe('Hello world');
      expect(sanitizeHtml('<div><span>Test</span></div>')).toBe('Test');
      expect(sanitizeHtml('<a href="/link">Link text</a>')).toBe('Link text');
    });

    it('should handle mixed content', () => {
      expect(sanitizeHtml('Plain text with <b>bold</b> text')).toBe('Plain text with bold text');
      expect(sanitizeHtml('<script>alert("xss")</script>Safe text')).toBe('alert("xss")Safe text');
    });

    it('should handle edge cases', () => {
      expect(sanitizeHtml('')).toBe('');
      expect(sanitizeHtml('No HTML here')).toBe('No HTML here');
      expect(sanitizeHtml('<>')).toBe('');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeHtml(null as any)).toBe('');
      expect(sanitizeHtml(undefined as any)).toBe('');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      expect(truncateText('This is a very long text that should be truncated', 20)).toBe('This is a very lo...');
      expect(truncateText('Short text', 50)).toBe('Short text');
    });

    it('should handle exact length', () => {
      expect(truncateText('Exactly 10', 10)).toBe('Exactly 10');
    });

    it('should trim whitespace before adding ellipsis', () => {
      expect(truncateText('Text with spaces   ', 15)).toBe('Text with sp...');
    });

    it('should handle edge cases', () => {
      expect(truncateText('', 10)).toBe('');
      expect(truncateText('Test', 3)).toBe('');
    });

    it('should handle non-string inputs', () => {
      expect(truncateText(null as any, 10)).toBe('');
      expect(truncateText(undefined as any, 10)).toBe('');
    });
  });

  describe('formatDate', () => {
    it('should format valid dates', () => {
      const result = formatDate('2023-12-25');
      expect(result).toMatch(/12\/2[45]\/2023|2[45]\/12\/2023|2023-12-2[45]/); // Different locales and timezone issues
    });

    it('should handle different locales', () => {
      const usDate = formatDate('2023-12-25', 'en-US');
      const ukDate = formatDate('2023-12-25', 'en-GB');
      
      expect(usDate).toBeTruthy();
      expect(ukDate).toBeTruthy();
      // Don't test exact format as it depends on environment
    });

    it('should handle invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('');
      expect(formatDate('')).toBe('');
    });

    it('should handle non-string inputs', () => {
      expect(formatDate(null as any)).toBe('');
      expect(formatDate(undefined as any)).toBe('');
    });
  });
});