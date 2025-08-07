import { Pressable } from 'react-native';
import { Tabs, router } from 'expo-router';
import { TvIcon, UsersIcon, HeartIcon, LockIcon } from 'lucide-react-native';

export default function TabsLayout() {
  const handleLockPress = () => {
    router.push('/auth');
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#10F5D4',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#1A1D21',
          borderTopColor: '#2A2D32',
        },
        headerStyle: {
          backgroundColor: '#1A1D21',
        },
        headerTintColor: '#F8FAFC',
        headerRight: () => (
          <Pressable
            onPress={handleLockPress}
            className="mr-4 p-2 rounded-full"
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <LockIcon color="#F8FAFC" size={24} />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Shows',
          tabBarIcon: ({ color, size }) => <TvIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: 'People',
          tabBarIcon: ({ color, size }) => (
            <UsersIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <HeartIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
