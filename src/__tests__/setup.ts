// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: ({ children }: { children: React.ReactNode }) => children,
  },
  Tabs: {
    Screen: ({ children }: { children: React.ReactNode }) => children,
  },
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));

// Mock expo-font
jest.mock('@expo-google-fonts/host-grotesk', () => ({
  useFonts: () => [true, null],
  HostGrotesk_400Regular: 'HostGrotesk_400Regular',
  HostGrotesk_500Medium: 'HostGrotesk_500Medium',
  HostGrotesk_600SemiBold: 'HostGrotesk_600SemiBold',
  HostGrotesk_700Bold: 'HostGrotesk_700Bold',
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  TvIcon: 'TvIcon',
  UsersIcon: 'UsersIcon',
  HeartIcon: 'HeartIcon',
  SearchIcon: 'SearchIcon',
  ArrowLeftIcon: 'ArrowLeftIcon',
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock fetch for API calls
global.fetch = jest.fn();