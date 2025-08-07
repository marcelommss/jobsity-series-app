import React from 'react';
import { render } from '@testing-library/react-native';
import { SeriesList } from '../SeriesList';
import { Series } from '@/types';

jest.mock('../SeriesCard', () => ({
  SeriesCard: ({ series }: { series: Series }) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { testID: `series-card-${series.id}` }, series.name);
  }
}));

describe('SeriesList', () => {
  const mockSeries: Series[] = [
    {
      id: 1,
      name: 'Breaking Bad',
      genres: ['Drama'],
      status: 'Ended',
      premiered: '2008-01-20',
      rating: { average: 9.3 },
      image: null,
      summary: 'A high school teacher starts cooking meth.',
      schedule: { time: '21:00', days: ['Sunday'] },
      network: null
    },
    {
      id: 2,
      name: 'Game of Thrones',
      genres: ['Fantasy'],
      status: 'Ended',
      premiered: '2011-04-17',
      rating: { average: 8.7 },
      image: null,
      summary: 'Epic fantasy series.',
      schedule: { time: '21:00', days: ['Sunday'] },
      network: null
    }
  ];

  it('should render series cards for all series', () => {
    const { getByTestId } = render(
      <SeriesList
        data={mockSeries}
        loading={false}
        hasMore={true}
        onEndReached={jest.fn()}
      />
    );

    expect(getByTestId('series-card-1')).toBeTruthy();
    expect(getByTestId('series-card-2')).toBeTruthy();
  });

  it('should render loading indicator when loading', () => {
    const { UNSAFE_getByType } = render(
      <SeriesList
        data={mockSeries}
        loading={true}
        hasMore={true}
        onEndReached={jest.fn()}
      />
    );

    const ActivityIndicator = require('react-native').ActivityIndicator;
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('should not render loading indicator when not loading', () => {
    const { UNSAFE_queryByType } = render(
      <SeriesList
        data={mockSeries}
        loading={false}
        hasMore={true}
        onEndReached={jest.fn()}
      />
    );

    const ActivityIndicator = require('react-native').ActivityIndicator;
    expect(UNSAFE_queryByType(ActivityIndicator)).toBeNull();
  });

  it('should call onEndReached when hasMore is true', () => {
    const mockOnEndReached = jest.fn();
    
    render(
      <SeriesList
        data={mockSeries}
        loading={false}
        hasMore={true}
        onEndReached={mockOnEndReached}
      />
    );

    expect(mockOnEndReached).toBeDefined();
  });

  it('should not set onEndReached when hasMore is false', () => {
    const mockOnEndReached = jest.fn();
    
    const { UNSAFE_getByType } = render(
      <SeriesList
        data={mockSeries}
        loading={false}
        hasMore={false}
        onEndReached={mockOnEndReached}
      />
    );

    const FlatList = require('react-native').FlatList;
    const flatList = UNSAFE_getByType(FlatList);
    expect(flatList.props.onEndReached).toBeUndefined();
  });

  it('should render empty list when data is empty', () => {
    const { UNSAFE_getByType } = render(
      <SeriesList
        data={[]}
        loading={false}
        hasMore={false}
        onEndReached={jest.fn()}
      />
    );

    const FlatList = require('react-native').FlatList;
    const flatList = UNSAFE_getByType(FlatList);
    expect(flatList.props.data).toEqual([]);
  });

  it('should use correct key extractor', () => {
    const { UNSAFE_getByType } = render(
      <SeriesList
        data={mockSeries}
        loading={false}
        hasMore={true}
        onEndReached={jest.fn()}
      />
    );

    const FlatList = require('react-native').FlatList;
    const flatList = UNSAFE_getByType(FlatList);
    const keyExtractor = flatList.props.keyExtractor;
    
    expect(keyExtractor(mockSeries[0])).toBe('1');
    expect(keyExtractor(mockSeries[1])).toBe('2');
  });

  it('should have correct FlatList props', () => {
    const { UNSAFE_getByType } = render(
      <SeriesList
        data={mockSeries}
        loading={false}
        hasMore={true}
        onEndReached={jest.fn()}
      />
    );

    const FlatList = require('react-native').FlatList;
    const flatList = UNSAFE_getByType(FlatList);
    
    expect(flatList.props.showsVerticalScrollIndicator).toBe(false);
    expect(flatList.props.onEndReachedThreshold).toBe(0.5);
  });

  it('should render with loading state and data', () => {
    const { getByTestId, UNSAFE_getByType } = render(
      <SeriesList
        data={mockSeries}
        loading={true}
        hasMore={true}
        onEndReached={jest.fn()}
      />
    );

    expect(getByTestId('series-card-1')).toBeTruthy();
    expect(getByTestId('series-card-2')).toBeTruthy();
    
    const ActivityIndicator = require('react-native').ActivityIndicator;
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('should handle single series item', () => {
    const singleSeries = [mockSeries[0]];
    
    const { getByTestId, queryByTestId } = render(
      <SeriesList
        data={singleSeries}
        loading={false}
        hasMore={false}
        onEndReached={jest.fn()}
      />
    );

    expect(getByTestId('series-card-1')).toBeTruthy();
    expect(queryByTestId('series-card-2')).toBeNull();
  });
});