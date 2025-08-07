import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Episode, APIError } from '@/types';

export default function EpisodeDetailsScreen() {
  const { id, name, season, number, summary, image, airdate, runtime } = useLocalSearchParams<{
    id: string;
    name: string;
    season: string;
    number: string;
    summary?: string;
    image?: string;
    airdate?: string;
    runtime?: string;
  }>();

  const stripHtmlTags = (text: string) => {
    return text?.replace(/<[^>]*>/g, '') || '';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Episode Image */}
        {image ? (
          <Image
            source={{ uri: image }}
            className="w-full h-60 rounded-lg mb-4"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-60 bg-gray-300 rounded-lg justify-center items-center mb-4">
            <Text className="text-gray-600">No Image Available</Text>
          </View>
        )}

        {/* Episode Title */}
        <Text className="text-2xl font-sans-bold text-black-700 mb-2">{name}</Text>

        {/* Episode Info */}
        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-sm font-sans-semibold text-black-700">Season</Text>
            <Text className="text-gray-600 text-lg">{season}</Text>
          </View>
          <View>
            <Text className="text-sm font-sans-semibold text-black-700">Episode</Text>
            <Text className="text-gray-600 text-lg">{number}</Text>
          </View>
          {runtime && (
            <View>
              <Text className="text-sm font-sans-semibold text-black-700">Runtime</Text>
              <Text className="text-gray-600 text-lg">{runtime} min</Text>
            </View>
          )}
        </View>

        {/* Air Date */}
        {airdate && (
          <View className="mb-4">
            <Text className="text-lg font-sans-semibold text-black-700 mb-1">Air Date</Text>
            <Text className="text-gray-600 font-sans-regular">{formatDate(airdate)}</Text>
          </View>
        )}

        {/* Episode Summary */}
        {summary && (
          <View className="mb-6">
            <Text className="text-lg font-sans-semibold text-black-700 mb-2">Summary</Text>
            <Text className="text-gray-700 leading-6 font-sans-regular">
              {stripHtmlTags(summary)}
            </Text>
          </View>
        )}

        {!summary && (
          <View className="mb-6">
            <Text className="text-gray-500 italic">No summary available for this episode.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}