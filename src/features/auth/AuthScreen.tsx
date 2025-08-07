import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import BackgroundImage from '@assets/background.png';
import LogoImage from '@assets/logo.png';
import { useAuth } from './hooks/useAuth';

const AuthScreen = () => {
  const router = useRouter();
  const {
    pin,
    isLoading,
    isBiometricLoading,
    error,
    authSuccess,
    handlePinChange,
    handlePinSubmit,
  } = useAuth();

  useEffect(() => {
    if (authSuccess) {
      setTimeout(() => {
        try {
          router.replace('/(tabs)');
        } catch (error) {
        }
      }, 100);
    }
  }, [authSuccess, router]);

  return (
    <ImageBackground source={BackgroundImage} className="flex-1  bg-black">
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
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default AuthScreen;
