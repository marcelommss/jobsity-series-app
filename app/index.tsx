import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getPin } from '../src/services/authentication';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const pin = await getPin();
        if (!pin) {
          setTimeout(() => router.replace('/auth/'), 100);
          return;
        }

        setTimeout(() => {
          try {
            router.replace('/auth/');
          } catch (navError) {
          }
        }, 200);
      } catch (error) {
        setTimeout(() => router.replace('/auth/'), 100);
      }
    };

    checkAuth().finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
