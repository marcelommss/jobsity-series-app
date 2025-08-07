import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Episode } from '@/types';
import { useEpisodes } from '../hooks/useEpisodes';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

interface EpisodesListProps {
  seriesId: number;
}

export function EpisodesList({ seriesId }: EpisodesListProps) {
  const { episodes, loading, error, refreshEpisodes } = useEpisodes(seriesId);

  const handleEpisodePress = (episode: Episode) => {
    router.push({
      pathname: '/episode/[id]',
      params: {
        id: episode.id.toString(),
        name: episode.name,
        season: episode.season.toString(),
        number: episode.number.toString(),
        summary: episode.summary || '',
        image: episode.image?.medium || '',
        airdate: episode.airdate || '',
        runtime: episode.runtime?.toString() || '',
      },
    });
  };

  if (loading) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-sans-semibold text-text-primary mb-4">Episodes</Text>
        <ActivityIndicator className="my-4" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-sans-semibold text-text-primary mb-4">Episodes</Text>
        <ErrorMessage error={error} onRetry={refreshEpisodes} />
      </View>
    );
  }

  if (episodes.length === 0) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-sans-semibold text-text-primary mb-4">Episodes</Text>
        <Text className="text-text-muted italic">No episodes available.</Text>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <Text className="text-lg font-sans-semibold text-text-primary mb-4">Episodes</Text>
      
      {episodes.map((seasonData) => (
        <View key={seasonData.season} className="mb-6">
          <Text className="text-md font-sans-semibold text-text-primary mb-3">
            Season {seasonData.season} ({seasonData.episodes.length} episodes)
          </Text>
          
          {seasonData.episodes.map((episode) => (
            <TouchableOpacity
              key={episode.id}
              onPress={() => handleEpisodePress(episode)}
              className="flex-row bg-surface rounded-2xl shadow-lg mb-3 p-4"
            >
              <View className="w-16 h-12 mr-3">
                {episode.image?.medium ? (
                  <Image
                    source={{ uri: episode.image.medium }}
                    className="w-full h-full rounded"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full rounded bg-surface-elevated justify-center items-center">
                    <Text className="text-xs text-text-muted">No Image</Text>
                  </View>
                )}
              </View>

              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="text-sm font-sans-semibold text-text-secondary mr-2">
                    S{seasonData.season}E{episode.number}
                  </Text>
                  <Text className="text-sm font-sans-medium text-aqua flex-1" numberOfLines={1}>
                    {episode.name}
                  </Text>
                </View>
                
                {episode.airdate && (
                  <Text className="text-xs text-text-muted mb-1">
                    {new Date(episode.airdate).toLocaleDateString()}
                  </Text>
                )}
                
                {episode.summary && (
                  <Text className="text-xs text-text-muted" numberOfLines={2}>
                    {episode.summary.replace(/<[^>]*>/g, '')}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}