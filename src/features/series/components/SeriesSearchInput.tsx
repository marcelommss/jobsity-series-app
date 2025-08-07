import { TextInput, View, TouchableOpacity, Text } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { SearchIcon } from 'lucide-react-native';
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
  onDebouncedChange,
}: SeriesSearchInputProps) {
  const isFirstRender = useRef(true);
  const lastValue = useRef(value);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedCallback = useRef(
    debounce((text: string) => {
      onDebouncedChange(text);
    }, SEARCH_DEBOUNCE_DELAY)
  ).current;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastValue.current = value;
      return;
    }

    if (lastValue.current !== value) {
      lastValue.current = value;
      debouncedCallback(value);
    }
  }, [value, debouncedCallback]);

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View className="px-4 py-3 bg-dark">
      <View className="relative">
        <View className="absolute left-4 top-4 z-10">
          <SearchIcon size={20} color="#94A3B8" />
        </View>
        <TextInput
          className="bg-surface-elevated text-text-primary px-12 py-4 rounded-2xl font-sans-regular text-base  tracking-normal"
          placeholder="Search TV series..."
          placeholderTextColor="#64748B"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor="#10F5D4"
          underlineColorAndroid="transparent"
          keyboardType="web-search"
          returnKeyType="search"
          autoCapitalize="words"
          autoCorrect={false}
          key="series-search"
        />

        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            className="absolute right-4 top-4 z-10"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View className="w-5 h-5 bg-text-muted rounded-full items-center justify-center">
              <Text className="text-dark text-xs font-bold">×</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {isFocused && !value && (
        <View className="mt-2 px-2">
          <Text className="text-text-muted text-sm">
            Try searching for "Breaking Bad", "Game of Thrones", or any series
            name
          </Text>
        </View>
      )}
    </View>
  );
}
