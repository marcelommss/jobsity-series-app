import { View } from 'react-native';
import { useSeriesData } from './hooks/useSeriesData';
import { SeriesSearchInput } from './components/SeriesSearchInput';
import { SeriesList } from './components/SeriesList';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export function HomeScreen() {
  const {
    series,
    loading,
    error,
    hasMore,
    searchTerm,
    setSearchTerm,
    setDebouncedSearchTerm,
    loadMoreSeries,
    refreshSeries,
  } = useSeriesData();

  if (error) {
    return (
      <View className="flex-1 bg-dark">
        <ErrorMessage error={error} onRetry={refreshSeries} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark">
      <SeriesSearchInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        onDebouncedChange={setDebouncedSearchTerm}
      />
      <SeriesList
        data={series}
        loading={loading}
        hasMore={hasMore}
        onEndReached={loadMoreSeries}
      />
    </View>
  );
}
