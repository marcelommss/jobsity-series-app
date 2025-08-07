import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useEpisodes } from '../useEpisodes';
import * as episodesService from '../services/episodesService';

jest.mock('../services/episodesService');

const mockEpisodesService = episodesService as jest.Mocked<typeof episodesService>;

describe('useEpisodes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useEpisodes(1));

    expect(result.current.episodes).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should load episodes for a series', async () => {
    const mockEpisodes = [
      { id: 1, name: 'Pilot', season: 1, number: 1, airdate: '2008-01-20', runtime: 47 },
      { id: 2, name: 'Cat\'s in the Bag...', season: 1, number: 2, airdate: '2008-01-27', runtime: 48 },
      { id: 3, name: 'Season 2 Premiere', season: 2, number: 1, airdate: '2009-03-08', runtime: 47 }
    ];

    mockEpisodesService.fetchSeriesEpisodes.mockResolvedValueOnce(mockEpisodes as any);

    const { result } = renderHook(() => useEpisodes(1));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.episodes).toEqual([
      {
        season: 1,
        episodes: [
          { id: 1, name: 'Pilot', season: 1, number: 1, airdate: '2008-01-20', runtime: 47 },
          { id: 2, name: 'Cat\'s in the Bag...', season: 1, number: 2, airdate: '2008-01-27', runtime: 48 }
        ]
      },
      {
        season: 2,
        episodes: [
          { id: 3, name: 'Season 2 Premiere', season: 2, number: 1, airdate: '2009-03-08', runtime: 47 }
        ]
      }
    ]);
    expect(result.current.error).toBeNull();
    expect(mockEpisodesService.fetchSeriesEpisodes).toHaveBeenCalledWith(1);
  });

  it('should group episodes by season and sort correctly', async () => {
    const mockEpisodes = [
      { id: 4, name: 'Episode 2', season: 2, number: 2, airdate: '2009-03-15', runtime: 47 },
      { id: 1, name: 'Pilot', season: 1, number: 1, airdate: '2008-01-20', runtime: 47 },
      { id: 3, name: 'Episode 1', season: 2, number: 1, airdate: '2009-03-08', runtime: 47 },
      { id: 2, name: 'Episode 2', season: 1, number: 2, airdate: '2008-01-27', runtime: 48 }
    ];

    mockEpisodesService.fetchSeriesEpisodes.mockResolvedValueOnce(mockEpisodes as any);

    const { result } = renderHook(() => useEpisodes(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.episodes).toEqual([
      {
        season: 1,
        episodes: [
          { id: 1, name: 'Pilot', season: 1, number: 1, airdate: '2008-01-20', runtime: 47 },
          { id: 2, name: 'Episode 2', season: 1, number: 2, airdate: '2008-01-27', runtime: 48 }
        ]
      },
      {
        season: 2,
        episodes: [
          { id: 3, name: 'Episode 1', season: 2, number: 1, airdate: '2009-03-08', runtime: 47 },
          { id: 4, name: 'Episode 2', season: 2, number: 2, airdate: '2009-03-15', runtime: 47 }
        ]
      }
    ]);
  });

  it('should handle empty episodes array', async () => {
    mockEpisodesService.fetchSeriesEpisodes.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useEpisodes(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.episodes).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors when loading episodes', async () => {
    const error = new episodesService.EpisodesServiceError('Failed to fetch episodes', 404);
    mockEpisodesService.fetchSeriesEpisodes.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useEpisodes(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual({
      message: 'Failed to fetch episodes',
      status: 404
    });
    expect(result.current.episodes).toEqual([]);
  });

  it('should handle generic errors', async () => {
    const error = new Error('Generic error');
    mockEpisodesService.fetchSeriesEpisodes.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useEpisodes(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual({
      message: 'Failed to load episodes'
    });
  });

  it('should not load episodes when seriesId is 0 or falsy', () => {
    const { result } = renderHook(() => useEpisodes(0));

    expect(result.current.loading).toBe(false);
    expect(result.current.episodes).toEqual([]);
    expect(mockEpisodesService.fetchSeriesEpisodes).not.toHaveBeenCalled();
  });

  it('should refresh episodes', async () => {
    const initialEpisodes = [
      { id: 1, name: 'Initial Episode', season: 1, number: 1, airdate: '2008-01-20', runtime: 47 }
    ];
    const refreshedEpisodes = [
      { id: 1, name: 'Updated Episode', season: 1, number: 1, airdate: '2008-01-20', runtime: 47 }
    ];

    mockEpisodesService.fetchSeriesEpisodes
      .mockResolvedValueOnce(initialEpisodes as any)
      .mockResolvedValueOnce(refreshedEpisodes as any);

    const { result } = renderHook(() => useEpisodes(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refreshEpisodes();
    });

    expect(result.current.episodes[0].episodes).toEqual(refreshedEpisodes);
    expect(mockEpisodesService.fetchSeriesEpisodes).toHaveBeenCalledTimes(2);
  });

  it('should reload episodes when seriesId changes', async () => {
    const episodes1 = [
      { id: 1, name: 'Series 1 Episode', season: 1, number: 1, airdate: '2008-01-20', runtime: 47 }
    ];
    const episodes2 = [
      { id: 2, name: 'Series 2 Episode', season: 1, number: 1, airdate: '2009-01-20', runtime: 47 }
    ];

    mockEpisodesService.fetchSeriesEpisodes
      .mockResolvedValueOnce(episodes1 as any)
      .mockResolvedValueOnce(episodes2 as any);

    const { result, rerender } = renderHook(
      ({ seriesId }) => useEpisodes(seriesId),
      { initialProps: { seriesId: 1 } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.episodes[0].episodes).toEqual(episodes1);

    rerender({ seriesId: 2 });

    await waitFor(() => {
      expect(result.current.episodes[0].episodes).toEqual(episodes2);
    });

    expect(mockEpisodesService.fetchSeriesEpisodes).toHaveBeenCalledWith(1);
    expect(mockEpisodesService.fetchSeriesEpisodes).toHaveBeenCalledWith(2);
  });
});