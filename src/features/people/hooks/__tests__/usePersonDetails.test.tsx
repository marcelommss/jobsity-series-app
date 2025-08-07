import { renderHook, waitFor } from '@testing-library/react-native';
import { usePersonDetails } from '../usePersonDetails';
import { fetchPersonById, getPersonCastCredits, PeopleServiceError } from '@/services/peopleService';
import { Person, CastCredit } from '@/types';

// Mock the service
jest.mock('@/services/peopleService');
const mockFetchPersonById = fetchPersonById as jest.MockedFunction<typeof fetchPersonById>;
const mockGetPersonCastCredits = getPersonCastCredits as jest.MockedFunction<typeof getPersonCastCredits>;

describe('usePersonDetails', () => {
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
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
    birthday: '1980-01-01',
    deathday: null,
    gender: 'Male',
  };

  const mockCastCredits: CastCredit[] = [
    {
      self: false,
      voice: false,
      _links: {
        show: { href: 'https://api.tvmaze.com/shows/1', name: 'Breaking Bad' },
        character: { href: 'https://api.tvmaze.com/characters/1', name: 'Walter White' }
      }
    },
    {
      self: false,
      voice: true,
      _links: {
        show: { href: 'https://api.tvmaze.com/shows/2', name: 'The Simpsons' },
        character: { href: 'https://api.tvmaze.com/characters/2', name: 'Homer Simpson' }
      }
    }
  ];

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => usePersonDetails(1));

    expect(result.current.loading).toBe(true);
    expect(result.current.person).toBe(null);
    expect(result.current.castCredits).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should fetch person details and cast credits successfully', async () => {
    mockFetchPersonById.mockResolvedValueOnce(mockPerson);
    mockGetPersonCastCredits.mockResolvedValueOnce(mockCastCredits);

    const { result } = renderHook(() => usePersonDetails(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.person).toEqual(mockPerson);
    expect(result.current.castCredits).toEqual(mockCastCredits);
    expect(result.current.error).toBe(null);
    expect(mockFetchPersonById).toHaveBeenCalledWith(1);
    expect(mockGetPersonCastCredits).toHaveBeenCalledWith(1);
  });

  it('should handle person fetch error', async () => {
    const error = new PeopleServiceError('Person not found', 404);
    mockFetchPersonById.mockRejectedValueOnce(error);
    mockGetPersonCastCredits.mockResolvedValueOnce(mockCastCredits);

    const { result } = renderHook(() => usePersonDetails(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.person).toBe(null);
    expect(result.current.castCredits).toEqual([]);
    expect(result.current.error).toEqual({
      message: 'Person not found',
      status: 404,
    });
  });

  it('should handle cast credits fetch error', async () => {
    const error = new PeopleServiceError('Failed to fetch credits', 500);
    mockFetchPersonById.mockResolvedValueOnce(mockPerson);
    mockGetPersonCastCredits.mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePersonDetails(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.person).toBe(null);
    expect(result.current.castCredits).toEqual([]);
    expect(result.current.error).toEqual({
      message: 'Failed to fetch credits',
      status: 500,
    });
  });

  it('should handle generic errors', async () => {
    const error = new Error('Network error');
    mockFetchPersonById.mockRejectedValueOnce(error);
    mockGetPersonCastCredits.mockResolvedValueOnce(mockCastCredits);

    const { result } = renderHook(() => usePersonDetails(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual({
      message: 'Failed to load person details',
    });
  });

  it('should not fetch when personId is 0 or falsy', () => {
    renderHook(() => usePersonDetails(0));

    expect(mockFetchPersonById).not.toHaveBeenCalled();
    expect(mockGetPersonCastCredits).not.toHaveBeenCalled();
  });

  it('should refetch when personId changes', async () => {
    mockFetchPersonById.mockResolvedValue(mockPerson);
    mockGetPersonCastCredits.mockResolvedValue(mockCastCredits);

    const { result, rerender } = renderHook(
      ({ personId }) => usePersonDetails(personId),
      { initialProps: { personId: 1 } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchPersonById).toHaveBeenCalledWith(1);

    // Clear mocks to test rerender
    mockFetchPersonById.mockClear();
    mockGetPersonCastCredits.mockClear();

    // Change personId
    rerender({ personId: 2 });

    await waitFor(() => {
      expect(mockFetchPersonById).toHaveBeenCalledWith(2);
      expect(mockGetPersonCastCredits).toHaveBeenCalledWith(2);
    });
  });

  it('should retry fetch when retryFetch is called', async () => {
    // First call fails
    const error = new PeopleServiceError('Network error', 500);
    mockFetchPersonById.mockRejectedValueOnce(error);
    mockGetPersonCastCredits.mockResolvedValueOnce(mockCastCredits);

    const { result } = renderHook(() => usePersonDetails(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();

    // Setup successful retry
    mockFetchPersonById.mockResolvedValueOnce(mockPerson);
    mockGetPersonCastCredits.mockResolvedValueOnce(mockCastCredits);

    // Call retry
    result.current.retryFetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.person).toEqual(mockPerson);
    expect(result.current.castCredits).toEqual(mockCastCredits);
    expect(result.current.error).toBe(null);
    expect(mockFetchPersonById).toHaveBeenCalledTimes(2);
  });

  it('should handle empty cast credits', async () => {
    mockFetchPersonById.mockResolvedValueOnce(mockPerson);
    mockGetPersonCastCredits.mockResolvedValueOnce([]);

    const { result } = renderHook(() => usePersonDetails(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.person).toEqual(mockPerson);
    expect(result.current.castCredits).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should handle parallel fetch failures', async () => {
    const personError = new PeopleServiceError('Person error', 404);
    const creditsError = new PeopleServiceError('Credits error', 500);
    
    mockFetchPersonById.mockRejectedValueOnce(personError);
    mockGetPersonCastCredits.mockRejectedValueOnce(creditsError);

    const { result } = renderHook(() => usePersonDetails(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should handle the first error encountered
    expect(result.current.error).toBeTruthy();
    expect(result.current.person).toBe(null);
    expect(result.current.castCredits).toEqual([]);
  });
});