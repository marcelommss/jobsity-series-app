import { useState, useEffect } from 'react';
import { AppState } from 'react-native';
import { FavoritesService, FavoriteItem } from '@/services/favoritesService';

export function useFavoritesRefresh() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favoritesList = await FavoritesService.getFavorites();
      setFavorites(favoritesList);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();

    // Listen for app state changes to refresh favorites when app becomes active
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        loadFavorites();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  return { favorites, loading, refreshFavorites: loadFavorites };
}