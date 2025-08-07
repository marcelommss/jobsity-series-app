import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Person } from '@/types';

interface PersonCardProps {
  person: Person;
}

const PersonCard = ({ person }: PersonCardProps) => {
  const { id, name, image, country, birthday, deathday, gender } = person;

  const handlePress = () => {
    router.push({
      pathname: '/person/[id]',
      params: {
        id: id.toString(),
        name,
        image: image?.medium || '',
        country: country?.name || '',
        birthday: birthday || '',
        deathday: deathday || '',
        gender: gender || '',
      },
    });
  };

  const formatAge = () => {
    if (!birthday) return null;

    try {
      const birthDate = new Date(birthday);
      const endDate = deathday ? new Date(deathday) : new Date();
      let age = endDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = endDate.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && endDate.getDate() < birthDate.getDate())
      ) {
        age = age - 1;
      }

      if (deathday) {
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
        {image?.medium ? (
          <Image
            source={{ uri: image.medium }}
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
            {name}
          </Text>
        </View>

        {country && (
          <View className="mb-2">
            <Text className="text-sm text-text-muted font-sans-medium leading-5">
              📍 {country.name}
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

          {gender && (
            <View className="bg-surface-elevated px-2 py-1 rounded-xl">
              <Text className="text-xs font-sans-semibold text-text-secondary">
                {gender}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default PersonCard;
