import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';
import { EpisodesList } from '../EpisodesList';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('../../hooks/useEpisodes', () => ({
  useEpisodes: jest.fn(),
}));

import { useEpisodes } from '../../hooks/useEpisodes';

const mockUseEpisodes = useEpisodes as jest.MockedFunction<typeof useEpisodes>;

describe('EpisodesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    mockUseEpisodes.mockReturnValue({
      episodes: [],
      loading: true,
      error: null,
      refreshEpisodes: jest.fn(),
    });

    const { getByText, UNSAFE_getByType } = render(<EpisodesList seriesId={1} />);

    expect(getByText('Episodes')).toBeTruthy();
    const ActivityIndicator = require('react-native').ActivityIndicator;
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('should render error state with retry button', () => {
    const mockRefresh = jest.fn();
    const mockError = { message: 'Failed to load episodes', status: 404 };

    mockUseEpisodes.mockReturnValue({
      episodes: [],
      loading: false,
      error: mockError,
      refreshEpisodes: mockRefresh,
    });

    const { getByText } = render(<EpisodesList seriesId={1} />);

    expect(getByText('Episodes')).toBeTruthy();
    expect(getByText('Failed to load episodes')).toBeTruthy();
  });

  it('should render empty state when no episodes', () => {
    mockUseEpisodes.mockReturnValue({
      episodes: [],
      loading: false,
      error: null,
      refreshEpisodes: jest.fn(),
    });

    const { getByText } = render(<EpisodesList seriesId={1} />);

    expect(getByText('Episodes')).toBeTruthy();
    expect(getByText('No episodes available.')).toBeTruthy();
  });

  it('should render episodes grouped by season', () => {
    const mockEpisodes = [
      {
        season: 1,
        episodes: [
          {
            id: 1,
            name: 'Pilot',
            season: 1,
            number: 1,
            summary: '<p>The pilot episode</p>',
            airdate: '2008-01-20',
            runtime: 47,
            image: { medium: 'pilot.jpg', original: 'pilot-large.jpg' }
          },
          {
            id: 2,
            name: 'Cat\'s in the Bag...',
            season: 1,
            number: 2,
            summary: '<p>Second episode</p>',
            airdate: '2008-01-27',
            runtime: 48,
            image: null
          }
        ]
      },
      {
        season: 2,
        episodes: [
          {
            id: 3,
            name: 'Seven Thirty-Seven',
            season: 2,
            number: 1,
            summary: null,
            airdate: '2009-03-08',
            runtime: 47,
            image: { medium: 's2e1.jpg', original: 's2e1-large.jpg' }
          }
        ]
      }
    ];

    mockUseEpisodes.mockReturnValue({
      episodes: mockEpisodes,
      loading: false,
      error: null,
      refreshEpisodes: jest.fn(),
    });

    const { getByText } = render(<EpisodesList seriesId={1} />);

    expect(getByText('Episodes')).toBeTruthy();
    expect(getByText('Season 1 (2 episodes)')).toBeTruthy();
    expect(getByText('Season 2 (1 episodes)')).toBeTruthy();
    expect(getByText('Pilot')).toBeTruthy();
    expect(getByText('Cat\'s in the Bag...')).toBeTruthy();
    expect(getByText('Seven Thirty-Seven')).toBeTruthy();
  });

  it('should navigate to episode details when episode is pressed', () => {
    const mockEpisodes = [
      {
        season: 1,
        episodes: [
          {
            id: 1,
            name: 'Pilot',
            season: 1,
            number: 1,
            summary: '<p>The pilot episode</p>',
            airdate: '2008-01-20',
            runtime: 47,
            image: { medium: 'pilot.jpg', original: 'pilot-large.jpg' }
          }
        ]
      }
    ];

    mockUseEpisodes.mockReturnValue({
      episodes: mockEpisodes,
      loading: false,
      error: null,
      refreshEpisodes: jest.fn(),
    });

    const { getByText } = render(<EpisodesList seriesId={1} />);

    const episodeCard = getByText('Pilot');
    fireEvent.press(episodeCard);

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/episode/[id]',
      params: {
        id: '1',
        name: 'Pilot',
        season: '1',
        number: '1',
        summary: '<p>The pilot episode</p>',
        image: 'pilot.jpg',
        airdate: '2008-01-20',
        runtime: '47'
      }
    });
  });

  it('should handle episodes without images', () => {
    const mockEpisodes = [
      {
        season: 1,
        episodes: [
          {
            id: 1,
            name: 'No Image Episode',
            season: 1,
            number: 1,
            summary: null,
            airdate: '2008-01-20',
            runtime: 47,
            image: null
          }
        ]
      }
    ];

    mockUseEpisodes.mockReturnValue({
      episodes: mockEpisodes,
      loading: false,
      error: null,
      refreshEpisodes: jest.fn(),
    });

    const { getByText } = render(<EpisodesList seriesId={1} />);

    expect(getByText('No Image')).toBeTruthy();
    expect(getByText('No Image Episode')).toBeTruthy();
  });

  it('should format episode numbers correctly', () => {
    const mockEpisodes = [
      {
        season: 1,
        episodes: [
          {
            id: 1,
            name: 'First Episode',
            season: 1,
            number: 1,
            summary: null,
            airdate: '2008-01-20',
            runtime: 47,
            image: null
          }
        ]
      },
      {
        season: 10,
        episodes: [
          {
            id: 100,
            name: 'Season 10 Episode',
            season: 10,
            number: 15,
            summary: null,
            airdate: '2018-01-20',
            runtime: 47,
            image: null
          }
        ]
      }
    ];

    mockUseEpisodes.mockReturnValue({
      episodes: mockEpisodes,
      loading: false,
      error: null,
      refreshEpisodes: jest.fn(),
    });

    const { getByText } = render(<EpisodesList seriesId={1} />);

    expect(getByText('S1E1')).toBeTruthy();
    expect(getByText('S10E15')).toBeTruthy();
  });

  it('should format air dates correctly', () => {
    const mockEpisodes = [
      {
        season: 1,
        episodes: [
          {
            id: 1,
            name: 'Episode with Date',
            season: 1,
            number: 1,
            summary: null,
            airdate: '2008-01-20',
            runtime: 47,
            image: null
          }
        ]
      }
    ];

    mockUseEpisodes.mockReturnValue({
      episodes: mockEpisodes,
      loading: false,
      error: null,
      refreshEpisodes: jest.fn(),
    });

    const { getByText } = render(<EpisodesList seriesId={1} />);

    expect(getByText('1/20/2008')).toBeTruthy();
  });

  it('should strip HTML tags from episode summaries', () => {
    const mockEpisodes = [
      {
        season: 1,
        episodes: [
          {
            id: 1,
            name: 'HTML Episode',
            season: 1,
            number: 1,
            summary: '<p><b>Bold text</b> and <i>italic text</i> with <a href="#">links</a></p>',
            airdate: '2008-01-20',
            runtime: 47,
            image: null
          }
        ]
      }
    ];

    mockUseEpisodes.mockReturnValue({
      episodes: mockEpisodes,
      loading: false,
      error: null,
      refreshEpisodes: jest.fn(),
    });

    const { getByText } = render(<EpisodesList seriesId={1} />);

    expect(getByText('Bold text and italic text with links')).toBeTruthy();
  });

  it('should handle episodes without summaries', () => {
    const mockEpisodes = [
      {
        season: 1,
        episodes: [
          {
            id: 1,
            name: 'No Summary Episode',
            season: 1,
            number: 1,
            summary: null,
            airdate: '2008-01-20',
            runtime: 47,
            image: null
          }
        ]
      }
    ];

    mockUseEpisodes.mockReturnValue({
      episodes: mockEpisodes,
      loading: false,
      error: null,
      refreshEpisodes: jest.fn(),
    });

    const { getByText } = render(<EpisodesList seriesId={1} />);

    expect(getByText('No Summary Episode')).toBeTruthy();
  });

  it('should handle episodes without air dates', () => {
    const mockEpisodes = [
      {
        season: 1,
        episodes: [
          {
            id: 1,
            name: 'No Date Episode',
            season: 1,
            number: 1,
            summary: null,
            airdate: null,
            runtime: 47,
            image: null
          }
        ]
      }
    ];

    mockUseEpisodes.mockReturnValue({
      episodes: mockEpisodes,
      loading: false,
      error: null,
      refreshEpisodes: jest.fn(),
    });

    const { getByText } = render(<EpisodesList seriesId={1} />);

    expect(getByText('No Date Episode')).toBeTruthy();
  });
});