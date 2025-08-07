import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '../useAuth';
import { getPin, savePin } from '@/services/authentication';

jest.mock('@/services/authentication');

const mockGetPin = getPin as jest.MockedFunction<typeof getPin>;
const mockSavePin = savePin as jest.MockedFunction<typeof savePin>;

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', async () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.pin).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('');
    expect(result.current.authSuccess).toBe(false);

    // isBiometricLoading starts as true but useEffect sets it to false
    // In test environment, useEffect runs immediately
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.isBiometricLoading).toBe(false);
  });

  it('should set biometric loading to false after mount', async () => {
    const { result } = renderHook(() => useAuth());

    // Wait for useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isBiometricLoading).toBe(false);
  });

  describe('handlePinChange', () => {
    it('should update pin value', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.handlePinChange('1234');
      });

      expect(result.current.pin).toBe('1234');
    });

    it('should clear error when changing pin', () => {
      const { result } = renderHook(() => useAuth());

      // Set an error first
      act(() => {
        result.current.handlePinSubmit();
      });

      expect(result.current.error).toBeTruthy();

      // Change pin should clear error
      act(() => {
        result.current.handlePinChange('5678');
      });

      expect(result.current.error).toBe('');
    });
  });

  describe('handlePinSubmit', () => {
    it('should show error for PIN shorter than 4 digits', async () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.handlePinChange('123');
      });

      await act(async () => {
        await result.current.handlePinSubmit();
      });

      expect(result.current.error).toBe('PIN must be at least 4 digits');
    });

    it('should save PIN when no stored PIN exists', async () => {
      const { result } = renderHook(() => useAuth());
      mockGetPin.mockResolvedValueOnce(null);
      mockSavePin.mockResolvedValueOnce();

      act(() => {
        result.current.handlePinChange('1234');
      });

      await act(async () => {
        await result.current.handlePinSubmit();
      });

      expect(mockGetPin).toHaveBeenCalled();
      expect(mockSavePin).toHaveBeenCalledWith('1234');
      expect(result.current.authSuccess).toBe(true);
    });

    it('should authenticate successfully with correct PIN', async () => {
      const { result } = renderHook(() => useAuth());
      mockGetPin.mockResolvedValueOnce('1234');

      act(() => {
        result.current.handlePinChange('1234');
      });

      await act(async () => {
        await result.current.handlePinSubmit();
      });

      expect(mockGetPin).toHaveBeenCalled();
      expect(mockSavePin).not.toHaveBeenCalled();
      expect(result.current.authSuccess).toBe(true);
    });

    it('should show error for incorrect PIN', async () => {
      const { result } = renderHook(() => useAuth());
      mockGetPin.mockResolvedValueOnce('1234');

      act(() => {
        result.current.handlePinChange('5678');
      });

      await act(async () => {
        await result.current.handlePinSubmit();
      });

      expect(result.current.error).toBe('Incorrect PIN. Please try again.');
      expect(result.current.pin).toBe('');
      expect(result.current.authSuccess).toBe(false);
    });

    it('should handle authentication service errors', async () => {
      const { result } = renderHook(() => useAuth());
      mockGetPin.mockRejectedValueOnce(new Error('Service error'));

      act(() => {
        result.current.handlePinChange('1234');
      });

      await act(async () => {
        await result.current.handlePinSubmit();
      });

      expect(result.current.error).toBe('Authentication failed. Please try again.');
      expect(result.current.authSuccess).toBe(false);
    });

    it('should set loading state during authentication', async () => {
      const { result } = renderHook(() => useAuth());
      
      let resolveGetPin: (value: any) => void;
      const getPinPromise = new Promise((resolve) => {
        resolveGetPin = resolve;
      });
      
      mockGetPin.mockReturnValueOnce(getPinPromise);

      act(() => {
        result.current.handlePinChange('1234');
      });

      // Start authentication
      act(() => {
        result.current.handlePinSubmit();
      });

      // Should be loading
      expect(result.current.isLoading).toBe(true);

      // Resolve the promise
      await act(async () => {
        resolveGetPin!('1234');
        await getPinPromise;
      });

      // Should no longer be loading
      expect(result.current.isLoading).toBe(false);
    });

    it('should clear error before starting new authentication', async () => {
      const { result } = renderHook(() => useAuth());

      // Set an error first
      act(() => {
        result.current.handlePinChange('123');
      });

      await act(async () => {
        await result.current.handlePinSubmit();
      });

      expect(result.current.error).toBeTruthy();

      // Start new authentication with valid PIN
      mockGetPin.mockResolvedValueOnce('1234');
      act(() => {
        result.current.handlePinChange('1234');
      });

      await act(async () => {
        await result.current.handlePinSubmit();
      });

      expect(result.current.error).toBe('');
    });

    it('should handle PIN save error when creating new PIN', async () => {
      const { result } = renderHook(() => useAuth());
      mockGetPin.mockResolvedValueOnce(null);
      mockSavePin.mockRejectedValueOnce(new Error('Save error'));

      act(() => {
        result.current.handlePinChange('1234');
      });

      await act(async () => {
        await result.current.handlePinSubmit();
      });

      expect(result.current.error).toBe('Authentication failed. Please try again.');
      expect(result.current.authSuccess).toBe(false);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete first-time PIN setup flow', async () => {
      const { result } = renderHook(() => useAuth());
      
      // No stored PIN exists
      mockGetPin.mockResolvedValueOnce(null);
      mockSavePin.mockResolvedValueOnce();

      // User enters new PIN
      act(() => {
        result.current.handlePinChange('1234');
      });

      // Submit PIN
      await act(async () => {
        await result.current.handlePinSubmit();
      });

      expect(result.current.pin).toBe('1234');
      expect(result.current.authSuccess).toBe(true);
      expect(result.current.error).toBe('');
      expect(mockSavePin).toHaveBeenCalledWith('1234');
    });

    it('should handle complete returning user authentication flow', async () => {
      const { result } = renderHook(() => useAuth());
      
      // Stored PIN exists
      mockGetPin.mockResolvedValueOnce('5678');

      // User enters correct PIN
      act(() => {
        result.current.handlePinChange('5678');
      });

      // Submit PIN
      await act(async () => {
        await result.current.handlePinSubmit();
      });

      expect(result.current.authSuccess).toBe(true);
      expect(result.current.error).toBe('');
      expect(mockSavePin).not.toHaveBeenCalled();
    });

    it('should handle error recovery flow', async () => {
      const { result } = renderHook(() => useAuth());

      // First attempt with short PIN
      act(() => {
        result.current.handlePinChange('12');
      });

      await act(async () => {
        await result.current.handlePinSubmit();
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.authSuccess).toBe(false);

      // Second attempt with correct PIN
      mockGetPin.mockResolvedValueOnce('1234');
      act(() => {
        result.current.handlePinChange('1234');
      });

      await act(async () => {
        await result.current.handlePinSubmit();
      });

      expect(result.current.error).toBe('');
      expect(result.current.authSuccess).toBe(true);
    });
  });
});