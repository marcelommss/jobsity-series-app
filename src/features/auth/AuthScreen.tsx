import { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import BackgroundImage from '@assets/background.png';
import LogoImage from '@assets/logo.png';
import { useAuth } from './hooks/useAuth';
import packageJson from '../../../package.json';

const AuthScreen = () => {
  const { version } = packageJson;
  const router = useRouter();
  const {
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
  } = useAuth();

  useEffect(() => {
    if (authSuccess) {
      setTimeout(() => {
        try {
          router.replace('/(tabs)');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }, 100);
    }
  }, [authSuccess, router]);

  if (showBiometricPrompt && !isBiometricLoading) {
    return (
      <ImageBackground source={BackgroundImage} className="flex-1 bg-black">
        <SafeAreaView className="flex-1">
          <View className="h-1/4 my-12 mx-12">
            <Image
              source={LogoImage}
              className="w-full h-full"
              style={{ resizeMode: 'cover' }}
            />
          </View>

          <View className="flex justify-center items-center px-6">
            <View className="w-full bg-neutral-900 p-6 rounded-xl shadow-lg">
              <Text className="text-xl font-semibold mb-6 text-white text-center">
                Use Biometric Authentication
              </Text>

              <Text className="text-gray-400 text-center mb-8">
                Touch the fingerprint sensor or use face recognition to unlock
              </Text>

              <TouchableOpacity
                onPress={handleBiometricAuth}
                className="bg-red-600 rounded-lg py-4 mb-4"
              >
                <Text className="text-white text-lg font-semibold text-center">
                  Use Biometric
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={skipBiometric}
                className="bg-neutral-700 rounded-lg py-4"
              >
                <Text className="text-gray-300 text-lg font-semibold text-center">
                  Use PIN Instead
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="absolute bottom-0 left-0 right-0 mb-10">
            <Text className="text-center text-gray-300 text-sm">
              Version {version}
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BackgroundImage} className="flex-1 bg-black">
      <SafeAreaView className="flex-1">
        <View className="h-1/4 my-12 mx-12">
          <Image
            source={LogoImage}
            className="w-full h-full"
            style={{ resizeMode: 'cover' }}
          />
        </View>

        <View className="flex justify-center items-center px-6">
          <View className="w-full bg-neutral-900 p-6 rounded-xl shadow-lg">
            <Text className="text-xl font-semibold mb-6 text-white text-center">
              Enter your PIN
            </Text>

            {error ? (
              <View className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 mb-4">
                <Text className="text-red-400 text-center">{error}</Text>
              </View>
            ) : null}

            <TextInput
              value={pin}
              onChangeText={handlePinChange}
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
              placeholder="******"
              placeholderTextColor="#666"
              className="bg-neutral-800 text-white text-2xl text-center rounded-lg px-4 py-4 tracking-[0.75em] mb-6 border border-neutral-700 focus:border-red-500"
              editable={!isLoading}
            />

            <TouchableOpacity
              onPress={handlePinSubmit}
              disabled={isLoading || pin.length === 0}
              className="bg-red-600 rounded-lg py-4 mb-4 disabled:bg-neutral-700 disabled:opacity-50"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-semibold text-center">
                  Continue
                </Text>
              )}
            </TouchableOpacity>

            {biometricAvailable && (
              <View className="mt-6 pt-4 border-t border-neutral-700">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 mr-4">
                    <Text className="text-white font-medium mb-1">
                      Biometric Authentication
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Use fingerprint or face recognition
                    </Text>
                  </View>
                  <Switch
                    value={biometricEnabled}
                    onValueChange={toggleBiometric}
                    trackColor={{ false: '#374151', true: '#EF4444' }}
                    thumbColor={biometricEnabled ? '#FFFFFF' : '#9CA3AF'}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 mb-10">
          <Text className="text-center text-gray-300 text-sm">
            Version {version}
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default AuthScreen;
