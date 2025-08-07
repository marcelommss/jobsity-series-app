import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SeriesSearchInput } from '../SeriesSearchInput';

jest.mock('@/shared/utils', () => ({
  debounce: jest.fn((fn, delay) => {
    let timeoutId: any;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  })
}));

describe('SeriesSearchInput', () => {
  const mockOnChangeText = jest.fn();
  const mockOnDebouncedChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render input with placeholder', () => {
    const { getByPlaceholderText } = render(
      <SeriesSearchInput
        value=""
        onChangeText={mockOnChangeText}
        onDebouncedChange={mockOnDebouncedChange}
      />
    );

    expect(getByPlaceholderText('Search TV series...')).toBeTruthy();
  });

  it('should display current value', () => {
    const { getByDisplayValue } = render(
      <SeriesSearchInput
        value="Breaking Bad"
        onChangeText={mockOnChangeText}
        onDebouncedChange={mockOnDebouncedChange}
      />
    );

    expect(getByDisplayValue('Breaking Bad')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const { getByPlaceholderText } = render(
      <SeriesSearchInput
        value=""
        onChangeText={mockOnChangeText}
        onDebouncedChange={mockOnDebouncedChange}
      />
    );

    const input = getByPlaceholderText('Search TV series...');
    fireEvent.changeText(input, 'Game of Thrones');

    expect(mockOnChangeText).toHaveBeenCalledWith('Game of Thrones');
  });

  it('should show clear button when there is text', () => {
    const { getByText } = render(
      <SeriesSearchInput
        value="Test"
        onChangeText={mockOnChangeText}
        onDebouncedChange={mockOnDebouncedChange}
      />
    );

    expect(getByText('×')).toBeTruthy();
  });

  it('should not show clear button when text is empty', () => {
    const { queryByText } = render(
      <SeriesSearchInput
        value=""
        onChangeText={mockOnChangeText}
        onDebouncedChange={mockOnDebouncedChange}
      />
    );

    expect(queryByText('×')).toBeNull();
  });

  it('should clear text when clear button is pressed', () => {
    const { getByText } = render(
      <SeriesSearchInput
        value="Test"
        onChangeText={mockOnChangeText}
        onDebouncedChange={mockOnDebouncedChange}
      />
    );

    const clearButton = getByText('×');
    fireEvent.press(clearButton);

    expect(mockOnChangeText).toHaveBeenCalledWith('');
  });

  it('should show search hint when focused and empty', () => {
    const { getByPlaceholderText, getByText } = render(
      <SeriesSearchInput
        value=""
        onChangeText={mockOnChangeText}
        onDebouncedChange={mockOnDebouncedChange}
      />
    );

    const input = getByPlaceholderText('Search TV series...');
    fireEvent(input, 'focus');

    expect(getByText('Try searching for "Breaking Bad", "Game of Thrones", or any series name')).toBeTruthy();
  });

  it('should not show search hint when focused and has text', () => {
    const { getByDisplayValue, queryByText } = render(
      <SeriesSearchInput
        value="Test"
        onChangeText={mockOnChangeText}
        onDebouncedChange={mockOnDebouncedChange}
      />
    );

    const input = getByDisplayValue('Test');
    fireEvent(input, 'focus');

    expect(queryByText('Try searching for "Breaking Bad", "Game of Thrones", or any series name')).toBeNull();
  });

  it('should hide search hint when not focused', () => {
    const { getByPlaceholderText, queryByText } = render(
      <SeriesSearchInput
        value=""
        onChangeText={mockOnChangeText}
        onDebouncedChange={mockOnDebouncedChange}
      />
    );

    const input = getByPlaceholderText('Search TV series...');
    fireEvent(input, 'focus');
    fireEvent(input, 'blur');

    expect(queryByText('Try searching for "Breaking Bad", "Game of Thrones", or any series name')).toBeNull();
  });

  it('should render search icon', () => {
    const { getByText } = render(
      <SeriesSearchInput
        value=""
        onChangeText={mockOnChangeText}
        onDebouncedChange={mockOnDebouncedChange}
      />
    );

    expect(getByText('🔍')).toBeTruthy();
  });

  it('should handle focus and blur events', () => {
    const { getByPlaceholderText } = render(
      <SeriesSearchInput
        value=""
        onChangeText={mockOnChangeText}
        onDebouncedChange={mockOnDebouncedChange}
      />
    );

    const input = getByPlaceholderText('Search TV series...');
    
    fireEvent(input, 'focus');
    fireEvent(input, 'blur');
    
    expect(input).toBeTruthy();
  });

  it('should handle empty string input', () => {
    const { getByPlaceholderText } = render(
      <SeriesSearchInput
        value=""
        onChangeText={mockOnChangeText}
        onDebouncedChange={mockOnDebouncedChange}
      />
    );

    const input = getByPlaceholderText('Search TV series...');
    fireEvent.changeText(input, '');

    expect(mockOnChangeText).toHaveBeenCalledWith('');
  });

  it('should handle special characters in input', () => {
    const { getByPlaceholderText } = render(
      <SeriesSearchInput
        value=""
        onChangeText={mockOnChangeText}
        onDebouncedChange={mockOnDebouncedChange}
      />
    );

    const input = getByPlaceholderText('Search TV series...');
    const specialText = 'Game of Thrones & Dragons!@#$%';
    fireEvent.changeText(input, specialText);

    expect(mockOnChangeText).toHaveBeenCalledWith(specialText);
  });
});