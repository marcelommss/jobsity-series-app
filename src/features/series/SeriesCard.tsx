import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Series } from '@/types';
import React from 'react';

interface SeriesCardProps {
  series: Series;
}

export const SeriesCard = ({ series }: SeriesCardProps) => {
  const handlePress = () => {
    router.push(`/series/${series.id}`);
  };

  const formatYear = (premiered: string) => {
    return premiered ? new Date(premiered).getFullYear().toString() : '';
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={{
        flexDirection: 'row',
        gap: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16,
        marginHorizontal: 16,
      }}
      activeOpacity={0.95}
    >
      {/* Series Image */}
      <View style={{ 
        width: 100, 
        height: 140, 
        borderRadius: 12, 
        overflow: 'hidden',
        backgroundColor: '#F3F4F6'
      }}>
        {series.image?.medium ? (
          <Image
            source={{ uri: series.image.medium }}
            alt={series.name}
            style={{ 
              width: '100%', 
              height: '100%',
            }}
            resizeMode="cover"
          />
        ) : (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E5E7EB'
          }}>
            <Text style={{
              fontSize: 12,
              color: '#9CA3AF',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              📺{'\n'}No Image
            </Text>
          </View>
        )}
      </View>

      {/* Series Info */}
      <View style={{ flex: 1, paddingVertical: 4 }}>
        {/* Title and Year */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
          <Text 
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#18181B',
              flex: 1,
              lineHeight: 24,
            }}
            numberOfLines={2}
          >
            {series.name}
          </Text>
          {series.premiered && (
            <View style={{
              backgroundColor: '#F3F4F6',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              marginLeft: 8,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: '#71717A',
              }}>
                {formatYear(series.premiered)}
              </Text>
            </View>
          )}
        </View>

        {/* Genres */}
        {series.genres && series.genres.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <Text style={{
              fontSize: 14,
              color: '#64748B',
              fontWeight: '500',
              lineHeight: 20,
            }}>
              {series.genres.slice(0, 3).join(' • ')}
            </Text>
          </View>
        )}

        {/* Rating and Status */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto'
        }}>
          {series.rating?.average && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FEF3C7',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <Text style={{ fontSize: 12, marginRight: 2 }}>⭐</Text>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: '#92400E',
              }}>
                {series.rating.average.toFixed(1)}
              </Text>
            </View>
          )}
          
          {series.status && (
            <View style={{
              backgroundColor: series.status === 'Ended' ? '#FEE2E2' : '#D1FAE5',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <Text style={{
                fontSize: 11,
                fontWeight: '600',
                color: series.status === 'Ended' ? '#B91C1C' : '#065F46',
              }}>
                {series.status}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
