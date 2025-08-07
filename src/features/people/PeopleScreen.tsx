import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SearchIcon } from 'lucide-react-native';
import PersonCard from './components/PersonCard';
import ErrorMessage from '@/shared/components/ErrorMessage';
import { usePeopleSearch } from './hooks/usePeopleSearch';

export function PeopleScreen() {
  const {
    searchQuery,
    setSearchQuery,
    people,
    loading,
    error,
    hasSearched,
    retrySearch,
  } = usePeopleSearch();

  return (
    <ScrollView className="flex-1 bg-dark" showsVerticalScrollIndicator={false}>
      <View className="p-4 pt-6">
        <View className="mb-6">
          <Text className="text-3xl font-sans-bold text-text-primary mb-2">
            People
          </Text>
          <Text className="text-text-muted font-sans-regular">
            Search for actors, directors, and other people in TV shows
          </Text>
        </View>

        <View className="relative mb-6">
          <View className="absolute left-4 top-4 z-10">
            <SearchIcon size={20} color="#94A3B8" />
          </View>
          <TextInput
            className="bg-surface-elevated text-text-primary px-12 py-4 rounded-2xl font-sans-regular text-base"
            placeholder="Search for people..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="words"
            autoCorrect={false}
            key="people-search"
          />
        </View>

        {loading && (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#10F5D4" />
            <Text className="text-text-secondary mt-2">
              Searching people...
            </Text>
          </View>
        )}

        {error && !loading && (
          <View className="mb-4">
            <ErrorMessage error={error} onRetry={retrySearch} />
          </View>
        )}

        {!hasSearched && !loading && searchQuery.trim() === '' && (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-6xl mb-4">🎭</Text>
            <Text className="text-xl font-sans-semibold text-text-primary mb-2 text-center">
              Search for People
            </Text>
            <Text className="text-text-muted text-center font-sans-regular leading-6 px-8">
              Find information about actors, directors, writers, and other
              people involved in TV shows.
            </Text>
          </View>
        )}

        {hasSearched &&
          people.length === 0 &&
          !loading &&
          !error &&
          searchQuery.trim() !== '' && (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-6xl mb-4">😔</Text>
              <Text className="text-xl font-sans-semibold text-text-primary mb-2 text-center">
                No People Found
              </Text>
              <Text className="text-text-muted text-center font-sans-regular leading-6 px-8">
                Try searching with a different name or check your spelling.
              </Text>
            </View>
          )}

        {people.length > 0 && !loading && (
          <View>
            <Text className="text-lg font-sans-semibold text-text-primary mb-4">
              {people.length} result{people.length !== 1 ? 's' : ''} found
            </Text>
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
