import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { FavoritesService } from '@/services/favoritesService';
import { FavoriteItem } from '@/types';

export function useFavoritesRefresh() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const favoritesList = await FavoritesService.getFavorites();
      setFavorites(favoritesList);
    } catch (error) {
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  const refreshOnFocus = useCallback(() => {
    loadFavorites(true);
  }, [loadFavorites]);

  useEffect(() => {
    loadFavorites();

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        loadFavorites(false);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return {
    favorites,
    loading,
    refreshFavorites: loadFavorites,
    refreshOnFocus,
  };
}
