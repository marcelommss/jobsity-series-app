import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Episode } from '@/types';
import { useEpisodes } from '../hooks/useEpisodes';
import ErrorMessage from '@/shared/components/ErrorMessage';

interface EpisodesListProps {
  seriesId: number;
}

const EpisodesList = ({ seriesId }: EpisodesListProps) => {
  const { episodes, loading, error, refreshEpisodes } = useEpisodes(seriesId);

  const handleEpisodePress = (episode: Episode) => {
    const { id, name, season, number, summary, image, airdate, runtime } =
      episode;
    router.push({
      pathname: '/episode/[id]',
      params: {
        id: id.toString(),
        name,
        season: season.toString(),
        number: number.toString(),
        summary: summary || '',
        image: image?.medium || '',
        airdate: airdate || '',
        runtime: runtime?.toString() || '',
      },
    });
  };

  if (loading) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-sans-semibold text-text-primary mb-4">
          Episodes
        </Text>
        <ActivityIndicator className="my-4" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-sans-semibold text-text-primary mb-4">
          Episodes
        </Text>
        <ErrorMessage error={error} onRetry={refreshEpisodes} />
      </View>
    );
  }

  if (episodes.length === 0) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-sans-semibold text-text-primary mb-4">
          Episodes
        </Text>
        <Text className="text-text-muted italic">No episodes available.</Text>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <Text className="text-lg font-sans-semibold text-text-primary mb-4">
        Episodes
      </Text>

      {episodes.map((seasonData) => {
        const { season, episodes: seasonEpisodes } = seasonData;
        return (
          <View key={season} className="mb-6">
            <Text className="text-md font-sans-semibold text-text-primary mb-3">
              Season {season} ({seasonEpisodes.length} episodes)
            </Text>

            {seasonEpisodes.map((episode) => {
              const { id, name, image, number, airdate, summary } = episode;
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => handleEpisodePress(episode)}
                  className="flex-row bg-surface rounded-2xl shadow-lg mb-3 p-4"
                >
                  <View className="w-16 h-12 mr-3">
                    {image?.medium ? (
                      <Image
                        source={{ uri: image.medium }}
                        className="w-full h-full rounded"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-full rounded bg-surface-elevated justify-center items-center">
                        <Text className="text-xs text-text-muted">
                          No Image
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-sm font-sans-semibold text-text-secondary mr-2">
                        S{season}E{number}
                      </Text>
                      <Text
                        className="text-sm font-sans-medium text-aqua flex-1"
                        numberOfLines={1}
                      >
                        {name}
                      </Text>
                    </View>

                    {airdate && (
                      <Text className="text-xs text-text-muted mb-1">
                        {new Date(airdate).toLocaleDateString()}
                      </Text>
                    )}

                    {summary && (
                      <Text
                        className="text-xs text-text-muted"
                        numberOfLines={2}
                      >
                        {summary.replace(/<[^>]*>/g, '')}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

export default EpisodesList;
