import { useState, useEffect } from 'react';
import {
  getPin,
  savePin,
  getBiometricPreference,
  saveBiometricPreference,
  hasHardwareAsync,
  isEnrolledAsync,
  authenticateWithBiometrics,
} from '../../../services/authentication';

export const useAuth = () => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(true);
  const [error, setError] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const hasHardware = await hasHardwareAsync();
      const isEnrolled = await isEnrolledAsync();
      const biometricPref = await getBiometricPreference();
      
      setBiometricAvailable(hasHardware && isEnrolled);
      setBiometricEnabled(biometricPref);
      
      // Show biometric prompt if available and enabled
      if (hasHardware && isEnrolled && biometricPref) {
        const storedPin = await getPin();
        if (storedPin) {
          setShowBiometricPrompt(true);
          handleBiometricAuth();
        }
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    } finally {
      setIsBiometricLoading(false);
    }
  };



  const handlePinSubmit = async () => {
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const storedPin = await getPin();
      if (!storedPin) {
        await savePin(pin);
        setAuthSuccess(true);
      } else if (storedPin === pin) {
        setAuthSuccess(true);
      } else {
        setError('Incorrect PIN. Please try again.');
        setPin('');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinChange = (text: string) => {
    setPin(text);
    if (error) setError('');
  };

  const handleBiometricAuth = async () => {
    try {
      setIsBiometricLoading(true);
      const success = await authenticateWithBiometrics();
      if (success) {
        setAuthSuccess(true);
      } else {
        setShowBiometricPrompt(false);
        setError('Biometric authentication failed. Please enter your PIN.');
      }
    } catch (error) {
      setShowBiometricPrompt(false);
      setError('Biometric authentication error. Please enter your PIN.');
    } finally {
      setIsBiometricLoading(false);
    }
  };

  const toggleBiometric = async () => {
    try {
      const newValue = !biometricEnabled;
      await saveBiometricPreference(newValue);
      setBiometricEnabled(newValue);
    } catch (error) {
      setError('Failed to update biometric preference');
    }
  };

  const skipBiometric = () => {
    setShowBiometricPrompt(false);
    setIsBiometricLoading(false);
  };

  return {
    pin,
    isLoading,
    isBiometricLoading,
    error,
    authSuccess,
    biometricEnabled,
    biometricAvailable,
    showBiometricPrompt,
    handlePinChange,
    handlePinSubmit,
    handleBiometricAuth,
    toggleBiometric,
    skipBiometric,
  };
};
