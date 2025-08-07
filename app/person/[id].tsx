import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'lucide-react-native';
import { usePersonDetails } from '@/features/people/hooks/usePersonDetails';
import { SeriesCredit } from '@/features/people/components/SeriesCredit';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function PersonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const personId = Number(id);
  
  const { person, castCredits, loading, error, retryFetch } = usePersonDetails(personId);

  const handleBack = () => {
    router.back();
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

  const calculateAge = (birthday?: string, deathday?: string) => {
    if (!birthday) return null;
    
    try {
      const birthDate = new Date(birthday);
      const endDate = deathday ? new Date(deathday) : new Date();
      const age = endDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = endDate.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
        return age - 1;
      }
      
      return age;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-dark">
        <ActivityIndicator size="large" color="#10F5D4" />
        <Text className="text-text-secondary mt-2">Loading person details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-dark">
        <View className="p-4">
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 bg-surface-elevated rounded-full items-center justify-center mb-4"
            activeOpacity={0.8}
          >
            <ArrowLeftIcon size={20} color="white" />
          </TouchableOpacity>
          <ErrorMessage error={error} onRetry={retryFetch} />
        </View>
      </SafeAreaView>
    );
  }

  if (!person) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-dark">
        <Text className="text-text-primary text-lg">Person not found</Text>
        <TouchableOpacity
          onPress={handleBack}
          className="mt-4 px-4 py-2 bg-accent-primary rounded-xl"
        >
          <Text className="text-dark font-sans-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="relative mb-4">
          {person.image?.original ? (
            <Image
              source={{ uri: person.image.original }}
              className="w-full h-80 rounded-2xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-80 bg-surface-elevated rounded-2xl justify-center items-center">
              <Text className="text-6xl mb-2">👤</Text>
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

        <Text className="text-3xl font-sans-bold text-aqua mb-4">{person.name}</Text>

        <View className="space-y-4">
          {person.gender && (
            <View className="mb-4">
              <Text className="text-lg font-sans-semibold text-text-primary mb-1">Gender</Text>
              <View className="bg-white/10 p-3 rounded-xl">
                <Text className="text-text-secondary font-sans-regular">{person.gender}</Text>
              </View>
            </View>
          )}

          {person.country && (
            <View className="mb-4">
              <Text className="text-lg font-sans-semibold text-text-primary mb-1">Country</Text>
              <View className="bg-white/10 p-3 rounded-xl">
                <Text className="text-text-secondary font-sans-regular">📍 {person.country.name}</Text>
              </View>
            </View>
          )}

          {person.birthday && (
            <View className="mb-4">
              <Text className="text-lg font-sans-semibold text-text-primary mb-1">Born</Text>
              <View className="bg-white/10 p-3 rounded-xl">
                <Text className="text-text-secondary font-sans-regular">
                  {formatDate(person.birthday)}
                  {calculateAge(person.birthday, person.deathday) && 
                    ` (${calculateAge(person.birthday, person.deathday)} years${person.deathday ? ' at death' : ' old'})`
                  }
                </Text>
              </View>
            </View>
          )}

          {person.deathday && (
            <View className="mb-4">
              <Text className="text-lg font-sans-semibold text-text-primary mb-1">Died</Text>
              <View className="bg-white/10 p-3 rounded-xl">
                <Text className="text-text-secondary font-sans-regular">
                  {formatDate(person.deathday)}
                </Text>
              </View>
            </View>
          )}

          {/* Series Credits Section */}
          {castCredits.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-sans-semibold text-text-primary mb-4">
                Known For ({castCredits.length} series)
              </Text>
              {castCredits.map((credit, index) => (
                <SeriesCredit key={index} credit={credit} />
              ))}
            </View>
          )}

          <View className="mb-6">
            <Text className="text-lg font-sans-semibold text-text-primary mb-2">About</Text>
            <View className="bg-white/10 p-4 rounded-2xl">
              <Text className="text-text-secondary leading-6 font-sans-regular">
                {person.name} is a{person.gender ? ` ${person.gender.toLowerCase()}` : ''} actor/actress
                {person.country ? ` from ${person.country.name}` : ''}
                {person.birthday ? `, born on ${formatDate(person.birthday)}` : ''}.
                {person.deathday ? ` They passed away on ${formatDate(person.deathday)}.` : ''}
                {castCredits.length > 0 && ` They have appeared in ${castCredits.length} TV series.`}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}