import { TextInput, View, TouchableOpacity, Text } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { SEARCH_DEBOUNCE_DELAY } from '@/shared/constants';
import { debounce } from '@/shared/utils';

interface SeriesSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onDebouncedChange: (text: string) => void;
}

export function SeriesSearchInput({ 
  value, 
  onChangeText, 
  onDebouncedChange 
}: SeriesSearchInputProps) {
  const isFirstRender = useRef(true);
  const lastValue = useRef(value);
  const [isFocused, setIsFocused] = useState(false);
  
  // Create stable debounced function
  const debouncedCallback = useRef(
    debounce((text: string) => {
      onDebouncedChange(text);
    }, SEARCH_DEBOUNCE_DELAY)
  ).current;

  useEffect(() => {
    // Skip debounced callback on first render to prevent triggering with empty value
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastValue.current = value;
      return;
    }
    
    // Only call debounced callback if value actually changed
    if (lastValue.current !== value) {
      lastValue.current = value;
      debouncedCallback(value);
    }
  }, [value, debouncedCallback]);

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View className="px-4 py-3 bg-background">
      {/* Search Container */}
      <View className={`
        relative 
        bg-white 
        rounded-2xl 
        shadow-sm 
        border 
        ${isFocused ? 'border-lime-600' : 'border-gray-300'}
        transition-colors 
        duration-200
      `}>
        {/* Search Icon */}
        <View className="absolute left-4 top-1/2 transform -translate-y-2.5 z-10">
          <Text className="text-gray-500 text-lg">🔍</Text>
        </View>

        {/* Text Input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search TV series..."
          placeholderTextColor="#9CA3AF"
          selectionColor="#A2E635"
          underlineColorAndroid="transparent"
          keyboardType="web-search"
          returnKeyType="search"
          style={{
            height: 52,
            paddingLeft: 48,
            paddingRight: value ? 48 : 16,
            paddingVertical: 0,
            fontSize: 16,
            color: '#18181B',
            fontWeight: '400',
          }}
          className="text-black-700"
        />

        {/* Clear Button */}
        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-2.5 z-10"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View className="w-5 h-5 bg-gray-400 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">×</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Hint */}
      {isFocused && !value && (
        <View className="mt-2 px-2">
          <Text className="text-gray-500 text-sm">
            Try searching for "Breaking Bad", "Game of Thrones", or any series name
          </Text>
        </View>
      )}
    </View>
  );
}