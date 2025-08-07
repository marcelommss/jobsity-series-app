import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, HeartIcon } from 'lucide-react-native';
import { Series, APIError } from '@/types';
import { fetchSeriesById, SeriesServiceError } from '@/services/seriesService';
import { FavoritesService } from '@/services/favoritesService';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { EpisodesList } from '@/features/episodes/components/EpisodesList';

export default function SeriesDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const seriesId = Number(id);

  useEffect(() => {
    const fetchData = async () => {
      if (!seriesId) return;

      setLoading(true);
      setError(null);

      try {
        const seriesData = await fetchSeriesById(seriesId);
        setSeries(seriesData);
        
        // Check if series is already favorited
        const favoriteStatus = await FavoritesService.isFavorite(seriesId);
        setIsFavorite(favoriteStatus);
      } catch (err) {
        const apiError: APIError = err instanceof SeriesServiceError
          ? { message: err.message, status: err.status }
          : { message: 'Failed to load series details' };
        setError(apiError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [seriesId]);

  const handleBack = () => {
    router.back();
  };

  const handleToggleFavorite = async () => {
    if (!series) return;
    
    try {
      const newFavoriteStatus = await FavoritesService.toggleFavorite(series);
      setIsFavorite(newFavoriteStatus);
    } catch (error) {
    }
  };

  const stripHtmlTags = (text: string) => {
    return text?.replace(/<[^>]*>/g, '') || '';
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-dark">
        <ErrorMessage error={error} />
      </SafeAreaView>
    );
  }

  if (!series) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <Text>Series not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="relative">
          {series.image?.original ? (
            <Image
              source={{ uri: series.image.original }}
              className="w-full h-80"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-80 bg-gray-300 justify-center items-center">
              <Text className="text-gray-600">No Image Available</Text>
            </View>
          )}
          
          {/* Back button - top left */}
          <TouchableOpacity
            onPress={handleBack}
            className="absolute top-4 left-4 w-10 h-10 bg-black/70 rounded-full items-center justify-center"
            activeOpacity={0.8}
          >
            <ArrowLeftIcon size={20} color="white" />
          </TouchableOpacity>
          
          {/* Favorite button - top right */}
          <TouchableOpacity
            onPress={handleToggleFavorite}
            className="absolute top-4 right-4 w-10 h-10 bg-black/70 rounded-full items-center justify-center"
            activeOpacity={0.8}
          >
            <HeartIcon 
              size={20} 
              color={isFavorite ? "#EF4444" : "white"} 
              fill={isFavorite ? "#EF4444" : "transparent"} 
            />
          </TouchableOpacity>
          
          <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
            <Text className="text-white text-2xl font-sans-bold">{series.name}</Text>
          </View>
        </View>

        <View className="p-4">
          {series.genres && series.genres.length > 0 && (
            <View className="mb-4">
              <Text className="text-lg font-sans-semibold text-text-primary mb-2">Genres</Text>
              <View className="flex-row flex-wrap">
                {series.genres.map((genre, index) => (
                  <View key={index} className="bg-accent-primary px-3 py-1 rounded-full mr-2 mb-2">
                    <Text className="text-text-primary font-sans-medium text-sm">{genre}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {series.schedule && (series.schedule.days.length > 0 || series.schedule.time) && (
            <View className="mb-4">
              <Text className="text-lg font-sans-semibold text-text-primary mb-2">Schedule</Text>
              <Text className="text-text-muted font-sans-regular">
                {series.schedule.days.length > 0 ? `${series.schedule.days.join(', ')}` : 'No air days'}
                {series.schedule.time && ` at ${series.schedule.time}`}
              </Text>
            </View>
          )}

          <View className="flex-row justify-between mb-4">
            {series.rating?.average && (
              <View>
                <Text className="text-sm font-sans-semibold text-text-primary">Rating</Text>
                <Text className="text-text-muted">{series.rating.average}/10</Text>
              </View>
            )}
            {series.status && (
              <View>
                <Text className="text-sm font-sans-semibold text-text-primary">Status</Text>
                <Text className="text-text-muted">{series.status}</Text>
              </View>
            )}
            {series.network && (
              <View>
                <Text className="text-sm font-sans-semibold text-text-primary">Network</Text>
                <Text className="text-text-muted">{series.network.name}</Text>
              </View>
            )}
          </View>

          {series.summary && (
            <View className="mb-6">
              <Text className="text-lg font-sans-semibold text-text-primary mb-2">Summary</Text>
              <View className="bg-white/10 p-4 rounded-2xl">
                <Text className="text-text-secondary leading-6 font-sans-regular">
                  {stripHtmlTags(series.summary)}
                </Text>
              </View>
            </View>
          )}

          <EpisodesList seriesId={seriesId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}