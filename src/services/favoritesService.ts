import AsyncStorage from '@react-native-async-storage/async-storage';
import { Series } from '@/types';

const FAVORITES_KEY = 'favorites';

export interface FavoriteItem {
  id: number;
  name: string;
  image?: {
    medium?: string;
    original?: string;
  };
  genres?: string[];
  rating?: {
    average?: number;
  };
  status?: string;
  premiered?: string;
}

export class FavoritesService {
  
  static async getFavorites(): Promise<FavoriteItem[]> {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      return [];
    }
  }

  static async addFavorite(series: Series): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const favoriteItem: FavoriteItem = {
        id: series.id,
        name: series.name,
        image: series.image,
        genres: series.genres,
        rating: series.rating,
        status: series.status,
        premiered: series.premiered,
      };
      
      const updatedFavorites = [...favorites, favoriteItem];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      throw error;
    }
  }

  static async removeFavorite(seriesId: number): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== seriesId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      throw error;
    }
  }

  static async isFavorite(seriesId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.id === seriesId);
    } catch (error) {
      return false;
    }
  }

  static async toggleFavorite(series: Series): Promise<boolean> {
    try {
      const isCurrentlyFavorite = await this.isFavorite(series.id);
      
      if (isCurrentlyFavorite) {
        await this.removeFavorite(series.id);
        return false;
      } else {
        await this.addFavorite(series);
        return true;
      }
    } catch (error) {
      throw error;
    }
  }
}