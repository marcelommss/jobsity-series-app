import { useState, useEffect } from 'react';
import {
  getPin,
  savePin,
} from '../../../services/authentication';

export const useAuth = () => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(true);
  const [error, setError] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    setIsBiometricLoading(false);
  }, []);



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


  return {
    pin,
    isLoading,
    isBiometricLoading,
    error,
    authSuccess,
    handlePinChange,
    handlePinSubmit,
  };
};
