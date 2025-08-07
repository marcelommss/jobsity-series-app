import { formatAge, createPersonRouterParams } from '../personUtils';
describe('Person Utils', () => {
  describe('formatAge', () => {
    it('should return null for null birthday', () => {
      expect(formatAge(null)).toBe(null);
    });

    it('should return null for empty birthday', () => {
      expect(formatAge('')).toBe(null);
    });

    it('should calculate age for living person', () => {
      // Mock Date constructor properly
      const originalDate = global.Date;
      const mockDate = new originalDate('2024-01-01');
      
      global.Date = jest.fn((date) => {
        if (date) return new originalDate(date);
        return mockDate;
      }) as any;
      global.Date.prototype = originalDate.prototype;

      const result = formatAge('1990-01-01');
      expect(result).toBe('34 years old');

      global.Date = originalDate;
    });

    it('should calculate age for deceased person', () => {
      const result = formatAge('1950-01-15', '2020-12-25');
      expect(result).toBe('70 (1950-2020)');
    });

    it('should handle age calculation with birthday later in year', () => {
      // Mock Date constructor properly
      const originalDate = global.Date;
      const mockDate = new originalDate('2024-01-01');
      
      global.Date = jest.fn((date) => {
        if (date) return new originalDate(date);
        return mockDate;
      }) as any;
      global.Date.prototype = originalDate.prototype;

      const result = formatAge('1990-06-15'); // Birthday later in the year
      expect(result).toBe('33 years old'); // Should be 33, not 34

      global.Date = originalDate;
    });

    it('should handle invalid date strings gracefully', () => {
      expect(formatAge('invalid-date')).toBe(null);
    });

    it('should handle leap years correctly', () => {
      // Mock Date constructor properly  
      const originalDate = global.Date;
      const mockDate = new originalDate('2024-02-28');
      
      global.Date = jest.fn((date) => {
        if (date) return new originalDate(date);
        return mockDate;
      }) as any;
      global.Date.prototype = originalDate.prototype;

      const result = formatAge('2000-02-29');
      expect(result).toBe('23 years old');

      global.Date = originalDate;
    });
  });

  describe('createPersonRouterParams', () => {
    it('should create correct router params with all fields', () => {
      const person = {
        id: 123,
        name: 'John Doe',
        image: { medium: 'https://example.com/john.jpg', original: 'https://example.com/john-orig.jpg' },
        country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
        birthday: '1990-01-15',
        deathday: null,
        gender: 'Male',
      };

      const result = createPersonRouterParams(person);

      expect(result).toEqual({
        id: '123',
        name: 'John Doe',
        image: 'https://example.com/john.jpg',
        country: 'United States',
        birthday: '1990-01-15',
        deathday: '',
        gender: 'Male',
      });
    });

    it('should handle missing optional fields', () => {
      const person = {
        id: 456,
        name: 'Jane Smith',
        image: null,
        country: null,
        birthday: null,
        deathday: null,
        gender: null,
      };

      const result = createPersonRouterParams(person);

      expect(result).toEqual({
        id: '456',
        name: 'Jane Smith',
        image: '',
        country: '',
        birthday: '',
        deathday: '',
        gender: '',
      });
    });

    it('should handle partial image data', () => {
      const person = {
        id: 789,
        name: 'Bob Wilson',
        image: { medium: null, original: 'https://example.com/bob-orig.jpg' },
        country: { name: 'Canada', code: 'CA', timezone: 'America/Toronto' },
        birthday: '1985-12-03',
        deathday: '2021-05-15',
        gender: 'Male',
      };

      const result = createPersonRouterParams(person);

      expect(result).toEqual({
        id: '789',
        name: 'Bob Wilson',
        image: '',
        country: 'Canada',
        birthday: '1985-12-03',
        deathday: '2021-05-15',
        gender: 'Male',
      });
    });
  });
});