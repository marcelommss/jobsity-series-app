import { fetchSeriesEpisodes, EpisodesServiceError } from '../episodesService';
import { Episode } from '@/types';

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('episodesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchSeriesEpisodes', () => {
    it('should fetch episodes successfully', async () => {
      const mockEpisodes: Episode[] = [
        {
          id: 1,
          name: 'Pilot',
          season: 1,
          number: 1,
          airdate: '2008-01-20',
          runtime: 47,
          summary: '<p>Pilot episode</p>',
          image: { medium: 'pilot.jpg', original: 'pilot-large.jpg' }
        },
        {
          id: 2,
          name: 'Cat\'s in the Bag...',
          season: 1,
          number: 2,
          airdate: '2008-01-27',
          runtime: 48,
          summary: '<p>Second episode</p>',
          image: { medium: 'ep2.jpg', original: 'ep2-large.jpg' }
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockEpisodes),
        status: 200,
        statusText: 'OK'
      } as any);

      const result = await fetchSeriesEpisodes(1);

      expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/1/episodes');
      expect(result).toEqual(mockEpisodes);
    });

    it('should throw EpisodesServiceError on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as any);

      await expect(fetchSeriesEpisodes(999999)).rejects.toThrow(EpisodesServiceError);
      await expect(fetchSeriesEpisodes(999999)).rejects.toThrow('Error fetching episodes: Not Found');
    });

    it('should throw EpisodesServiceError on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchSeriesEpisodes(1)).rejects.toThrow(EpisodesServiceError);
      await expect(fetchSeriesEpisodes(1)).rejects.toThrow('Failed to fetch episodes');
    });

    it('should handle invalid response data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue('invalid data'),
        status: 200,
        statusText: 'OK'
      } as any);

      await expect(fetchSeriesEpisodes(1)).rejects.toThrow(EpisodesServiceError);
    });

    it('should handle empty episodes array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
        status: 200,
        statusText: 'OK'
      } as any);

      const result = await fetchSeriesEpisodes(1);
      expect(result).toEqual([]);
    });

    it('should handle episodes with missing optional fields', async () => {
      const mockEpisodes: Episode[] = [
        {
          id: 1,
          name: 'Episode without extras',
          season: 1,
          number: 1,
          airdate: '2008-01-20',
          runtime: 47,
          summary: null,
          image: null
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockEpisodes),
        status: 200,
        statusText: 'OK'
      } as any);

      const result = await fetchSeriesEpisodes(1);
      expect(result).toEqual(mockEpisodes);
    });
  });

  describe('EpisodesServiceError', () => {
    it('should create error with message and status', () => {
      const error = new EpisodesServiceError('Test error', 500);
      
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(500);
      expect(error.name).toBe('EpisodesServiceError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should create error without status', () => {
      const error = new EpisodesServiceError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.status).toBeUndefined();
      expect(error.name).toBe('EpisodesServiceError');
    });
  });
});