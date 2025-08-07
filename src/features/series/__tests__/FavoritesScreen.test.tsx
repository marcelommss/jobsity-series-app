import React from 'react';
import { render } from '@testing-library/react-native';
import { FavoritesScreen } from '../FavoritesScreen';
import { useFavoritesRefresh } from '../hooks/useFavoritesRefresh';
import { FavoriteItem } from '@/services/favoritesService';

// Mock the hook
jest.mock('../hooks/useFavoritesRefresh');
const mockUseFavoritesRefresh = useFavoritesRefresh as jest.MockedFunction<typeof useFavoritesRefresh>;

// Mock SeriesCard component
jest.mock('../components/SeriesCard', () => ({
  SeriesCard: ({ series }: { series: any }) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, {
      testID: `series-card-${series.id}`,
      children: series.name,
    });
  },
}));

describe('FavoritesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFavorites: FavoriteItem[] = [
    {
      id: 1,
      name: 'Breaking Bad',
      image: {
        medium: 'https://example.com/bb-medium.jpg',
        original: 'https://example.com/bb-original.jpg',
      },
      genres: ['Drama', 'Crime', 'Thriller'],
      rating: { average: 9.5 },
      status: 'Ended',
      premiered: '2008-01-20',
    },
    {
      id: 2,
      name: 'Game of Thrones',
      image: null,
      genres: ['Fantasy', 'Drama'],
      rating: { average: 8.8 },
      status: 'Ended',
      premiered: '2011-04-17',
    }
  ];

  const defaultHookReturn = {
    favorites: [],
    loading: false,
    refreshFavorites: jest.fn(),
  };

  it('should show loading state', () => {
    mockUseFavoritesRefresh.mockReturnValue({
      ...defaultHookReturn,
      loading: true,
    });

    const { getByText } = render(<FavoritesScreen />);

    expect(getByText('Loading favorites...')).toBeTruthy();
  });

  it('should show empty favorites state', () => {
    mockUseFavoritesRefresh.mockReturnValue({
      ...defaultHookReturn,
      favorites: [],
      loading: false,
    });

    const { getByText } = render(<FavoritesScreen />);

    expect(getByText('Your Favorites')).toBeTruthy();
    expect(getByText('No favorite series yet')).toBeTruthy();
    expect(getByText('No Favorites Yet')).toBeTruthy();
    expect(getByText('Start exploring TV series and tap the heart icon to add them to your favorites!')).toBeTruthy();
  });

  it('should show favorites list', () => {
    mockUseFavoritesRefresh.mockReturnValue({
      ...defaultHookReturn,
      favorites: mockFavorites,
      loading: false,
    });

    const { getByText, getByTestId } = render(<FavoritesScreen />);

    expect(getByText('Your Favorites')).toBeTruthy();
    expect(getByText('2 favorite series')).toBeTruthy();
    expect(getByTestId('series-card-1')).toBeTruthy();
    expect(getByTestId('series-card-2')).toBeTruthy();
    expect(getByText('Breaking Bad')).toBeTruthy();
    expect(getByText('Game of Thrones')).toBeTruthy();
  });

  it('should show singular text for one favorite', () => {
    mockUseFavoritesRefresh.mockReturnValue({
      ...defaultHookReturn,
      favorites: [mockFavorites[0]],
      loading: false,
    });

    const { getByText } = render(<FavoritesScreen />);

    expect(getByText('1 favorite series')).toBeTruthy();
  });

  it('should convert favorites to series format correctly', () => {
    const favoriteWithMinimalData: FavoriteItem = {
      id: 3,
      name: 'Minimal Series',
      image: null,
      genres: null,
      rating: null,
      status: null,
      premiered: null,
    };

    mockUseFavoritesRefresh.mockReturnValue({
      ...defaultHookReturn,
      favorites: [favoriteWithMinimalData],
      loading: false,
    });

    const { getByTestId } = render(<FavoritesScreen />);

    // Should not crash and should render the card
    expect(getByTestId('series-card-3')).toBeTruthy();
  });

  it('should handle empty favorites after loading', () => {
    mockUseFavoritesRefresh.mockReturnValue({
      ...defaultHookReturn,
      favorites: [],
      loading: false,
    });

    const { queryByTestId, getByText } = render(<FavoritesScreen />);

    // Should show empty state, not crash
    expect(queryByTestId(/series-card-/)).toBeFalsy();
    expect(getByText('No Favorites Yet')).toBeTruthy();
  });

  it('should show heart emoji in empty state', () => {
    mockUseFavoritesRefresh.mockReturnValue({
      ...defaultHookReturn,
      favorites: [],
      loading: false,
    });

    const { getByText } = render(<FavoritesScreen />);

    expect(getByText('💙')).toBeTruthy();
  });

  it('should render all favorite items when list is populated', () => {
    const largeFavoritesList: FavoriteItem[] = [
      ...mockFavorites,
      {
        id: 3,
        name: 'The Wire',
        image: { medium: 'wire.jpg', original: 'wire-orig.jpg' },
        genres: ['Crime', 'Drama'],
        rating: { average: 9.3 },
        status: 'Ended',
        premiered: '2002-06-02',
      },
      {
        id: 4,
        name: 'The Sopranos',
        image: null,
        genres: ['Crime', 'Drama'],
        rating: { average: 9.2 },
        status: 'Ended',
        premiered: '1999-01-10',
      }
    ];

    mockUseFavoritesRefresh.mockReturnValue({
      ...defaultHookReturn,
      favorites: largeFavoritesList,
      loading: false,
    });

    const { getByText, getByTestId } = render(<FavoritesScreen />);

    expect(getByText('4 favorite series')).toBeTruthy();
    expect(getByTestId('series-card-1')).toBeTruthy();
    expect(getByTestId('series-card-2')).toBeTruthy();
    expect(getByTestId('series-card-3')).toBeTruthy();
    expect(getByTestId('series-card-4')).toBeTruthy();
  });

  it('should not show empty state when there are favorites', () => {
    mockUseFavoritesRefresh.mockReturnValue({
      ...defaultHookReturn,
      favorites: mockFavorites,
      loading: false,
    });

    const { queryByText } = render(<FavoritesScreen />);

    expect(queryByText('No Favorites Yet')).toBeFalsy();
    expect(queryByText('Start exploring TV series')).toBeFalsy();
  });

  it('should not show favorites list when loading', () => {
    mockUseFavoritesRefresh.mockReturnValue({
      ...defaultHookReturn,
      favorites: mockFavorites, // Even with favorites data
      loading: true,
    });

    const { queryByTestId, getByText } = render(<FavoritesScreen />);

    expect(getByText('Loading favorites...')).toBeTruthy();
    expect(queryByTestId(/series-card-/)).toBeFalsy();
  });
});