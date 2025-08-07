import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoritesService, FavoriteItem } from '../favoritesService';
import { Series } from '@/types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('FavoritesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockSeries: Series = {
    id: 1,
    name: 'Breaking Bad',
    image: {
      medium: 'https://example.com/bb-medium.jpg',
      original: 'https://example.com/bb-original.jpg',
    },
    genres: ['Drama', 'Crime', 'Thriller'],
    rating: { average: 9.5 },
    status: 'Ended',
    premiered: '2008-01-20',
    summary: 'A high school chemistry teacher...',
    language: 'English',
    type: 'Scripted',
    officialSite: 'https://www.amc.com/shows/breaking-bad',
    schedule: { time: '21:00', days: ['Sunday'] },
    weight: 99,
    network: {
      name: 'AMC',
      country: { name: 'United States', code: 'US' }
    },
    webChannel: null,
    dvdCountry: null,
    externals: { tvdb: 81189, thetvdb: 81189, imdb: 'tt0903747' },
    updated: 1704067200,
    _links: { self: { href: 'https://api.tvmaze.com/shows/1' } }
  };

  const mockFavoriteItem: FavoriteItem = {
    id: 1,
    name: 'Breaking Bad',
    image: {
      medium: 'https://example.com/bb-medium.jpg',
      original: 'https://example.com/bb-original.jpg',
    },
    genres: ['Drama', 'Crime', 'Thriller'],
    rating: { average: 9.5 },
    status: 'Ended',
    premiered: '2008-01-20',
  };

  describe('getFavorites', () => {
    it('should return empty array when no favorites exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await FavoritesService.getFavorites();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('favorites');
      expect(result).toEqual([]);
    });

    it('should return parsed favorites from storage', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockFavoriteItem]));

      const result = await FavoritesService.getFavorites();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('favorites');
      expect(result).toEqual([mockFavoriteItem]);
    });

    it('should return empty array on error', async () => {
      mockAsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await FavoritesService.getFavorites();

      expect(result).toEqual([]);
    });
  });

  describe('addFavorite', () => {
    it('should add a new favorite successfully', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
      mockAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      await FavoritesService.addFavorite(mockSeries);

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('favorites');
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'favorites',
        JSON.stringify([mockFavoriteItem])
      );
    });

    it('should add favorite to existing list', async () => {
      const existingFavorite = { ...mockFavoriteItem, id: 2, name: 'Game of Thrones' };
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([existingFavorite]));
      mockAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      await FavoritesService.addFavorite(mockSeries);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'favorites',
        JSON.stringify([existingFavorite, mockFavoriteItem])
      );
    });

    it('should throw error on storage failure', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
      mockAsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage error'));

      await expect(FavoritesService.addFavorite(mockSeries)).rejects.toThrow('Storage error');
    });
  });

  describe('removeFavorite', () => {
    it('should remove favorite successfully', async () => {
      const favorites = [mockFavoriteItem, { ...mockFavoriteItem, id: 2, name: 'Game of Thrones' }];
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(favorites));
      mockAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      await FavoritesService.removeFavorite(1);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'favorites',
        JSON.stringify([{ ...mockFavoriteItem, id: 2, name: 'Game of Thrones' }])
      );
    });

    it('should handle removing non-existent favorite', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockFavoriteItem]));
      mockAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      await FavoritesService.removeFavorite(999);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'favorites',
        JSON.stringify([mockFavoriteItem])
      );
    });

    it('should handle storage failure gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));
      mockAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      await expect(FavoritesService.removeFavorite(1)).resolves.toBeUndefined();
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('favorites', JSON.stringify([]));
    });
  });

  describe('isFavorite', () => {
    it('should return true for existing favorite', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockFavoriteItem]));

      const result = await FavoritesService.isFavorite(1);

      expect(result).toBe(true);
    });

    it('should return false for non-existent favorite', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockFavoriteItem]));

      const result = await FavoritesService.isFavorite(999);

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      mockAsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await FavoritesService.isFavorite(1);

      expect(result).toBe(false);
    });
  });

  describe('toggleFavorite', () => {
    it('should add favorite when not currently favorited', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
      mockAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      const result = await FavoritesService.toggleFavorite(mockSeries);

      expect(result).toBe(true);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'favorites',
        JSON.stringify([mockFavoriteItem])
      );
    });

    it('should remove favorite when currently favorited', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockFavoriteItem]));
      mockAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      const result = await FavoritesService.toggleFavorite(mockSeries);

      expect(result).toBe(false);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('favorites', JSON.stringify([]));
    });

    it('should handle storage failure gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));
      mockAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      const result = await FavoritesService.toggleFavorite(mockSeries);
      expect(result).toBe(true);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'favorites',
        JSON.stringify([mockFavoriteItem])
      );
    });
  });
});