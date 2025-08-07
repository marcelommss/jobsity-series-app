import { renderHook, waitFor, act } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { useFavoritesRefresh } from '../useFavoritesRefresh';
import { FavoritesService, FavoriteItem } from '@/services/favoritesService';

// Mock the FavoritesService
jest.mock('@/services/favoritesService');
const mockFavoritesService = FavoritesService as jest.Mocked<typeof FavoritesService>;

// Mock AppState
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  AppState: {
    addEventListener: jest.fn(),
  },
}));

describe('useFavoritesRefresh', () => {
  let mockAppStateListener: (state: string) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock AppState.addEventListener to capture the listener
    (AppState.addEventListener as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'change') {
        mockAppStateListener = callback;
      }
      return { remove: jest.fn() };
    });
  });

  const mockFavorites: FavoriteItem[] = [
    {
      id: 1,
      name: 'Breaking Bad',
      image: {
        medium: 'https://example.com/bb-medium.jpg',
        original: 'https://example.com/bb-original.jpg',
      },
      genres: ['Drama', 'Crime'],
      rating: { average: 9.5 },
      status: 'Ended',
      premiered: '2008-01-20',
    },
    {
      id: 2,
      name: 'Game of Thrones',
      image: null,
      genres: ['Fantasy', 'Drama'],
      rating: { average: 8.8 },
      status: 'Ended',
      premiered: '2011-04-17',
    }
  ];

  it('should initialize with loading state and load favorites', async () => {
    mockFavoritesService.getFavorites.mockResolvedValueOnce(mockFavorites);
    
    const { result } = renderHook(() => useFavoritesRefresh());

    // Initially should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.favorites).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.favorites).toEqual(mockFavorites);
    expect(mockFavoritesService.getFavorites).toHaveBeenCalledTimes(1);
  });

  it('should handle empty favorites', async () => {
    mockFavoritesService.getFavorites.mockResolvedValueOnce([]);
    
    const { result } = renderHook(() => useFavoritesRefresh());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.favorites).toEqual([]);
  });

  it('should handle service errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFavoritesService.getFavorites.mockRejectedValueOnce(new Error('Service error'));
    
    const { result } = renderHook(() => useFavoritesRefresh());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.favorites).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading favorites:', expect.any(Error));
    
    consoleErrorSpy.mockRestore();
  });

  it('should refresh favorites when app becomes active', async () => {
    mockFavoritesService.getFavorites
      .mockResolvedValueOnce(mockFavorites)
      .mockResolvedValueOnce([mockFavorites[0]]); // Second call returns different data
    
    const { result } = renderHook(() => useFavoritesRefresh());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.favorites).toEqual(mockFavorites);

    // Simulate app becoming active
    act(() => {
      mockAppStateListener('active');
    });

    await waitFor(() => {
      expect(result.current.favorites).toEqual([mockFavorites[0]]);
    });

    expect(mockFavoritesService.getFavorites).toHaveBeenCalledTimes(2);
  });

  it('should not refresh when app state changes to inactive or background', async () => {
    mockFavoritesService.getFavorites.mockResolvedValueOnce(mockFavorites);
    
    const { result } = renderHook(() => useFavoritesRefresh());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear the mock to test subsequent calls
    mockFavoritesService.getFavorites.mockClear();

    // Simulate app going to background
    act(() => {
      mockAppStateListener('background');
    });

    // Simulate app becoming inactive
    act(() => {
      mockAppStateListener('inactive');
    });

    // Should not have been called again
    expect(mockFavoritesService.getFavorites).not.toHaveBeenCalled();
  });

  it('should provide refreshFavorites function that manually triggers refresh', async () => {
    mockFavoritesService.getFavorites
      .mockResolvedValueOnce(mockFavorites)
      .mockResolvedValueOnce([mockFavorites[1]]);
    
    const { result } = renderHook(() => useFavoritesRefresh());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.favorites).toEqual(mockFavorites);

    // Manually trigger refresh
    act(() => {
      result.current.refreshFavorites();
    });

    await waitFor(() => {
      expect(result.current.favorites).toEqual([mockFavorites[1]]);
    });

    expect(mockFavoritesService.getFavorites).toHaveBeenCalledTimes(2);
  });

  it('should cleanup event listener on unmount', () => {
    const mockRemove = jest.fn();
    (AppState.addEventListener as jest.Mock).mockReturnValue({ remove: mockRemove });
    
    const { unmount } = renderHook(() => useFavoritesRefresh());

    unmount();

    expect(mockRemove).toHaveBeenCalled();
  });

  it('should handle multiple rapid app state changes', async () => {
    mockFavoritesService.getFavorites
      .mockResolvedValue(mockFavorites)
      .mockResolvedValue([mockFavorites[0]]);
    
    const { result } = renderHook(() => useFavoritesRefresh());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear mock to count subsequent calls
    mockFavoritesService.getFavorites.mockClear();

    // Rapid state changes
    act(() => {
      mockAppStateListener('active');
      mockAppStateListener('background');
      mockAppStateListener('active');
      mockAppStateListener('active');
    });

    // Should eventually settle
    await waitFor(() => {
      expect(mockFavoritesService.getFavorites).toHaveBeenCalled();
    });

    // The exact number of calls depends on implementation details,
    // but should handle rapid changes without crashing
    expect(mockFavoritesService.getFavorites.mock.calls.length).toBeGreaterThan(0);
  });
});