import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { CastCredit } from '@/types';

interface SeriesCreditProps {
  credit: CastCredit;
}

export const SeriesCredit = ({ credit }: SeriesCreditProps) => {
  const handlePress = () => {
    // Extract series ID from the href URL
    const seriesId = credit._links.show.href.split('/').pop();
    if (seriesId) {
      router.push(`/series/${seriesId}`);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="bg-surface-elevated p-4 rounded-xl mb-3"
      activeOpacity={0.8}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-lg font-sans-semibold text-aqua mb-1" numberOfLines={2}>
            {credit._links.show.name}
          </Text>
          <Text className="text-sm text-text-muted font-sans-regular">
            as {credit._links.character.name}
          </Text>
          {credit.voice && (
            <Text className="text-xs text-accent-primary font-sans-medium mt-1">
              Voice Actor
            </Text>
          )}
        </View>
        <View className="ml-3">
          <Text className="text-text-muted text-lg">›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};