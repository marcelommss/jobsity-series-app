import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Series } from '@/types';
import React from 'react';

interface SeriesCardProps {
  series: Series;
}

export const SeriesCard = ({ series }: SeriesCardProps) => {
  const handlePress = () => {
    router.push(`/series/${series.id}`);
  };

  const formatYear = (premiered: string) => {
    return premiered ? new Date(premiered).getFullYear().toString() : '';
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="flex-row gap-4 p-4 bg-surface rounded-2xl shadow-lg mb-4 mx-4 max-h-36"
      activeOpacity={0.95}
    >
      <View className="w-20 h-28 rounded-xl overflow-hidden bg-surface-elevated">
        {series.image?.medium ? (
          <Image
            source={{ uri: series.image.medium }}
            alt={series.name}
            style={{ 
              width: '100%', 
              height: '100%',
            }}
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center bg-surface-overlay">
            <Text className="text-xs text-text-muted text-center font-sans-medium">
              📺{'\n'}No Image
            </Text>
          </View>
        )}
      </View>

      <View className="flex-1 py-1">
        <View className="flex-row items-start mb-2">
          <Text 
            className="text-lg font-sans-bold text-text-primary flex-1 leading-6"
            numberOfLines={2}
          >
            {series.name}
          </Text>
          {series.premiered && (
            <View className="bg-surface-elevated px-2 py-1 rounded-lg ml-2">
              <Text className="text-xs font-sans-semibold text-text-secondary">
                {formatYear(series.premiered)}
              </Text>
            </View>
          )}
        </View>

        {series.genres && series.genres.length > 0 && (
          <View className="mb-2">
            <Text className="text-sm text-text-muted font-sans-medium leading-5">
              {series.genres.slice(0, 3).join(' • ')}
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-between mt-auto">
          {series.rating?.average && (
            <View className="flex-row items-center bg-aqua-100 px-2 py-1 rounded-xl">
              <Text className="text-xs mr-1">⭐</Text>
              <Text className="text-xs font-sans-semibold text-aqua-800">
                {series.rating.average.toFixed(1)}
              </Text>
            </View>
          )}
          
          {series.status && (
            <View className={`px-2 py-1 rounded-xl ${
              series.status === 'Ended' ? 'bg-support-error/20' : 'bg-emerald-200'
            }`}>
              <Text className={`text-xs font-sans-semibold ${
                series.status === 'Ended' ? 'text-support-error' : 'text-emerald-800'
              }`}>
                {series.status}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
