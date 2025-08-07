import { searchPeople, fetchPersonById, getPersonCastCredits, PeopleServiceError } from '../peopleService';
import { Person, PersonSearchResult } from '@/types';

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('peopleService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('searchPeople', () => {
    const mockPersonSearchResults: PersonSearchResult[] = [
      {
        score: 0.5,
        person: {
          id: 1,
          name: 'John Doe',
          image: {
            medium: 'https://example.com/john-medium.jpg',
            original: 'https://example.com/john-original.jpg',
          },
          country: {
            name: 'United States',
            code: 'US',
            timezone: 'America/New_York',
          },
          birthday: '1980-01-01',
          deathday: null,
          gender: 'Male',
          url: 'https://www.tvmaze.com/people/1/john-doe',
          updated: 1234567890,
          _links: {
            self: {
              href: 'https://api.tvmaze.com/people/1'
            }
          }
        }
      },
      {
        score: 0.3,
        person: {
          id: 2,
          name: 'Jane Smith',
          image: null,
          country: null,
          birthday: null,
          deathday: null,
          gender: 'Female',
          url: 'https://www.tvmaze.com/people/2/jane-smith',
          updated: 1234567891,
          _links: {
            self: {
              href: 'https://api.tvmaze.com/people/2'
            }
          }
        }
      }
    ];

    it('should return empty array for empty query', async () => {
      const result = await searchPeople('');
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return empty array for whitespace query', async () => {
      const result = await searchPeople('   ');
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should search people successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPersonSearchResults,
      } as Response);

      const result = await searchPeople('john');
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/search/people?q=john');
      expect(result).toEqual([mockPersonSearchResults[0].person, mockPersonSearchResults[1].person]);
    });

    it('should handle URL encoding for search query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      await searchPeople('john doe & friends');
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/search/people?q=john%20doe%20%26%20friends');
    });

    it('should throw PeopleServiceError for HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(searchPeople('john')).rejects.toThrow(PeopleServiceError);
      await expect(searchPeople('john')).rejects.toThrow('Network error occurred while searching people');
    });

    it('should throw PeopleServiceError for network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(searchPeople('john')).rejects.toThrow(PeopleServiceError);
      await expect(searchPeople('john')).rejects.toThrow('Network error occurred while searching people');
    });
  });

  describe('fetchPersonById', () => {
    const mockPerson: Person = {
      id: 1,
      name: 'John Doe',
      image: {
        medium: 'https://example.com/john-medium.jpg',
        original: 'https://example.com/john-original.jpg',
      },
      country: {
        name: 'United States',
        code: 'US',
        timezone: 'America/New_York',
      },
      birthday: '1980-01-01',
      deathday: null,
      gender: 'Male',
      url: 'https://www.tvmaze.com/people/1/john-doe',
      updated: 1234567890,
      _links: {
        self: {
          href: 'https://api.tvmaze.com/people/1'
        }
      }
    };

    it('should fetch person by id successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPerson,
      } as Response);

      const result = await fetchPersonById(1);
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/people/1');
      expect(result).toEqual(mockPerson);
    });

    it('should throw PeopleServiceError for 404 errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(fetchPersonById(999)).rejects.toThrow(PeopleServiceError);
      await expect(fetchPersonById(999)).rejects.toThrow('Network error occurred while fetching person');
    });

    it('should throw PeopleServiceError for other HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(fetchPersonById(1)).rejects.toThrow(PeopleServiceError);
      await expect(fetchPersonById(1)).rejects.toThrow('Network error occurred while fetching person');
    });

    it('should throw PeopleServiceError for network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchPersonById(1)).rejects.toThrow(PeopleServiceError);
      await expect(fetchPersonById(1)).rejects.toThrow('Network error occurred while fetching person');
    });
  });

  describe('getPersonCastCredits', () => {
    const mockCastCredits = [
      {
        _links: {
          show: {
            href: 'https://api.tvmaze.com/shows/1'
          }
        }
      }
    ];

    it('should fetch cast credits successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCastCredits,
      } as Response);

      const result = await getPersonCastCredits(1);
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/people/1/castcredits');
      expect(result).toEqual(mockCastCredits);
    });

    it('should throw PeopleServiceError for HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(getPersonCastCredits(1)).rejects.toThrow(PeopleServiceError);
      await expect(getPersonCastCredits(1)).rejects.toThrow('Network error occurred while fetching cast credits');
    });

    it('should throw PeopleServiceError for network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getPersonCastCredits(1)).rejects.toThrow(PeopleServiceError);
      await expect(getPersonCastCredits(1)).rejects.toThrow('Network error occurred while fetching cast credits');
    });
  });
});