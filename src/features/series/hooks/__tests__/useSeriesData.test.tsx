import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSeriesData } from '../useSeriesData';
import * as seriesService from '@/services/seriesService';

jest.mock('@/services/seriesService');

const mockSeriesService = seriesService as jest.Mocked<typeof seriesService>;

describe('useSeriesData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSeriesData());

    expect(result.current.series).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.hasMore).toBe(true);
    expect(result.current.searchTerm).toBe('');
  });

  it('should load initial series data', async () => {
    const mockSeries = [
      { id: 1, name: 'Test Series 1', genres: ['Drama'], status: 'Running' },
      { id: 2, name: 'Test Series 2', genres: ['Comedy'], status: 'Ended' }
    ];

    mockSeriesService.fetchSeriesByPage.mockResolvedValueOnce(mockSeries as any);

    const { result } = renderHook(() => useSeriesData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.series).toEqual(mockSeries);
    expect(result.current.error).toBeNull();
    expect(mockSeriesService.fetchSeriesByPage).toHaveBeenCalledWith(0);
  });

  it('should handle loading more series', async () => {
    const initialSeries = [
      { id: 1, name: 'Series 1', genres: ['Drama'], status: 'Running' }
    ];
    const moreSeries = [
      { id: 2, name: 'Series 2', genres: ['Comedy'], status: 'Ended' }
    ];

    mockSeriesService.fetchSeriesByPage
      .mockResolvedValueOnce(initialSeries as any)
      .mockResolvedValueOnce(moreSeries as any);

    const { result } = renderHook(() => useSeriesData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.loadMoreSeries();
    });

    await waitFor(() => {
      expect(result.current.series).toEqual([...initialSeries, ...moreSeries]);
    });

    expect(mockSeriesService.fetchSeriesByPage).toHaveBeenCalledWith(1);
  });

  it('should handle search functionality', async () => {
    const searchResults = [
      { id: 3, name: 'Breaking Bad', genres: ['Drama'], status: 'Ended' }
    ];

    mockSeriesService.fetchSeriesByPage.mockResolvedValueOnce([] as any);
    mockSeriesService.searchSeriesByName.mockResolvedValueOnce(searchResults as any);

    const { result } = renderHook(() => useSeriesData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSearchTerm('Breaking Bad');
    });

    act(() => {
      result.current.setDebouncedSearchTerm('Breaking Bad');
    });

    await waitFor(() => {
      expect(result.current.series).toEqual(searchResults);
    });

    expect(mockSeriesService.searchSeriesByName).toHaveBeenCalledWith('Breaking Bad');
  });

  it('should clear search and reload series when search term is empty', async () => {
    const initialSeries = [
      { id: 1, name: 'Initial Series', genres: ['Drama'], status: 'Running' }
    ];

    mockSeriesService.fetchSeriesByPage.mockResolvedValue(initialSeries as any);

    const { result } = renderHook(() => useSeriesData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setDebouncedSearchTerm('');
    });

    await waitFor(() => {
      expect(result.current.series).toEqual(initialSeries);
    });

    expect(mockSeriesService.fetchSeriesByPage).toHaveBeenCalledWith(0);
  });

  it('should handle errors when loading series', async () => {
    const error = new seriesService.SeriesServiceError('Network error', 500);
    mockSeriesService.fetchSeriesByPage.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSeriesData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual({
      message: 'Network error',
      status: 500
    });
    expect(result.current.series).toEqual([]);
  });

  it('should handle errors when searching', async () => {
    const error = new seriesService.SeriesServiceError('Search failed', 400);
    
    mockSeriesService.fetchSeriesByPage.mockResolvedValueOnce([]);
    mockSeriesService.searchSeriesByName.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSeriesData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setDebouncedSearchTerm('invalid search');
    });

    await waitFor(() => {
      expect(result.current.error).toEqual({
        message: 'Search failed',
        status: 400
      });
    });
  });

  it('should refresh series data', async () => {
    const refreshedSeries = [
      { id: 4, name: 'Refreshed Series', genres: ['Action'], status: 'Running' }
    ];

    mockSeriesService.fetchSeriesByPage
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(refreshedSeries as any);

    const { result } = renderHook(() => useSeriesData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refreshSeries();
    });

    expect(result.current.series).toEqual(refreshedSeries);
  });

  it('should set hasMore to false when no more series available', async () => {
    mockSeriesService.fetchSeriesByPage
      .mockResolvedValueOnce([{ id: 1, name: 'Series 1' }] as any)
      .mockResolvedValueOnce([]);

    const { result } = renderHook(() => useSeriesData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.loadMoreSeries();
    });

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false);
    });
  });

  it('should prevent multiple simultaneous loads', async () => {
    mockSeriesService.fetchSeriesByPage.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve([]), 100))
    );

    const { result } = renderHook(() => useSeriesData());

    act(() => {
      result.current.loadMoreSeries();
      result.current.loadMoreSeries();
      result.current.loadMoreSeries();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockSeriesService.fetchSeriesByPage).toHaveBeenCalledTimes(2);
  });
});