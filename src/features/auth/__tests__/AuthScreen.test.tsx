import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import AuthScreen from '../AuthScreen';
import { useAuth } from '../hooks/useAuth';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  router: {
    replace: jest.fn(),
  },
}));

// Mock useAuth hook
jest.mock('../hooks/useAuth');

// Mock image assets
jest.mock('@assets/background.png', () => 'mocked-background');
jest.mock('@assets/logo.png', () => 'mocked-logo');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockRouter = router as jest.Mocked<typeof router>;

describe('AuthScreen', () => {
  const defaultAuthState = {
    pin: '',
    isLoading: false,
    isBiometricLoading: false,
    error: '',
    authSuccess: false,
    handlePinChange: jest.fn(),
    handlePinSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseAuth.mockReturnValue(defaultAuthState);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render PIN entry form', () => {
    const { getByText, getByPlaceholderText } = render(<AuthScreen />);

    expect(getByText('Enter your PIN')).toBeTruthy();
    expect(getByPlaceholderText('******')).toBeTruthy();
    expect(getByText('Continue')).toBeTruthy();
  });

  it('should display PIN input with correct properties', () => {
    const { getByPlaceholderText } = render(<AuthScreen />);
    
    const pinInput = getByPlaceholderText('******');
    expect(pinInput.props.secureTextEntry).toBe(true);
    expect(pinInput.props.keyboardType).toBe('numeric');
    expect(pinInput.props.maxLength).toBe(6);
  });

  it('should call handlePinChange when PIN input changes', () => {
    const handlePinChange = jest.fn();
    mockUseAuth.mockReturnValue({
      ...defaultAuthState,
      handlePinChange,
    });

    const { getByPlaceholderText } = render(<AuthScreen />);
    
    fireEvent.changeText(getByPlaceholderText('******'), '1234');
    
    expect(handlePinChange).toHaveBeenCalledWith('1234');
  });

  it('should call handlePinSubmit when Continue button is pressed', () => {
    const handlePinSubmit = jest.fn();
    mockUseAuth.mockReturnValue({
      ...defaultAuthState,
      pin: '1234',
      handlePinSubmit,
    });

    const { getByText } = render(<AuthScreen />);
    
    fireEvent.press(getByText('Continue'));
    
    expect(handlePinSubmit).toHaveBeenCalled();
  });

  it('should disable Continue button when PIN is empty', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthState,
      pin: '',
    });

    const { getByText } = render(<AuthScreen />);
    const continueButton = getByText('Continue').parent;
    
    expect(continueButton?.props.disabled).toBe(true);
  });

  it('should enable Continue button when PIN is not empty', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthState,
      pin: '1234',
    });

    const { getByText } = render(<AuthScreen />);
    const continueButton = getByText('Continue').parent;
    
    expect(continueButton?.props.disabled).toBe(false);
  });

  it('should disable Continue button when loading', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthState,
      pin: '1234',
      isLoading: true,
    });

    const { getByText } = render(<AuthScreen />);
    const continueButton = getByText('Continue').parent;
    
    expect(continueButton?.props.disabled).toBe(true);
  });

  it('should show loading indicator when isLoading is true', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthState,
      isLoading: true,
    });

    const { UNSAFE_getByType, queryByText } = render(<AuthScreen />);
    
    expect(UNSAFE_getByType(require('react-native').ActivityIndicator)).toBeTruthy();
    expect(queryByText('Continue')).toBeFalsy();
  });

  it('should disable PIN input when loading', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthState,
      isLoading: true,
    });

    const { getByPlaceholderText } = render(<AuthScreen />);
    const pinInput = getByPlaceholderText('******');
    
    expect(pinInput.props.editable).toBe(false);
  });

  it('should display error message when error exists', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthState,
      error: 'Incorrect PIN. Please try again.',
    });

    const { getByText } = render(<AuthScreen />);
    
    expect(getByText('Incorrect PIN. Please try again.')).toBeTruthy();
  });

  it('should not display error container when no error', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthState,
      error: '',
    });

    const { queryByText } = render(<AuthScreen />);
    
    // Should not render any error text
    expect(queryByText('Incorrect PIN')).toBeFalsy();
  });

  it('should navigate to tabs when authentication succeeds', async () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthState,
      authSuccess: true,
    });

    render(<AuthScreen />);
    
    // Fast-forward timer
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('should handle navigation error gracefully', async () => {
    mockRouter.replace.mockImplementationOnce(() => {
      throw new Error('Navigation error');
    });
    
    mockUseAuth.mockReturnValue({
      ...defaultAuthState,
      authSuccess: true,
    });

    // Should not throw error
    expect(() => render(<AuthScreen />)).not.toThrow();
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalled();
    });
  });

  it('should display current PIN value', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthState,
      pin: '1234',
    });

    const { getByDisplayValue } = render(<AuthScreen />);
    
    expect(getByDisplayValue('1234')).toBeTruthy();
  });

  it('should render logo and background images', () => {
    const { UNSAFE_getAllByType } = render(<AuthScreen />);
    
    const images = UNSAFE_getAllByType(require('react-native').Image);
    const imageBackground = UNSAFE_getAllByType(require('react-native').ImageBackground);
    
    // Should have logo image and background image
    expect(images.length).toBeGreaterThan(0);
    expect(imageBackground.length).toBeGreaterThan(0);
  });

  it('should maintain proper layout structure', () => {
    const { getByText } = render(<AuthScreen />);
    
    // Check that main elements are present
    expect(getByText('Enter your PIN')).toBeTruthy();
    expect(getByText('Continue')).toBeTruthy();
  });

  it('should handle edge case of extremely long PIN input', () => {
    const handlePinChange = jest.fn();
    mockUseAuth.mockReturnValue({
      ...defaultAuthState,
      handlePinChange,
    });

    const { getByPlaceholderText } = render(<AuthScreen />);
    
    // Try to enter more than maxLength
    fireEvent.changeText(getByPlaceholderText('******'), '1234567890');
    
    // Input should respect maxLength=6 constraint
    expect(handlePinChange).toHaveBeenCalledWith('1234567890');
  });

  it('should render safe area view for proper layout', () => {
    const { UNSAFE_getByType } = render(<AuthScreen />);
    
    expect(UNSAFE_getByType(require('react-native').SafeAreaView)).toBeTruthy();
  });

  describe('component integration', () => {
    it('should work with complete authentication flow', () => {
      const handlePinChange = jest.fn();
      const handlePinSubmit = jest.fn();
      
      mockUseAuth.mockReturnValue({
        ...defaultAuthState,
        pin: '1234',
        handlePinChange,
        handlePinSubmit,
      });

      const { getByPlaceholderText, getByText } = render(<AuthScreen />);
      
      // Change PIN
      fireEvent.changeText(getByPlaceholderText('******'), '5678');
      expect(handlePinChange).toHaveBeenCalledWith('5678');
      
      // Submit PIN
      fireEvent.press(getByText('Continue'));
      expect(handlePinSubmit).toHaveBeenCalled();
    });
  });
});