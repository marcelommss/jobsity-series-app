import { FlatList, ActivityIndicator } from 'react-native';
import { Series } from '@/types';
import { SeriesCard } from '../SeriesCard';
import { PAGINATION_THRESHOLD } from '@/shared/constants';

interface SeriesListProps {
  data: Series[];
  loading: boolean;
  hasMore: boolean;
  onEndReached: () => void;
}

export function SeriesList({ data, loading, hasMore, onEndReached }: SeriesListProps) {
  return (
    <FlatList
      className="px-4 bg-background"
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <SeriesCard series={item} />}
      onEndReached={hasMore ? onEndReached : undefined}
      onEndReachedThreshold={PAGINATION_THRESHOLD}
      ListFooterComponent={
        loading ? <ActivityIndicator className="my-4" /> : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
}