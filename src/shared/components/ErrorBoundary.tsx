import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 justify-center items-center px-4 bg-background">
          <Text className="text-center text-red-500 text-xl font-sans-bold mb-4">
            Oops! Something went wrong
          </Text>
          <Text className="text-center text-gray-600 text-base mb-6">
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity
            onPress={this.handleRetry}
            className="bg-blue px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-sans-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
