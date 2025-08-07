import { Tabs } from 'expo-router';
import { TvIcon, UsersIcon, HeartIcon } from 'lucide-react-native';

export default function TabsLayout() {
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
          href: null, // This hides the tab from the tab bar
        }}
      />
    </Tabs>
  );
}
