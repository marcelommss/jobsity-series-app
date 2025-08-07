import {
  fetchSeriesByPage,
  searchSeriesByName,
  fetchSeriesById,
  SeriesServiceError
} from '../seriesService';
import { Series } from '@/types';

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('seriesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchSeriesByPage', () => {
    it('should fetch series successfully', async () => {
      const mockSeries: Series[] = [
        {
          id: 1,
          name: 'Test Series',
          genres: ['Drama'],
          status: 'Running',
          premiered: '2023-01-01',
          rating: { average: 8.5 },
          image: { medium: 'test.jpg', original: 'test-large.jpg' },
          summary: 'Test summary',
          schedule: { time: '20:00', days: ['Monday'] },
          network: { id: 1, name: 'Test Network', country: { name: 'USA', code: 'US' } }
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSeries),
        status: 200,
        statusText: 'OK'
      } as any);

      const result = await fetchSeriesByPage(0);

      expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows?page=0');
      expect(result).toEqual(mockSeries);
    });

    it('should throw SeriesServiceError on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as any);

      await expect(fetchSeriesByPage(999)).rejects.toThrow(SeriesServiceError);
      await expect(fetchSeriesByPage(999)).rejects.toThrow('Error fetching series (page 999): Not Found');
    });

    it('should throw SeriesServiceError on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchSeriesByPage(0)).rejects.toThrow(SeriesServiceError);
      await expect(fetchSeriesByPage(0)).rejects.toThrow('Failed to fetch series data');
    });

    it('should handle invalid response data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue('invalid data'),
        status: 200,
        statusText: 'OK'
      } as any);

      await expect(fetchSeriesByPage(0)).rejects.toThrow(SeriesServiceError);
    });
  });

  describe('searchSeriesByName', () => {
    it('should search series successfully', async () => {
      const mockSearchResults = [
        {
          show: {
            id: 1,
            name: 'Breaking Bad',
            genres: ['Drama', 'Crime'],
            status: 'Ended',
            premiered: '2008-01-20',
            rating: { average: 9.5 },
            image: { medium: 'bb.jpg', original: 'bb-large.jpg' },
            summary: '<p>Breaking Bad summary</p>',
            schedule: { time: '21:00', days: ['Sunday'] },
            network: { id: 1, name: 'AMC', country: { name: 'USA', code: 'US' } }
          }
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSearchResults),
        status: 200,
        statusText: 'OK'
      } as any);

      const result = await searchSeriesByName('Breaking Bad');

      expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/search/shows?q=Breaking%20Bad');
      expect(result).toEqual([mockSearchResults[0].show]);
    });

    it('should handle special characters in search query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
        status: 200,
        statusText: 'OK'
      } as any);

      await searchSeriesByName('Game of Thrones & Dragons');

      expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/search/shows?q=Game%20of%20Thrones%20%26%20Dragons');
    });

    it('should throw SeriesServiceError on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as any);

      await expect(searchSeriesByName('test')).rejects.toThrow(SeriesServiceError);
      await expect(searchSeriesByName('test')).rejects.toThrow('Error searching series: Internal Server Error');
    });

    it('should return empty array for no results', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
        status: 200,
        statusText: 'OK'
      } as any);

      const result = await searchSeriesByName('NonexistentShow');
      expect(result).toEqual([]);
    });
  });

  describe('fetchSeriesById', () => {
    it('should fetch series details successfully', async () => {
      const mockSeries: Series = {
        id: 1,
        name: 'Test Series',
        genres: ['Drama'],
        status: 'Running',
        premiered: '2023-01-01',
        rating: { average: 8.5 },
        image: { medium: 'test.jpg', original: 'test-large.jpg' },
        summary: 'Test summary',
        schedule: { time: '20:00', days: ['Monday'] },
        network: { id: 1, name: 'Test Network', country: { name: 'USA', code: 'US' } }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSeries),
        status: 200,
        statusText: 'OK'
      } as any);

      const result = await fetchSeriesById(1);

      expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/1');
      expect(result).toEqual(mockSeries);
    });

    it('should throw SeriesServiceError for non-existent series', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as any);

      await expect(fetchSeriesById(999999)).rejects.toThrow(SeriesServiceError);
      await expect(fetchSeriesById(999999)).rejects.toThrow('Error fetching series details: Not Found');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'));

      await expect(fetchSeriesById(1)).rejects.toThrow(SeriesServiceError);
      await expect(fetchSeriesById(1)).rejects.toThrow('Failed to fetch series details');
    });
  });

  describe('SeriesServiceError', () => {
    it('should create error with message and status', () => {
      const error = new SeriesServiceError('Test error', 404);
      
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(404);
      expect(error.name).toBe('SeriesServiceError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should create error without status', () => {
      const error = new SeriesServiceError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.status).toBeUndefined();
      expect(error.name).toBe('SeriesServiceError');
    });
  });
});