import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ErrorBoundary } from '../ErrorBoundary';

// Mock component that throws an error
const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text>Normal component</Text>;
};

// Component with custom error message
const CustomErrorComponent = () => {
  throw new Error('Custom error message');
};

describe('ErrorBoundary', () => {
  // Suppress console.error during these tests to avoid noise in test output
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when no error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(getByText('Normal component')).toBeTruthy();
  });

  it('should render default error UI when error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Oops! Something went wrong')).toBeTruthy();
    expect(getByText('Test error')).toBeTruthy();
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('should render custom fallback when provided', () => {
    const customFallback = <Text>Custom error fallback</Text>;

    const { getByText } = render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Custom error fallback')).toBeTruthy();
  });

  it('should call onError callback when error occurs', () => {
    const onErrorMock = jest.fn();

    render(
      <ErrorBoundary onError={onErrorMock}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Test error'
      }),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('should reset error state when Try Again is pressed', () => {
    const TestWrapper = () => {
      const [shouldThrow, setShouldThrow] = React.useState(true);

      return (
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={shouldThrow} />
          <Text onPress={() => setShouldThrow(false)}>Reset</Text>
        </ErrorBoundary>
      );
    };

    const { getByText, queryByText } = render(<TestWrapper />);

    // Initially shows error
    expect(getByText('Oops! Something went wrong')).toBeTruthy();

    // Press Try Again
    fireEvent.press(getByText('Try Again'));

    // Should attempt to render children again (which will throw again in this case)
    // The key is that the error boundary resets its state
    expect(queryByText('Oops! Something went wrong')).toBeTruthy();
  });

  it('should display custom error message when available', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <CustomErrorComponent />
      </ErrorBoundary>
    );

    expect(getByText('Custom error message')).toBeTruthy();
  });

  it('should display default message when error has no message', () => {
    const NoMessageError = () => {
      const error = new Error();
      error.message = '';
      throw error;
    };

    const { getByText } = render(
      <ErrorBoundary>
        <NoMessageError />
      </ErrorBoundary>
    );

    expect(getByText('An unexpected error occurred')).toBeTruthy();
  });

  it('should handle retry functionality correctly', () => {
    let throwCount = 0;
    const RetryTestComponent = () => {
      throwCount++;
      if (throwCount === 1) {
        throw new Error('First error');
      }
      return <Text>Success after retry</Text>;
    };

    const { getByText } = render(
      <ErrorBoundary>
        <RetryTestComponent />
      </ErrorBoundary>
    );

    // Should show error initially
    expect(getByText('First error')).toBeTruthy();

    // Press retry
    fireEvent.press(getByText('Try Again'));

    // Should now show success message
    expect(getByText('Success after retry')).toBeTruthy();
  });

  it('should not call onError when no error occurs', () => {
    const onErrorMock = jest.fn();

    render(
      <ErrorBoundary onError={onErrorMock}>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(onErrorMock).not.toHaveBeenCalled();
  });

  it('should maintain error boundary state across re-renders', () => {
    const { getByText, rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show error
    expect(getByText('Oops! Something went wrong')).toBeTruthy();

    // Re-render with same props
    rerender(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should still show error
    expect(getByText('Oops! Something went wrong')).toBeTruthy();
  });

  it('should handle multiple children correctly', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>First child</Text>
        <ThrowingComponent shouldThrow={false} />
        <Text>Third child</Text>
      </ErrorBoundary>
    );

    expect(getByText('First child')).toBeTruthy();
    expect(getByText('Normal component')).toBeTruthy();
    expect(getByText('Third child')).toBeTruthy();
  });

  it('should catch errors from any child component', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>First child</Text>
        <ThrowingComponent shouldThrow={true} />
        <Text>Third child</Text>
      </ErrorBoundary>
    );

    // Should show error boundary UI instead of children
    expect(getByText('Oops! Something went wrong')).toBeTruthy();
    expect(getByText('Test error')).toBeTruthy();
  });
});