import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Person } from '@/types';
import React from 'react';

interface PersonCardProps {
  person: Person;
}

export const PersonCard = ({ person }: PersonCardProps) => {
  const handlePress = () => {
    router.push({
      pathname: '/person/[id]',
      params: {
        id: person.id.toString(),
        name: person.name,
        image: person.image?.medium || '',
        country: person.country?.name || '',
        birthday: person.birthday || '',
        deathday: person.deathday || '',
        gender: person.gender || '',
      },
    });
  };

  const formatAge = () => {
    if (!person.birthday) return null;
    
    try {
      const birthDate = new Date(person.birthday);
      const endDate = person.deathday ? new Date(person.deathday) : new Date();
      let age = endDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = endDate.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
        age = age - 1;
      }
      
      if (person.deathday) {
        return `${age} (${birthDate.getFullYear()}-${endDate.getFullYear()})`;
      }
      
      return `${age} years old`;
    } catch {
      return null;
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="flex-row gap-4 p-4 bg-surface rounded-2xl shadow-lg mb-4 mx-4 max-h-36"
      activeOpacity={0.95}
    >
      <View className="w-20 h-28 rounded-xl overflow-hidden bg-surface-elevated">
        {person.image?.medium ? (
          <Image
            source={{ uri: person.image.medium }}
            style={{ 
              width: '100%', 
              height: '100%',
            }}
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center bg-surface-overlay">
            <Text className="text-xs text-text-muted text-center font-sans-medium">
              👤{'\n'}No Image
            </Text>
          </View>
        )}
      </View>

      <View className="flex-1 py-1">
        <View className="flex-row items-start mb-2">
          <Text 
            className="text-lg font-sans-bold text-aqua flex-1 leading-6"
            numberOfLines={2}
          >
            {person.name}
          </Text>
        </View>

        {person.country && (
          <View className="mb-2">
            <Text className="text-sm text-text-muted font-sans-medium leading-5">
              📍 {person.country.name}
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-between mt-auto">
          {formatAge() && (
            <View className="bg-surface-elevated px-2 py-1 rounded-xl">
              <Text className="text-xs font-sans-semibold text-text-secondary">
                {formatAge()}
              </Text>
            </View>
          )}
          
          {person.gender && (
            <View className="bg-surface-elevated px-2 py-1 rounded-xl">
              <Text className="text-xs font-sans-semibold text-text-secondary">
                {person.gender}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};