import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';
import SeriesCard from '../SeriesCard';
import { Series } from '@/types';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('SeriesCard', () => {
  const mockSeries: Series = {
    id: 1,
    name: 'Breaking Bad',
    genres: ['Drama', 'Crime', 'Thriller'],
    status: 'Ended',
    premiered: '2008-01-20',
    rating: { average: 9.3 },
    image: { 
      medium: 'https://example.com/breaking-bad-medium.jpg',
      original: 'https://example.com/breaking-bad.jpg'
    },
    summary: '<p>A high school chemistry teacher becomes a meth manufacturer.</p>',
    schedule: { time: '21:00', days: ['Sunday'] },
    network: { id: 1, name: 'AMC', country: { name: 'USA', code: 'US' } }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render series information correctly', () => {
    const { getByText } = render(<SeriesCard series={mockSeries} />);

    expect(getByText('Breaking Bad')).toBeTruthy();
    expect(getByText('Drama • Crime • Thriller')).toBeTruthy();
    expect(getByText('9.3')).toBeTruthy();
    expect(getByText('Ended')).toBeTruthy();
    expect(getByText('2008')).toBeTruthy();
  });

  it('should navigate to series details when pressed', () => {
    const { getByText } = render(<SeriesCard series={mockSeries} />);

    fireEvent.press(getByText('Breaking Bad'));
    expect(router.push).toHaveBeenCalledWith('/series/1');
  });

  it('should render series without image', () => {
    const seriesWithoutImage: Series = {
      ...mockSeries,
      image: null
    };

    const { getByText } = render(<SeriesCard series={seriesWithoutImage} />);

    expect(getByText('📺\nNo Image')).toBeTruthy();
    expect(getByText('Breaking Bad')).toBeTruthy();
  });

  it('should render series without rating', () => {
    const seriesWithoutRating: Series = {
      ...mockSeries,
      rating: null
    };

    const { getByText, queryByText } = render(<SeriesCard series={seriesWithoutRating} />);

    expect(getByText('Breaking Bad')).toBeTruthy();
    expect(queryByText('9.3')).toBeNull();
  });

  it('should render series without genres', () => {
    const seriesWithoutGenres: Series = {
      ...mockSeries,
      genres: []
    };

    const { getByText, queryByText } = render(<SeriesCard series={seriesWithoutGenres} />);

    expect(getByText('Breaking Bad')).toBeTruthy();
    expect(queryByText('Drama • Crime • Thriller')).toBeNull();
  });

  it('should limit genres to first 3', () => {
    const seriesWithManyGenres: Series = {
      ...mockSeries,
      genres: ['Drama', 'Crime', 'Thriller', 'Action', 'Mystery']
    };

    const { getByText, queryByText } = render(<SeriesCard series={seriesWithManyGenres} />);

    expect(getByText('Drama • Crime • Thriller')).toBeTruthy();
    expect(queryByText('Action')).toBeNull();
    expect(queryByText('Mystery')).toBeNull();
  });

  it('should render series without premiered date', () => {
    const seriesWithoutPremiered: Series = {
      ...mockSeries,
      premiered: null
    };

    const { getByText, queryByText } = render(<SeriesCard series={seriesWithoutPremiered} />);

    expect(getByText('Breaking Bad')).toBeTruthy();
    expect(queryByText('2008')).toBeNull();
  });

  it('should render series without status', () => {
    const seriesWithoutStatus: Series = {
      ...mockSeries,
      status: null
    };

    const { getByText, queryByText } = render(<SeriesCard series={seriesWithoutStatus} />);

    expect(getByText('Breaking Bad')).toBeTruthy();
    expect(queryByText('Ended')).toBeNull();
  });

  it('should render running series with different styling', () => {
    const runningSeries: Series = {
      ...mockSeries,
      status: 'Running'
    };

    const { getByText } = render(<SeriesCard series={runningSeries} />);

    expect(getByText('Running')).toBeTruthy();
  });

  it('should handle series name truncation', () => {
    const seriesWithLongName: Series = {
      ...mockSeries,
      name: 'This is a very long series name that should be truncated properly in the component'
    };

    const { getByText } = render(<SeriesCard series={seriesWithLongName} />);

    expect(getByText(seriesWithLongName.name)).toBeTruthy();
  });

  it('should format year correctly from premiered date', () => {
    const seriesFromFuture: Series = {
      ...mockSeries,
      premiered: '2025-06-15'
    };

    const { getByText } = render(<SeriesCard series={seriesFromFuture} />);

    expect(getByText('2025')).toBeTruthy();
  });

  it('should handle invalid premiered date gracefully', () => {
    const seriesWithInvalidDate: Series = {
      ...mockSeries,
      premiered: 'invalid-date'
    };

    const { queryByText } = render(<SeriesCard series={seriesWithInvalidDate} />);

    expect(queryByText('NaN')).toBeNull();
  });

  it('should display rating with one decimal place', () => {
    const seriesWithPreciseRating: Series = {
      ...mockSeries,
      rating: { average: 8.756 }
    };

    const { getByText } = render(<SeriesCard series={seriesWithPreciseRating} />);

    expect(getByText('8.8')).toBeTruthy();
  });
});