import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'user_pin';
const BIOMETRIC_KEY = 'use_biometric';

export async function savePin(pin: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(PIN_KEY, pin);
  } catch (error) {
    throw new Error('Failed to save PIN');
  }
}

export async function getPin(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(PIN_KEY);
  } catch (error) {
    return null;
  }
}

export async function deletePin(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(PIN_KEY);
  } catch (error) {
    throw new Error('Failed to delete PIN');
  }
}

export async function saveBiometricPreference(enabled: boolean): Promise<void> {
  try {
    await SecureStore.setItemAsync(BIOMETRIC_KEY, JSON.stringify(enabled));
  } catch (error) {
    throw new Error('Failed to save biometric preference');
  }
}

export async function getBiometricPreference(): Promise<boolean> {
  try {
    const result = await SecureStore.getItemAsync(BIOMETRIC_KEY);
    return result === 'true';
  } catch (error) {
    return false;
  }
}

export async function hasHardwareAsync(): Promise<boolean> {
  try {
    return await LocalAuthentication.hasHardwareAsync();
  } catch (error) {
    return false;
  }
}

export async function isEnrolledAsync(): Promise<boolean> {
  try {
    return await LocalAuthentication.isEnrolledAsync();
  } catch (error) {
    return false;
  }
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access the app',
      fallbackLabel: 'Use PIN',
    });
    return result.success;
  } catch (error) {
    return false;
  }
}
