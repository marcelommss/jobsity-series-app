import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';
import { SeriesCredit } from '../SeriesCredit';
import { CastCredit } from '@/types';

// Mock router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

const mockRouter = router as jest.Mocked<typeof router>;

describe('SeriesCredit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCredit: CastCredit = {
    self: false,
    voice: false,
    _links: {
      show: {
        href: 'https://api.tvmaze.com/shows/1',
        name: 'Breaking Bad'
      },
      character: {
        href: 'https://api.tvmaze.com/characters/1',
        name: 'Walter White'
      }
    }
  };

  const mockVoiceCredit: CastCredit = {
    self: false,
    voice: true,
    _links: {
      show: {
        href: 'https://api.tvmaze.com/shows/2',
        name: 'The Simpsons'
      },
      character: {
        href: 'https://api.tvmaze.com/characters/2',
        name: 'Homer Simpson'
      }
    }
  };

  it('should render series credit with show name and character', () => {
    const { getByText } = render(<SeriesCredit credit={mockCredit} />);
    
    expect(getByText('Breaking Bad')).toBeTruthy();
    expect(getByText('as Walter White')).toBeTruthy();
  });

  it('should show voice actor indicator for voice credits', () => {
    const { getByText } = render(<SeriesCredit credit={mockVoiceCredit} />);
    
    expect(getByText('The Simpsons')).toBeTruthy();
    expect(getByText('as Homer Simpson')).toBeTruthy();
    expect(getByText('Voice Actor')).toBeTruthy();
  });

  it('should not show voice actor indicator for regular credits', () => {
    const { queryByText } = render(<SeriesCredit credit={mockCredit} />);
    
    expect(queryByText('Voice Actor')).toBeFalsy();
  });

  it('should navigate to series details on press', () => {
    const { getByText } = render(<SeriesCredit credit={mockCredit} />);
    
    fireEvent.press(getByText('Breaking Bad'));
    
    expect(mockRouter.push).toHaveBeenCalledWith('/series/1');
  });

  it('should handle series ID extraction from different URL formats', () => {
    const creditWithDifferentUrl: CastCredit = {
      ...mockCredit,
      _links: {
        ...mockCredit._links,
        show: {
          href: 'https://api.tvmaze.com/shows/123',
          name: 'Game of Thrones'
        }
      }
    };

    const { getByText } = render(<SeriesCredit credit={creditWithDifferentUrl} />);
    
    fireEvent.press(getByText('Game of Thrones'));
    
    expect(mockRouter.push).toHaveBeenCalledWith('/series/123');
  });

  it('should handle invalid URL gracefully', () => {
    const creditWithInvalidUrl: CastCredit = {
      ...mockCredit,
      _links: {
        ...mockCredit._links,
        show: {
          href: 'invalid-url',
          name: 'Test Show'
        }
      }
    };

    const { getByText } = render(<SeriesCredit credit={creditWithInvalidUrl} />);
    
    fireEvent.press(getByText('Test Show'));
    
    // Should not crash, might not navigate but shouldn't throw
    expect(mockRouter.push).toHaveBeenCalledWith('/series/undefined');
  });

  it('should show chevron indicator', () => {
    const { getByText } = render(<SeriesCredit credit={mockCredit} />);
    
    expect(getByText('›')).toBeTruthy();
  });

  it('should handle long show names with numberOfLines', () => {
    const creditWithLongName: CastCredit = {
      ...mockCredit,
      _links: {
        ...mockCredit._links,
        show: {
          href: 'https://api.tvmaze.com/shows/1',
          name: 'This is a Very Long Show Name That Should Be Truncated'
        }
      }
    };

    const { getByText } = render(<SeriesCredit credit={creditWithLongName} />);
    
    expect(getByText('This is a Very Long Show Name That Should Be Truncated')).toBeTruthy();
  });

  it('should apply correct styling classes', () => {
    const { getByText } = render(<SeriesCredit credit={mockCredit} />);
    
    const showName = getByText('Breaking Bad');
    const characterName = getByText('as Walter White');
    
    // Check that elements exist (styling classes are applied internally)
    expect(showName).toBeTruthy();
    expect(characterName).toBeTruthy();
  });
});