import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import {
  savePin,
  getPin,
  deletePin,
  saveBiometricPreference,
  getBiometricPreference,
  hasHardwareAsync,
  isEnrolledAsync,
  authenticateWithBiometrics,
} from '../authentication';

// Mock expo modules
jest.mock('expo-secure-store');
jest.mock('expo-local-authentication');

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;
const mockLocalAuthentication = LocalAuthentication as jest.Mocked<typeof LocalAuthentication>;

describe('authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('savePin', () => {
    it('should save PIN successfully', async () => {
      mockSecureStore.setItemAsync.mockResolvedValueOnce(undefined);

      await savePin('1234');

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('user_pin', '1234');
    });

    it('should throw error when saving PIN fails', async () => {
      mockSecureStore.setItemAsync.mockRejectedValueOnce(new Error('Storage error'));

      await expect(savePin('1234')).rejects.toThrow('Failed to save PIN');
    });
  });

  describe('getPin', () => {
    it('should retrieve PIN successfully', async () => {
      mockSecureStore.getItemAsync.mockResolvedValueOnce('1234');

      const result = await getPin();

      expect(result).toBe('1234');
      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('user_pin');
    });

    it('should return null when PIN does not exist', async () => {
      mockSecureStore.getItemAsync.mockResolvedValueOnce(null);

      const result = await getPin();

      expect(result).toBeNull();
    });

    it('should return null when retrieval fails', async () => {
      mockSecureStore.getItemAsync.mockRejectedValueOnce(new Error('Storage error'));

      const result = await getPin();

      expect(result).toBeNull();
    });
  });

  describe('deletePin', () => {
    it('should delete PIN successfully', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValueOnce(undefined);

      await deletePin();

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('user_pin');
    });

    it('should throw error when deleting PIN fails', async () => {
      mockSecureStore.deleteItemAsync.mockRejectedValueOnce(new Error('Storage error'));

      await expect(deletePin()).rejects.toThrow('Failed to delete PIN');
    });
  });

  describe('saveBiometricPreference', () => {
    it('should save biometric preference as enabled', async () => {
      mockSecureStore.setItemAsync.mockResolvedValueOnce(undefined);

      await saveBiometricPreference(true);

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('use_biometric', 'true');
    });

    it('should save biometric preference as disabled', async () => {
      mockSecureStore.setItemAsync.mockResolvedValueOnce(undefined);

      await saveBiometricPreference(false);

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('use_biometric', 'false');
    });

    it('should throw error when saving biometric preference fails', async () => {
      mockSecureStore.setItemAsync.mockRejectedValueOnce(new Error('Storage error'));

      await expect(saveBiometricPreference(true)).rejects.toThrow('Failed to save biometric preference');
    });
  });

  describe('getBiometricPreference', () => {
    it('should return true when biometric preference is enabled', async () => {
      mockSecureStore.getItemAsync.mockResolvedValueOnce('true');

      const result = await getBiometricPreference();

      expect(result).toBe(true);
      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('use_biometric');
    });

    it('should return false when biometric preference is disabled', async () => {
      mockSecureStore.getItemAsync.mockResolvedValueOnce('false');

      const result = await getBiometricPreference();

      expect(result).toBe(false);
    });

    it('should return false when preference does not exist', async () => {
      mockSecureStore.getItemAsync.mockResolvedValueOnce(null);

      const result = await getBiometricPreference();

      expect(result).toBe(false);
    });

    it('should return false when retrieval fails', async () => {
      mockSecureStore.getItemAsync.mockRejectedValueOnce(new Error('Storage error'));

      const result = await getBiometricPreference();

      expect(result).toBe(false);
    });
  });

  describe('hasHardwareAsync', () => {
    it('should return true when biometric hardware is available', async () => {
      mockLocalAuthentication.hasHardwareAsync.mockResolvedValueOnce(true);

      const result = await hasHardwareAsync();

      expect(result).toBe(true);
    });

    it('should return false when biometric hardware is not available', async () => {
      mockLocalAuthentication.hasHardwareAsync.mockResolvedValueOnce(false);

      const result = await hasHardwareAsync();

      expect(result).toBe(false);
    });

    it('should return false when hardware check fails', async () => {
      mockLocalAuthentication.hasHardwareAsync.mockRejectedValueOnce(new Error('Hardware error'));

      const result = await hasHardwareAsync();

      expect(result).toBe(false);
    });
  });

  describe('isEnrolledAsync', () => {
    it('should return true when biometrics are enrolled', async () => {
      mockLocalAuthentication.isEnrolledAsync.mockResolvedValueOnce(true);

      const result = await isEnrolledAsync();

      expect(result).toBe(true);
    });

    it('should return false when biometrics are not enrolled', async () => {
      mockLocalAuthentication.isEnrolledAsync.mockResolvedValueOnce(false);

      const result = await isEnrolledAsync();

      expect(result).toBe(false);
    });

    it('should return false when enrollment check fails', async () => {
      mockLocalAuthentication.isEnrolledAsync.mockRejectedValueOnce(new Error('Enrollment error'));

      const result = await isEnrolledAsync();

      expect(result).toBe(false);
    });
  });

  describe('authenticateWithBiometrics', () => {
    it('should return true when authentication succeeds', async () => {
      mockLocalAuthentication.authenticateAsync.mockResolvedValueOnce({
        success: true,
        error: undefined,
        warning: undefined,
      });

      const result = await authenticateWithBiometrics();

      expect(result).toBe(true);
      expect(mockLocalAuthentication.authenticateAsync).toHaveBeenCalledWith({
        promptMessage: 'Authenticate to access the app',
        fallbackLabel: 'Use PIN',
      });
    });

    it('should return false when authentication fails', async () => {
      mockLocalAuthentication.authenticateAsync.mockResolvedValueOnce({
        success: false,
        error: 'user_cancel',
        warning: undefined,
      });

      const result = await authenticateWithBiometrics();

      expect(result).toBe(false);
    });

    it('should return false when authentication throws an error', async () => {
      mockLocalAuthentication.authenticateAsync.mockRejectedValueOnce(new Error('Auth error'));

      const result = await authenticateWithBiometrics();

      expect(result).toBe(false);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete PIN setup and retrieval flow', async () => {
      // Setup
      mockSecureStore.setItemAsync.mockResolvedValueOnce(undefined);
      mockSecureStore.getItemAsync.mockResolvedValueOnce('5678');

      // Save PIN
      await savePin('5678');
      
      // Retrieve PIN
      const retrievedPin = await getPin();
      
      expect(retrievedPin).toBe('5678');
    });

    it('should handle biometric preference complete flow', async () => {
      // Setup
      mockSecureStore.setItemAsync.mockResolvedValueOnce(undefined);
      mockSecureStore.getItemAsync.mockResolvedValueOnce('true');

      // Save preference
      await saveBiometricPreference(true);
      
      // Get preference
      const preference = await getBiometricPreference();
      
      expect(preference).toBe(true);
    });

    it('should handle biometric capabilities check', async () => {
      // Setup
      mockLocalAuthentication.hasHardwareAsync.mockResolvedValueOnce(true);
      mockLocalAuthentication.isEnrolledAsync.mockResolvedValueOnce(true);

      // Check capabilities
      const hasHardware = await hasHardwareAsync();
      const isEnrolled = await isEnrolledAsync();
      
      expect(hasHardware).toBe(true);
      expect(isEnrolled).toBe(true);
    });
  });
});