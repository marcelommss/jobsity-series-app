import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'lucide-react-native';
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

  const handleBack = () => {
    router.back();
  };

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
    <SafeAreaView className="flex-1 bg-dark">
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="relative mb-4">
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-full h-60 rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-60 bg-gray-300 rounded-lg justify-center items-center">
              <Text className="text-text-muted">No Image Available</Text>
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
        </View>

        <Text className="text-2xl font-sans-bold text-text-primary mb-2">{name}</Text>

        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-sm font-sans-semibold text-text-primary">Season</Text>
            <Text className="text-text-secondary text-lg">{season}</Text>
          </View>
          <View>
            <Text className="text-sm font-sans-semibold text-text-primary">Episode</Text>
            <Text className="text-text-secondary text-lg">{number}</Text>
          </View>
          {runtime && (
            <View>
              <Text className="text-sm font-sans-semibold text-text-primary">Runtime</Text>
              <Text className="text-text-secondary text-lg">{runtime} min</Text>
            </View>
          )}
        </View>

        {airdate && (
          <View className="mb-4">
            <Text className="text-lg font-sans-semibold text-text-primary mb-1">Air Date</Text>
            <Text className="text-text-secondary font-sans-regular">{formatDate(airdate)}</Text>
          </View>
        )}

        {summary && (
          <View className="mb-6">
            <Text className="text-lg font-sans-semibold text-text-primary mb-2">Summary</Text>
            <View className="bg-white/10 p-4 rounded-2xl">
              <Text className="text-text-secondary leading-6 font-sans-regular">
                {stripHtmlTags(summary)}
              </Text>
            </View>
          </View>
        )}

        {!summary && (
          <View className="mb-6">
            <Text className="text-text-muted italic">No summary available for this episode.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}