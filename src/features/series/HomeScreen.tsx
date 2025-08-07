import { SafeAreaView } from 'react-native-safe-area-context';
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
      <SafeAreaView className="flex-1 bg-background">
        <ErrorMessage error={error} onRetry={refreshSeries} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
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
    </SafeAreaView>
  );
}
