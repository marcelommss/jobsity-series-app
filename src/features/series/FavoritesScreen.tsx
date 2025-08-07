import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import SeriesCard from './components/SeriesCard';
import { FavoriteItem, Series } from '@/types';
import { useFavoritesRefresh } from './hooks/useFavoritesRefresh';

export function FavoritesScreen() {
  const { favorites, loading } = useFavoritesRefresh();

  const convertToSeries = (favorite: FavoriteItem): Series => ({
    id: favorite.id,
    name: favorite.name,
    image: favorite.image,
    genres: favorite.genres,
    rating: favorite.rating,
    status: favorite.status,
    premiered: favorite.premiered,
    summary: '',
    schedule: { time: '', days: [] },
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-dark">
        <ActivityIndicator size="large" color="#10F5D4" />
        <Text className="text-text-secondary mt-2">Loading favorites...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-dark" showsVerticalScrollIndicator={false}>
      <View className="p-4 pt-6">
        <View className="mb-6">
          <Text className="text-3xl font-sans-bold text-text-primary mb-2">
            Your Favorite Series
          </Text>
          <Text className="text-text-muted font-sans-regular">
            {favorites.length === 0
              ? 'No favorite series yet'
              : `${favorites.length} favorite series`}
          </Text>
        </View>

        {favorites.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-6xl mb-4">💙</Text>
            <Text className="text-xl font-sans-semibold text-text-primary mb-2 text-center">
              No Favorites Yet
            </Text>
            <Text className="text-text-muted text-center font-sans-regular leading-6 px-8">
              Start exploring TV series and tap the heart icon to add them to
              your favorites!
            </Text>
          </View>
        ) : (
          <View>
            {favorites.map((favorite) => (
              <SeriesCard
                key={favorite.id}
                series={convertToSeries(favorite)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
