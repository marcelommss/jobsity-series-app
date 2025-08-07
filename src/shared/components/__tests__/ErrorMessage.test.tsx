import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorMessage from '../ErrorMessage';
import { APIError } from '@/types';

describe('ErrorMessage', () => {
  const mockError: APIError = {
    message: 'Something went wrong',
    status: 500
  };

  it('should render error message correctly', () => {
    const { getByText, getAllByText } = render(<ErrorMessage error={mockError} />);

    expect(getAllByText('Something went wrong')).toHaveLength(2);
  });

  it('should render retry button when onRetry is provided', () => {
    const mockRetry = jest.fn();
    const { getByText } = render(
      <ErrorMessage error={mockError} onRetry={mockRetry} />
    );

    expect(getByText('Try Again')).toBeTruthy();
  });

  it('should not render retry button when onRetry is not provided', () => {
    const { queryByText } = render(<ErrorMessage error={mockError} />);

    expect(queryByText('Try Again')).toBeNull();
  });

  it('should call onRetry when retry button is pressed', () => {
    const mockRetry = jest.fn();
    const { getByText } = render(
      <ErrorMessage error={mockError} onRetry={mockRetry} />
    );

    fireEvent.press(getByText('Try Again'));
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should render error without status code', () => {
    const errorWithoutStatus: APIError = {
      message: 'Network error'
    };

    const { getByText } = render(<ErrorMessage error={errorWithoutStatus} />);

    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Network error')).toBeTruthy();
  });

  it('should handle long error messages', () => {
    const longError: APIError = {
      message: 'This is a very long error message that should still be displayed correctly in the component without causing any layout issues or breaking the UI.'
    };

    const { getByText } = render(<ErrorMessage error={longError} />);

    expect(getByText(longError.message)).toBeTruthy();
  });
});