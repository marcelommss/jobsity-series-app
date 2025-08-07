import { renderHook, act, waitFor } from '@testing-library/react-native';
import { usePeopleSearch } from '../usePeopleSearch';
import { searchPeople, PeopleServiceError } from '@/services/peopleService';
import { Person } from '@/types';

// Mock the service
jest.mock('@/services/peopleService');
const mockSearchPeople = searchPeople as jest.MockedFunction<typeof searchPeople>;

describe('usePeopleSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockPeople: Person[] = [
    {
      id: 1,
      name: 'John Doe',
      image: {
        medium: 'https://example.com/john-medium.jpg',
        original: 'https://example.com/john-original.jpg',
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

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePeopleSearch());

    expect(result.current.searchQuery).toBe('');
    expect(result.current.people).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(false);
  });

  it('should handle empty search query', async () => {
    const { result } = renderHook(() => usePeopleSearch());

    act(() => {
      result.current.setSearchQuery('');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.people).toEqual([]);
    expect(result.current.hasSearched).toBe(false);
    expect(mockSearchPeople).not.toHaveBeenCalled();
  });

  it('should handle whitespace-only search query', async () => {
    const { result } = renderHook(() => usePeopleSearch());

    act(() => {
      result.current.setSearchQuery('   ');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.people).toEqual([]);
    expect(result.current.hasSearched).toBe(false);
    expect(mockSearchPeople).not.toHaveBeenCalled();
  });

  it('should search people successfully with debouncing', async () => {
    mockSearchPeople.mockResolvedValueOnce(mockPeople);
    const { result } = renderHook(() => usePeopleSearch());

    act(() => {
      result.current.setSearchQuery('john');
    });

    // Should not call API immediately
    expect(result.current.loading).toBe(false);
    expect(mockSearchPeople).not.toHaveBeenCalled();

    // Advance timer to trigger debounced search
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should now be loading
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockSearchPeople).toHaveBeenCalledWith('john');
    expect(result.current.people).toEqual(mockPeople);
    expect(result.current.hasSearched).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should handle multiple rapid search queries with debouncing', async () => {
    mockSearchPeople.mockResolvedValueOnce(mockPeople);
    const { result } = renderHook(() => usePeopleSearch());

    // Type rapidly
    act(() => {
      result.current.setSearchQuery('j');
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      result.current.setSearchQuery('jo');
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      result.current.setSearchQuery('john');
    });

    // Should not have called API yet
    expect(mockSearchPeople).not.toHaveBeenCalled();

    // Complete debounce timer
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should only call API once with final query
    expect(mockSearchPeople).toHaveBeenCalledTimes(1);
    expect(mockSearchPeople).toHaveBeenCalledWith('john');
  });

  it('should handle API errors', async () => {
    const error = new PeopleServiceError('Search failed', 500);
    mockSearchPeople.mockRejectedValueOnce(error);
    const { result } = renderHook(() => usePeopleSearch());

    act(() => {
      result.current.setSearchQuery('john');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.people).toEqual([]);
    expect(result.current.hasSearched).toBe(true);
    expect(result.current.error).toEqual({
      message: 'Search failed',
      status: 500,
    });
  });

  it('should handle generic errors', async () => {
    const error = new Error('Generic error');
    mockSearchPeople.mockRejectedValueOnce(error);
    const { result } = renderHook(() => usePeopleSearch());

    act(() => {
      result.current.setSearchQuery('john');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.people).toEqual([]);
    expect(result.current.hasSearched).toBe(true);
    expect(result.current.error).toEqual({
      message: 'Failed to search people',
    });
  });

  it('should retry search on retrySearch call', async () => {
    mockSearchPeople.mockResolvedValueOnce(mockPeople);
    const { result } = renderHook(() => usePeopleSearch());

    // Set a search query first
    act(() => {
      result.current.setSearchQuery('john');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear the mock to test retry
    mockSearchPeople.mockClear();
    mockSearchPeople.mockResolvedValueOnce([mockPeople[0]]);

    // Call retry
    act(() => {
      result.current.retrySearch();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockSearchPeople).toHaveBeenCalledWith('john');
    expect(result.current.people).toEqual([mockPeople[0]]);
  });

  it('should clear results when search query becomes empty', async () => {
    mockSearchPeople.mockResolvedValueOnce(mockPeople);
    const { result } = renderHook(() => usePeopleSearch());

    // First search
    act(() => {
      result.current.setSearchQuery('john');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.people).toEqual(mockPeople);
    });

    // Clear search
    act(() => {
      result.current.setSearchQuery('');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.people).toEqual([]);
    expect(result.current.hasSearched).toBe(false);
    expect(result.current.error).toBe(null);
  });
});