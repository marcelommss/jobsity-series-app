import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';

jest.mock('../hooks/useSeriesData', () => ({
  useSeriesData: jest.fn(),
}));

jest.mock('../components/SeriesSearchInput', () => ({
  SeriesSearchInput: ({ value, onChangeText, onDebouncedChange }: any) => {
    const React = require('react');
    const { View, TextInput } = require('react-native');
    return React.createElement(
      View,
      { testID: 'search-input' },
      React.createElement(TextInput, {
        testID: 'search-text-input',
        value: value,
        onChangeText: onChangeText,
        placeholder: 'Search TV series...'
      })
    );
  }
}));

jest.mock('../components/SeriesList', () => ({
  SeriesList: ({ data, loading, hasMore, onEndReached }: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(
      View,
      { testID: 'series-list' },
      React.createElement(Text, null, `Series count: ${data.length}`),
      loading && React.createElement(Text, { testID: 'loading' }, 'Loading...'),
      React.createElement(Text, { testID: 'has-more' }, `Has more: ${hasMore}`)
    );
  }
}));

jest.mock('@/shared/components/ErrorMessage', () => ({
  ErrorMessage: ({ error, onRetry }: any) => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return React.createElement(
      View,
      { testID: 'error-message' },
      React.createElement(Text, null, error.message),
      onRetry && React.createElement(
        TouchableOpacity,
        { onPress: onRetry, testID: 'retry-button' },
        React.createElement(Text, null, 'Try Again')
      )
    );
  }
}));

import { useSeriesData } from '../hooks/useSeriesData';

const mockUseSeriesData = useSeriesData as jest.MockedFunction<typeof useSeriesData>;

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    mockUseSeriesData.mockReturnValue({
      series: [],
      loading: true,
      error: null,
      hasMore: true,
      searchTerm: '',
      setSearchTerm: jest.fn(),
      setDebouncedSearchTerm: jest.fn(),
      loadMoreSeries: jest.fn(),
      refreshSeries: jest.fn(),
    });

    const { getByTestId } = render(<HomeScreen />);

    expect(getByTestId('search-input')).toBeTruthy();
    expect(getByTestId('series-list')).toBeTruthy();
    expect(getByTestId('loading')).toBeTruthy();
  });

  it('should render series data', () => {
    const mockSeries = [
      { id: 1, name: 'Breaking Bad', genres: ['Drama'], status: 'Ended' },
      { id: 2, name: 'Game of Thrones', genres: ['Fantasy'], status: 'Ended' }
    ];

    mockUseSeriesData.mockReturnValue({
      series: mockSeries,
      loading: false,
      error: null,
      hasMore: true,
      searchTerm: '',
      setSearchTerm: jest.fn(),
      setDebouncedSearchTerm: jest.fn(),
      loadMoreSeries: jest.fn(),
      refreshSeries: jest.fn(),
    });

    const { getByTestId, getByText } = render(<HomeScreen />);

    expect(getByTestId('search-input')).toBeTruthy();
    expect(getByTestId('series-list')).toBeTruthy();
    expect(getByText('Series count: 2')).toBeTruthy();
    expect(getByText('Has more: true')).toBeTruthy();
  });

  it('should render error state', () => {
    const mockError = { message: 'Network error', status: 500 };
    const mockRefresh = jest.fn();

    mockUseSeriesData.mockReturnValue({
      series: [],
      loading: false,
      error: mockError,
      hasMore: false,
      searchTerm: '',
      setSearchTerm: jest.fn(),
      setDebouncedSearchTerm: jest.fn(),
      loadMoreSeries: jest.fn(),
      refreshSeries: mockRefresh,
    });

    const { getByTestId, getByText } = render(<HomeScreen />);

    expect(getByTestId('error-message')).toBeTruthy();
    expect(getByText('Network error')).toBeTruthy();
    expect(getByTestId('retry-button')).toBeTruthy();
  });

  it('should render with search term', () => {
    mockUseSeriesData.mockReturnValue({
      series: [],
      loading: false,
      error: null,
      hasMore: false,
      searchTerm: 'Breaking Bad',
      setSearchTerm: jest.fn(),
      setDebouncedSearchTerm: jest.fn(),
      loadMoreSeries: jest.fn(),
      refreshSeries: jest.fn(),
    });

    const { getByTestId, getByDisplayValue } = render(<HomeScreen />);

    expect(getByTestId('search-input')).toBeTruthy();
    expect(getByDisplayValue('Breaking Bad')).toBeTruthy();
  });

  it('should render without hasMore', () => {
    mockUseSeriesData.mockReturnValue({
      series: [{ id: 1, name: 'Breaking Bad', genres: ['Drama'], status: 'Ended' }],
      loading: false,
      error: null,
      hasMore: false,
      searchTerm: '',
      setSearchTerm: jest.fn(),
      setDebouncedSearchTerm: jest.fn(),
      loadMoreSeries: jest.fn(),
      refreshSeries: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);

    expect(getByText('Has more: false')).toBeTruthy();
  });

  it('should pass correct props to SearchInput', () => {
    const mockSetSearchTerm = jest.fn();
    const mockSetDebouncedSearchTerm = jest.fn();

    mockUseSeriesData.mockReturnValue({
      series: [],
      loading: false,
      error: null,
      hasMore: true,
      searchTerm: 'test search',
      setSearchTerm: mockSetSearchTerm,
      setDebouncedSearchTerm: mockSetDebouncedSearchTerm,
      loadMoreSeries: jest.fn(),
      refreshSeries: jest.fn(),
    });

    const { getByDisplayValue } = render(<HomeScreen />);

    expect(getByDisplayValue('test search')).toBeTruthy();
  });

  it('should pass correct props to SeriesList', () => {
    const mockLoadMoreSeries = jest.fn();
    const mockSeries = [{ id: 1, name: 'Test Series', genres: ['Drama'], status: 'Running' }];

    mockUseSeriesData.mockReturnValue({
      series: mockSeries,
      loading: true,
      error: null,
      hasMore: true,
      searchTerm: '',
      setSearchTerm: jest.fn(),
      setDebouncedSearchTerm: jest.fn(),
      loadMoreSeries: mockLoadMoreSeries,
      refreshSeries: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);

    expect(getByText('Series count: 1')).toBeTruthy();
    expect(getByText('Has more: true')).toBeTruthy();
    expect(getByTestId('loading')).toBeTruthy();
  });

  it('should render empty series list', () => {
    mockUseSeriesData.mockReturnValue({
      series: [],
      loading: false,
      error: null,
      hasMore: false,
      searchTerm: '',
      setSearchTerm: jest.fn(),
      setDebouncedSearchTerm: jest.fn(),
      loadMoreSeries: jest.fn(),
      refreshSeries: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);

    expect(getByText('Series count: 0')).toBeTruthy();
    expect(getByText('Has more: false')).toBeTruthy();
  });
});