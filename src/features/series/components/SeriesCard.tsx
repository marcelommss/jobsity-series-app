import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Series } from '@/types';

interface SeriesCardProps {
  series: Series;
}

const SeriesCard = ({ series }: SeriesCardProps) => {
  const { id, name, image, premiered, genres, rating, status } = series;
  
  const handlePress = () => {
    router.push(`/series/${id}`);
  };

  const formatYear = (premiered: string) => {
    return premiered ? new Date(premiered).getFullYear().toString() : '';
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row gap-4 p-4 bg-surface rounded-2xl shadow-lg mb-4 mx-4 max-h-40"
      activeOpacity={0.95}
    >
      <View className="w-20 h-28 rounded-xl overflow-hidden bg-surface-elevated">
        {image?.medium ? (
          <Image
            source={{ uri: image.medium }}
            alt={name}
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
            {name}
          </Text>
          {premiered && (
            <View className="bg-surface-elevated px-2 py-1 rounded-lg ml-2">
              <Text className="text-xs font-sans-semibold text-text-secondary">
                {formatYear(premiered)}
              </Text>
            </View>
          )}
        </View>

        {genres && genres.length > 0 && (
          <View className="mb-2">
            <Text className="text-sm text-text-muted font-sans-medium leading-5">
              {genres.slice(0, 3).join(' • ')}
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-between mt-auto">
          {rating?.average && (
            <View className="flex-row items-center bg-surface-elevated px-2.5 py-1.5 rounded-xl border border-accent-primary/20">
              <View className="w-3 h-3 mr-1.5 items-center justify-center">
                <Text className="text-accent-primary text-xs leading-none">★</Text>
              </View>
              <Text className="text-xs font-sans-semibold text-accent-primary">
                {rating.average.toFixed(1)}
              </Text>
            </View>
          )}

          {status && (
            <View
              className={`px-2.5 py-1.5 rounded-xl border ${
                status === 'Ended'
                  ? 'bg-surface-elevated border-support-error/30'
                  : status === 'Running'
                  ? 'bg-surface-elevated border-support-success/30'
                  : 'bg-surface-elevated border-text-muted/20'
              }`}
            >
              <Text
                className={`text-xs font-sans-semibold ${
                  status === 'Ended'
                    ? 'text-support-error'
                    : status === 'Running'
                    ? 'text-support-success'
                    : 'text-text-muted'
                }`}
              >
                {status}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SeriesCard;
