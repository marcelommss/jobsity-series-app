import { formatYear, formatRating, formatGenres, getStatusColor } from '../seriesFormatting';
describe('Series Formatting Utils', () => {
  describe('formatYear', () => {
    it('should format valid date string', () => {
      expect(formatYear('2008-01-20')).toBe('2008');
      expect(formatYear('2013-09-29')).toBe('2013');
    });

    it('should handle null and undefined', () => {
      expect(formatYear(null)).toBe('');
      expect(formatYear(undefined)).toBe('');
    });

    it('should handle empty string', () => {
      expect(formatYear('')).toBe('');
    });

    it('should handle invalid date strings', () => {
      expect(formatYear('invalid-date')).toBe('');
      expect(formatYear('not-a-date')).toBe('');
    });

    it('should handle ISO date strings', () => {
      expect(formatYear('2020-01-15')).toBe('2020');
      expect(formatYear('2021-12-31')).toBe('2021');
    });
  });

  describe('formatRating', () => {
    it('should format valid rating', () => {
      expect(formatRating({ average: 9.5 })).toBe('9.5');
      expect(formatRating({ average: 8.1234 })).toBe('8.1');
      expect(formatRating({ average: 7.0 })).toBe('7.0');
    });

    it('should handle null rating', () => {
      expect(formatRating(null)).toBe('');
      expect(formatRating(undefined)).toBe('');
    });

    it('should handle null average', () => {
      expect(formatRating({ average: null })).toBe('');
    });

    it('should handle zero rating', () => {
      expect(formatRating({ average: 0 })).toBe('');
    });

    it('should handle negative rating', () => {
      expect(formatRating({ average: -1 })).toBe('-1.0');
    });
  });

  describe('formatGenres', () => {
    it('should format genres with default max count', () => {
      expect(formatGenres(['Drama', 'Crime', 'Thriller'])).toBe('Drama • Crime • Thriller');
      expect(formatGenres(['Drama', 'Crime', 'Thriller', 'Mystery'])).toBe('Drama • Crime • Thriller');
    });

    it('should format genres with custom max count', () => {
      expect(formatGenres(['Drama', 'Crime', 'Thriller', 'Mystery'], 2)).toBe('Drama • Crime');
      expect(formatGenres(['Drama'], 5)).toBe('Drama');
    });

    it('should handle empty or null genres', () => {
      expect(formatGenres(null)).toBe('');
      expect(formatGenres(undefined)).toBe('');
      expect(formatGenres([])).toBe('');
    });

    it('should handle single genre', () => {
      expect(formatGenres(['Drama'])).toBe('Drama');
    });

    it('should handle genres with special characters', () => {
      expect(formatGenres(['Sci-Fi', 'Action & Adventure'])).toBe('Sci-Fi • Action & Adventure');
    });
  });

  describe('getStatusColor', () => {
    it('should return correct colors for known statuses', () => {
      expect(getStatusColor('Ended')).toBe('error');
      expect(getStatusColor('Running')).toBe('success');
    });

    it('should return default for unknown statuses', () => {
      expect(getStatusColor('In Development')).toBe('default');
      expect(getStatusColor('To Be Determined')).toBe('default');
      expect(getStatusColor('Unknown Status')).toBe('default');
    });

    it('should handle null and undefined', () => {
      expect(getStatusColor(null)).toBe('default');
      expect(getStatusColor(undefined)).toBe('default');
    });

    it('should handle empty string', () => {
      expect(getStatusColor('')).toBe('default');
    });

    it('should be case sensitive', () => {
      expect(getStatusColor('ended')).toBe('default'); // lowercase
      expect(getStatusColor('ENDED')).toBe('default'); // uppercase
      expect(getStatusColor('running')).toBe('default'); // lowercase
    });
  });
});