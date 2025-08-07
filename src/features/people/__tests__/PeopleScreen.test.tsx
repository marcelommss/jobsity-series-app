import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PeopleScreen } from '../PeopleScreen';
import { usePeopleSearch } from '../hooks/usePeopleSearch';
import { Person } from '@/types';

// Mock the hook
jest.mock('../hooks/usePeopleSearch');
const mockUsePeopleSearch = usePeopleSearch as jest.MockedFunction<typeof usePeopleSearch>;

// Mock SearchIcon
jest.mock('lucide-react-native', () => ({
  SearchIcon: 'SearchIcon',
}));

describe('PeopleScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPeople: Person[] = [
    {
      id: 1,
      name: 'John Doe',
      image: {
        medium: 'https://example.com/john.jpg',
        original: 'https://example.com/john-orig.jpg',
      },
      country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
      birthday: '1980-01-01',
      deathday: null,
      gender: 'Male',
    },
    {
      id: 2,
      name: 'Jane Smith',
      image: null,
      country: null,
      birthday: null,
      deathday: null,
      gender: 'Female',
    }
  ];

  const defaultHookReturn = {
    searchQuery: '',
    setSearchQuery: jest.fn(),
    people: [],
    loading: false,
    error: null,
    hasSearched: false,
    retrySearch: jest.fn(),
  };

  it('should render initial screen with search prompt', () => {
    mockUsePeopleSearch.mockReturnValue(defaultHookReturn);

    const { getByText, getByPlaceholderText } = render(<PeopleScreen />);

    expect(getByText('People')).toBeTruthy();
    expect(getByText('Search for actors, directors, and other people in TV shows')).toBeTruthy();
    expect(getByPlaceholderText('Search for people...')).toBeTruthy();
    expect(getByText('Search for People')).toBeTruthy();
    expect(getByText('Find information about actors, directors, writers, and other people involved in TV shows.')).toBeTruthy();
  });

  it('should show loading state', () => {
    mockUsePeopleSearch.mockReturnValue({
      ...defaultHookReturn,
      loading: true,
    });

    const { getByText } = render(<PeopleScreen />);

    expect(getByText('Searching people...')).toBeTruthy();
  });

  it('should show search results', () => {
    mockUsePeopleSearch.mockReturnValue({
      ...defaultHookReturn,
      people: mockPeople,
      hasSearched: true,
    });

    const { getByText } = render(<PeopleScreen />);

    expect(getByText('2 results found')).toBeTruthy();
  });

  it('should show singular result text for one result', () => {
    mockUsePeopleSearch.mockReturnValue({
      ...defaultHookReturn,
      people: [mockPeople[0]],
      hasSearched: true,
    });

    const { getByText } = render(<PeopleScreen />);

    expect(getByText('1 result found')).toBeTruthy();
  });

  it('should show no results state', () => {
    mockUsePeopleSearch.mockReturnValue({
      ...defaultHookReturn,
      searchQuery: 'nonexistent',
      people: [],
      hasSearched: true,
    });

    const { getByText } = render(<PeopleScreen />);

    expect(getByText('No People Found')).toBeTruthy();
    expect(getByText('Try searching with a different name or check your spelling.')).toBeTruthy();
  });

  it('should show error state with retry option', () => {
    const mockRetrySearch = jest.fn();
    mockUsePeopleSearch.mockReturnValue({
      ...defaultHookReturn,
      error: { message: 'Search failed' },
      retrySearch: mockRetrySearch,
    });

    const { getByText } = render(<PeopleScreen />);

    expect(getByText('Search failed')).toBeTruthy();
  });

  it('should call setSearchQuery when typing in search input', () => {
    const mockSetSearchQuery = jest.fn();
    mockUsePeopleSearch.mockReturnValue({
      ...defaultHookReturn,
      setSearchQuery: mockSetSearchQuery,
    });

    const { getByPlaceholderText } = render(<PeopleScreen />);
    const searchInput = getByPlaceholderText('Search for people...');

    fireEvent.changeText(searchInput, 'john doe');

    expect(mockSetSearchQuery).toHaveBeenCalledWith('john doe');
  });

  it('should display current search query in input', () => {
    mockUsePeopleSearch.mockReturnValue({
      ...defaultHookReturn,
      searchQuery: 'john doe',
    });

    const { getByDisplayValue } = render(<PeopleScreen />);

    expect(getByDisplayValue('john doe')).toBeTruthy();
  });

  it('should not show results or states when loading', () => {
    mockUsePeopleSearch.mockReturnValue({
      ...defaultHookReturn,
      loading: true,
      people: mockPeople, // Even with people, should not show them when loading
      hasSearched: true,
    });

    const { queryByText, getByText } = render(<PeopleScreen />);

    expect(getByText('Searching people...')).toBeTruthy();
    expect(queryByText('results found')).toBeFalsy();
  });

  it('should not show error when loading', () => {
    mockUsePeopleSearch.mockReturnValue({
      ...defaultHookReturn,
      loading: true,
      error: { message: 'Previous error' },
    });

    const { queryByText, getByText } = render(<PeopleScreen />);

    expect(getByText('Searching people...')).toBeTruthy();
    expect(queryByText('Previous error')).toBeFalsy();
  });

  it('should handle empty search query after having results', () => {
    mockUsePeopleSearch.mockReturnValue({
      ...defaultHookReturn,
      searchQuery: '',
      people: [],
      hasSearched: false,
    });

    const { getByText, queryByText } = render(<PeopleScreen />);

    expect(getByText('Search for People')).toBeTruthy();
    expect(queryByText('results found')).toBeFalsy();
    expect(queryByText('No People Found')).toBeFalsy();
  });

  it('should show correct state when search query has no results', () => {
    mockUsePeopleSearch.mockReturnValue({
      ...defaultHookReturn,
      searchQuery: 'xyz123',
      people: [],
      hasSearched: true,
      loading: false,
      error: null,
    });

    const { getByText } = render(<PeopleScreen />);

    expect(getByText('No People Found')).toBeTruthy();
    expect(getByText('Try searching with a different name or check your spelling.')).toBeTruthy();
  });

  it('should prioritize loading state over other states', () => {
    mockUsePeopleSearch.mockReturnValue({
      ...defaultHookReturn,
      loading: true,
      error: { message: 'Error' },
      people: mockPeople,
      hasSearched: true,
    });

    const { getByText, queryByText } = render(<PeopleScreen />);

    expect(getByText('Searching people...')).toBeTruthy();
    expect(queryByText('Error')).toBeFalsy();
    expect(queryByText('results found')).toBeFalsy();
  });

  it('should show error state when not loading and error exists', () => {
    const mockRetrySearch = jest.fn();
    mockUsePeopleSearch.mockReturnValue({
      ...defaultHookReturn,
      loading: false,
      error: { message: 'Network error', status: 500 },
      retrySearch: mockRetrySearch,
    });

    const { getByText } = render(<PeopleScreen />);

    expect(getByText('Network error')).toBeTruthy();
  });
});