import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';
import PersonCard from '../PersonCard';
import { Person } from '@/types';

// Mock router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

const mockRouter = router as jest.Mocked<typeof router>;

describe('PersonCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPerson: Person = {
    id: 1,
    name: 'John Doe',
    image: {
      medium: 'https://example.com/john-medium.jpg',
      original: 'https://example.com/john-original.jpg',
    },
    country: {
      name: 'United States',
      code: 'US',
      timezone: 'America/New_York',
    },
    birthday: '1980-01-01',
    deathday: null,
    gender: 'Male',
    url: 'https://www.tvmaze.com/people/1/john-doe',
    updated: 1234567890,
    _links: {
      self: {
        href: 'https://api.tvmaze.com/people/1'
      }
    }
  };

  const mockPersonMinimal: Person = {
    id: 2,
    name: 'Jane Smith',
    image: null,
    country: null,
    birthday: null,
    deathday: null,
    gender: null,
  };

  it('should render person with complete information', () => {
    const { getByText } = render(<PersonCard person={mockPerson} />);
    
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('📍 United States')).toBeTruthy();
    expect(getByText('Male')).toBeTruthy();
    expect(getByText('44 years old')).toBeTruthy();
  });

  it('should render person with minimal information', () => {
    const { getByText, queryByText } = render(<PersonCard person={mockPersonMinimal} />);
    
    expect(getByText('Jane Smith')).toBeTruthy();
    expect(queryByText(/📍/)).toBeFalsy();
    expect(queryByText(/years old/)).toBeFalsy();
  });

  it('should show deceased person with birth/death years', () => {
    const deceasedPerson: Person = {
      ...mockPerson,
      birthday: '1950-01-01',
      deathday: '2020-12-31',
    };

    const { getByText } = render(<PersonCard person={deceasedPerson} />);
    
    expect(getByText('70 (1950-2020)')).toBeTruthy();
  });

  it('should show no image placeholder when image is null', () => {
    const { getByText } = render(<PersonCard person={mockPersonMinimal} />);
    
    expect(getByText('👤\nNo Image')).toBeTruthy();
  });

  it('should navigate to person details on press', () => {
    const { getByText } = render(<PersonCard person={mockPerson} />);
    
    fireEvent.press(getByText('John Doe'));
    
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/person/[id]',
      params: {
        id: '1',
        name: 'John Doe',
        image: 'https://example.com/john-medium.jpg',
        country: 'United States',
        birthday: '1980-01-01',
        deathday: '',
        gender: 'Male',
      },
    });
  });

  it('should handle navigation with empty values', () => {
    const { getByText } = render(<PersonCard person={mockPersonMinimal} />);
    
    fireEvent.press(getByText('Jane Smith'));
    
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/person/[id]',
      params: {
        id: '2',
        name: 'Jane Smith',
        image: '',
        country: '',
        birthday: '',
        deathday: '',
        gender: '',
      },
    });
  });

  it('should handle invalid birth date gracefully', () => {
    const personWithInvalidDate: Person = {
      ...mockPerson,
      birthday: 'invalid-date',
    };

    const { queryByText } = render(<PersonCard person={personWithInvalidDate} />);
    
    expect(queryByText(/years old/)).toBeFalsy();
  });

  it('should calculate age correctly for current year', () => {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - 30;
    const personWithKnownAge: Person = {
      ...mockPerson,
      birthday: `${birthYear}-06-15`,
      deathday: null,
    };

    const { getByText } = render(<PersonCard person={personWithKnownAge} />);
    
    // Age could be 29 or 30 depending on current date vs birthday
    expect(getByText(/29 years old|30 years old/)).toBeTruthy();
  });
});