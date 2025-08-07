import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Series, APIError } from '@/types';
import { fetchSeriesById, SeriesServiceError } from '@/services/seriesService';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { EpisodesList } from '@/features/episodes/components/EpisodesList';

export default function SeriesDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);

  const seriesId = Number(id);

  useEffect(() => {
    const fetchData = async () => {
      if (!seriesId) return;

      setLoading(true);
      setError(null);

      try {
        const seriesData = await fetchSeriesById(seriesId);
        setSeries(seriesData);
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
      <SafeAreaView className="flex-1 bg-background">
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
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Image */}
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
          <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
            <Text className="text-white text-2xl font-sans-bold">{series.name}</Text>
          </View>
        </View>

        {/* Series Details */}
        <View className="p-4">
          {/* Genres */}
          {series.genres && series.genres.length > 0 && (
            <View className="mb-4">
              <Text className="text-lg font-sans-semibold text-black-700 mb-2">Genres</Text>
              <View className="flex-row flex-wrap">
                {series.genres.map((genre, index) => (
                  <View key={index} className="bg-lime-500 px-3 py-1 rounded-full mr-2 mb-2">
                    <Text className="text-black-700 font-sans-medium text-sm">{genre}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Air Days & Time */}
          {series.schedule && (series.schedule.days.length > 0 || series.schedule.time) && (
            <View className="mb-4">
              <Text className="text-lg font-sans-semibold text-black-700 mb-2">Schedule</Text>
              <Text className="text-gray-600 font-sans-regular">
                {series.schedule.days.length > 0 ? `${series.schedule.days.join(', ')}` : 'No air days'}
                {series.schedule.time && ` at ${series.schedule.time}`}
              </Text>
            </View>
          )}

          {/* Additional Info */}
          <View className="flex-row justify-between mb-4">
            {series.rating?.average && (
              <View>
                <Text className="text-sm font-sans-semibold text-black-700">Rating</Text>
                <Text className="text-gray-600">{series.rating.average}/10</Text>
              </View>
            )}
            {series.status && (
              <View>
                <Text className="text-sm font-sans-semibold text-black-700">Status</Text>
                <Text className="text-gray-600">{series.status}</Text>
              </View>
            )}
            {series.network && (
              <View>
                <Text className="text-sm font-sans-semibold text-black-700">Network</Text>
                <Text className="text-gray-600">{series.network.name}</Text>
              </View>
            )}
          </View>

          {/* Summary */}
          {series.summary && (
            <View className="mb-6">
              <Text className="text-lg font-sans-semibold text-black-700 mb-2">Summary</Text>
              <Text className="text-gray-700 leading-6 font-sans-regular">
                {stripHtmlTags(series.summary)}
              </Text>
            </View>
          )}

          {/* Episodes */}
          <EpisodesList seriesId={seriesId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}