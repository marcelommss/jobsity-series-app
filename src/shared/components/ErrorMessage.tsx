import { Text, View, TouchableOpacity } from 'react-native';
import { APIError } from '@/types';

interface ErrorMessageProps {
  error: APIError;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <View className="flex-1 justify-center items-center px-4 bg-dark">
      <Text className="text-center text-support-error text-lg font-sans-medium mb-4">
        Something went wrong
      </Text>
      <Text className="text-center text-text-secondary text-base mb-6">
        {error.message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-accent-primary px-6 py-3 rounded-lg"
        >
          <Text className="text-dark font-sans-semibold">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}